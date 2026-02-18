#!/usr/bin/env python3
"""
Foundation Scout Business Data Scraper
Scrapes business websites to extract services, features, and reviews
"""

import os
import sys
import json
import time
import logging
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from supabase import create_client, Client
from anthropic import Anthropic
from typing import List, Dict, Any, Optional
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrape_log.txt'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class BusinessDataScraper:
    def __init__(self):
        """Initialize the scraper with API clients"""
        # Supabase setup
        self.supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials in environment variables")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Anthropic setup
        anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        if not anthropic_api_key:
            logger.warning("No ANTHROPIC_API_KEY found - will use rule-based extraction")
            self.anthropic = None
        else:
            self.anthropic = Anthropic(api_key=anthropic_api_key)
        
        # Request session with headers to avoid blocks
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })

    def get_texas_businesses(self) -> List[Dict]:
        """Get all Texas businesses from Supabase"""
        try:
            # Get Texas state_id
            states = self.supabase.table('states').select('id').eq('abbreviation', 'TX').execute()
            if not states.data:
                raise ValueError("Texas state not found in database")
            
            texas_state_id = states.data[0]['id']
            
            # Get businesses in Texas with website URLs
            result = self.supabase.table('businesses').select(
                'id,name,slug,website_url'
            ).eq('state_id', texas_state_id).not_.is_('website_url', 'null').execute()
            
            logger.info(f"Found {len(result.data)} Texas businesses with websites")
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching Texas businesses: {e}")
            return []

    def scrape_website(self, url: str) -> Optional[str]:
        """Scrape website content with error handling"""
        try:
            logger.info(f"Scraping: {url}")
            
            # Clean and validate URL
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            response = self.session.get(url, timeout=15, allow_redirects=True)
            response.raise_for_status()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text()
            
            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            # Limit text length for API calls
            if len(text) > 8000:
                text = text[:8000] + "..."
            
            logger.info(f"Extracted {len(text)} characters from {url}")
            return text
            
        except requests.exceptions.RequestException as e:
            logger.warning(f"Request failed for {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return None

    def extract_data_with_claude(self, website_text: str, business_name: str) -> Dict[str, Any]:
        """Extract services, features, and reviews using Claude API"""
        if not self.anthropic:
            return self.extract_data_rule_based(website_text, business_name)
        
        try:
            prompt = f"""
            Analyze this foundation repair business website text and extract:

            1. SERVICES: List specific foundation repair services offered (e.g., "Pier & Beam Repair", "Slab Leveling", "French Drain Installation")
            2. FEATURES: List unique features or differentiators (e.g., "25-Year Transferable Warranty", "Same-Day Inspections", "Military Discount")
            3. REVIEWS: Extract any customer testimonials or reviews with reviewer name (if available), rating (if available), and review text

            Business Name: {business_name}

            Website Text:
            {website_text}

            Return response as JSON with this exact structure:
            {{
                "services": ["service1", "service2", ...],
                "features": ["feature1", "feature2", ...],
                "reviews": [
                    {{
                        "reviewer_name": "Name or null",
                        "rating": "1-5 or null",
                        "review_text": "review content"
                    }}
                ]
            }}

            Important:
            - Only extract services actually mentioned, don't assume generic services
            - Features should be unique selling points, not just "experienced" or "reliable"
            - Reviews should be actual customer testimonials, not marketing copy
            - Return valid JSON only
            """

            response = self.anthropic.messages.create(
                model="claude-3-haiku-20241022",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Parse JSON response
            response_text = response.content[0].text.strip()
            
            # Clean up response if it has markdown formatting
            if response_text.startswith('```json'):
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif response_text.startswith('```'):
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            data = json.loads(response_text)
            logger.info(f"Claude extracted: {len(data.get('services', []))} services, {len(data.get('features', []))} features, {len(data.get('reviews', []))} reviews")
            return data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Claude response as JSON: {e}")
            return self.extract_data_rule_based(website_text, business_name)
        except Exception as e:
            logger.error(f"Claude API error: {e}")
            return self.extract_data_rule_based(website_text, business_name)

    def extract_data_rule_based(self, website_text: str, business_name: str) -> Dict[str, Any]:
        """Fallback rule-based extraction"""
        text_lower = website_text.lower()
        
        # Common foundation services
        service_keywords = [
            'pier and beam repair', 'pier & beam repair', 'slab repair', 'foundation repair',
            'house leveling', 'foundation leveling', 'underpinning', 'push piers', 'helical piers',
            'foundation cracks', 'crack repair', 'basement waterproofing', 'crawl space',
            'french drain', 'drainage', 'concrete lifting', 'slabjacking', 'mudjacking'
        ]
        
        # Common features
        feature_keywords = [
            'lifetime warranty', 'transferable warranty', 'year warranty', 'free inspection',
            'free estimate', 'licensed and insured', 'financing available', 'emergency service',
            'same day', 'military discount', 'senior discount', 'bbb accredited'
        ]
        
        services = []
        for keyword in service_keywords:
            if keyword in text_lower:
                # Capitalize properly
                service = ' '.join(word.capitalize() for word in keyword.split())
                if service not in services:
                    services.append(service)
        
        features = []
        for keyword in feature_keywords:
            if keyword in text_lower:
                # Extract warranty years if found
                if 'year warranty' in keyword:
                    match = re.search(r'(\d+)[-\s]*year warranty', text_lower)
                    if match:
                        feature = f"{match.group(1)}-Year Warranty"
                    else:
                        feature = ' '.join(word.capitalize() for word in keyword.split())
                else:
                    feature = ' '.join(word.capitalize() for word in keyword.split())
                
                if feature not in features:
                    features.append(feature)
        
        # Simple review extraction (look for testimonials)
        reviews = []
        testimonial_patterns = [
            r'"([^"]{50,200})"[^\w]*[-–—]?\s*([A-Z][a-z]+ [A-Z]\.?|[A-Z][a-z]+)',
            r'testimonial[:\s]+["\']([^"\']{50,200})["\'][^\w]*[-–—]?\s*([A-Z][a-z]+ [A-Z]\.?|[A-Z][a-z]+)',
        ]
        
        for pattern in testimonial_patterns:
            matches = re.finditer(pattern, website_text, re.IGNORECASE)
            for match in matches:
                review_text = match.group(1).strip()
                reviewer_name = match.group(2).strip() if len(match.groups()) > 1 else None
                
                if len(review_text) > 30:  # Filter out too short reviews
                    reviews.append({
                        "reviewer_name": reviewer_name,
                        "rating": None,
                        "review_text": review_text
                    })
        
        logger.info(f"Rule-based extracted: {len(services)} services, {len(features)} features, {len(reviews)} reviews")
        return {
            "services": services,
            "features": features,
            "reviews": reviews
        }

    def save_to_database(self, business_id: str, extracted_data: Dict[str, Any]) -> bool:
        """Save extracted data to Supabase"""
        try:
            # Save services
            services_data = extracted_data.get('services', [])
            for service_name in services_data:
                try:
                    # Check if service exists, create if not
                    existing = self.supabase.table('services').select('id').eq('name', service_name).execute()
                    
                    if existing.data:
                        service_id = existing.data[0]['id']
                    else:
                        # Create new service
                        slug = service_name.lower().replace(' ', '-').replace('&', 'and')
                        new_service = self.supabase.table('services').insert({
                            'name': service_name,
                            'slug': slug
                        }).execute()
                        service_id = new_service.data[0]['id']
                    
                    # Link to business
                    self.supabase.table('business_services').upsert({
                        'business_id': business_id,
                        'service_id': service_id
                    }).execute()
                    
                except Exception as e:
                    logger.error(f"Error saving service {service_name}: {e}")
            
            # Save features
            features_data = extracted_data.get('features', [])
            for feature_name in features_data:
                try:
                    # Check if feature exists, create if not
                    existing = self.supabase.table('features').select('id').eq('name', feature_name).execute()
                    
                    if existing.data:
                        feature_id = existing.data[0]['id']
                    else:
                        # Create new feature
                        slug = feature_name.lower().replace(' ', '-').replace('&', 'and')
                        new_feature = self.supabase.table('features').insert({
                            'name': feature_name,
                            'slug': slug,
                            'category': 'extracted'  # Mark as auto-extracted
                        }).execute()
                        feature_id = new_feature.data[0]['id']
                    
                    # Link to business
                    self.supabase.table('business_features').upsert({
                        'business_id': business_id,
                        'feature_id': feature_id,
                        'value': 'yes'  # Default value
                    }).execute()
                    
                except Exception as e:
                    logger.error(f"Error saving feature {feature_name}: {e}")
            
            # Save reviews (Note: reviews table needs to be created in Supabase first)
            reviews_data = extracted_data.get('reviews', [])
            for review in reviews_data:
                try:
                    self.supabase.table('reviews').insert({
                        'business_id': business_id,
                        'reviewer_name': review.get('reviewer_name'),
                        'rating': review.get('rating'),
                        'review_text': review.get('review_text'),
                        'source': 'website'
                    }).execute()
                except Exception as e:
                    logger.error(f"Error saving review: {e} (Note: reviews table may not exist yet)")
            
            logger.info(f"Saved data for business {business_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving to database: {e}")
            return False

    def scrape_business(self, business: Dict[str, Any], test_mode: bool = False) -> bool:
        """Scrape a single business"""
        business_id = business['id']
        business_name = business['name']
        website_url = business['website_url']
        
        logger.info(f"\n{'='*60}")
        logger.info(f"Processing: {business_name}")
        logger.info(f"Website: {website_url}")
        
        # Scrape website
        website_text = self.scrape_website(website_url)
        if not website_text:
            logger.warning(f"Failed to scrape website for {business_name}")
            return False
        
        # Extract data
        extracted_data = self.extract_data_with_claude(website_text, business_name)
        
        if test_mode:
            # In test mode, just print the results
            print(f"\n--- EXTRACTED DATA FOR {business_name} ---")
            print(f"Services ({len(extracted_data.get('services', []))}): {extracted_data.get('services', [])}")
            print(f"Features ({len(extracted_data.get('features', []))}): {extracted_data.get('features', [])}")
            print(f"Reviews ({len(extracted_data.get('reviews', []))}): {len(extracted_data.get('reviews', []))} found")
            if extracted_data.get('reviews'):
                for i, review in enumerate(extracted_data['reviews'][:2]):  # Show first 2
                    print(f"  Review {i+1}: {review['review_text'][:100]}...")
            return True
        else:
            # Save to database
            return self.save_to_database(business_id, extracted_data)

    def run(self, limit: int = None, test_mode: bool = False):
        """Run the scraper"""
        logger.info("Starting Foundation Scout Business Data Scraper")
        
        # Get businesses
        businesses = self.get_texas_businesses()
        if not businesses:
            logger.error("No businesses found")
            return
        
        if limit:
            businesses = businesses[:limit]
            logger.info(f"Limited to first {limit} businesses")
        
        # Process businesses
        successful = 0
        failed = 0
        
        for i, business in enumerate(businesses, 1):
            logger.info(f"\nProcessing {i}/{len(businesses)}: {business['name']}")
            
            try:
                if self.scrape_business(business, test_mode=test_mode):
                    successful += 1
                else:
                    failed += 1
                    
                # Rate limiting
                if not test_mode:
                    time.sleep(2)  # 2 second delay between requests
                    
            except KeyboardInterrupt:
                logger.info("Interrupted by user")
                break
            except Exception as e:
                logger.error(f"Unexpected error processing {business['name']}: {e}")
                failed += 1
        
        # Summary
        logger.info(f"\n{'='*60}")
        logger.info(f"SCRAPING COMPLETE")
        logger.info(f"Successful: {successful}")
        logger.info(f"Failed: {failed}")
        logger.info(f"Total: {len(businesses)}")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape foundation repair business data')
    parser.add_argument('--limit', type=int, help='Limit number of businesses to process')
    parser.add_argument('--test', action='store_true', help='Test mode - print results without saving')
    args = parser.parse_args()
    
    try:
        scraper = BusinessDataScraper()
        scraper.run(limit=args.limit, test_mode=args.test)
    except KeyboardInterrupt:
        logger.info("Script interrupted by user")
    except Exception as e:
        logger.error(f"Script failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()