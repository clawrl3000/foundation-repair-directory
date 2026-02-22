#!/usr/bin/env python3
"""
Web search scraper for foundation repair businesses
Uses OpenClaw's web_search tool to find companies and compile them into OutScraper format CSV
"""

import csv
import json
import os
import sys
import time
from datetime import datetime
from typing import List, Dict, Any

# The 30 states with fewest businesses (from check-state-distribution.ts)
TARGET_STATES = [
    ('District Of Columbia', 'DC'), ('Arizona', 'AZ'), ('Alaska', 'AK'), ('Delaware', 'DE'), 
    ('Hawaii', 'HI'), ('Idaho', 'ID'), ('Iowa', 'IA'), ('Maine', 'ME'), ('Montana', 'MT'), 
    ('Nebraska', 'NE'), ('Nevada', 'NV'), ('New Hampshire', 'NH'), ('New Mexico', 'NM'), 
    ('North Dakota', 'ND'), ('Rhode Island', 'RI'), ('South Carolina', 'SC'), 
    ('South Dakota', 'SD'), ('Utah', 'UT'), ('Vermont', 'VT'), ('West Virginia', 'WV'), 
    ('Wyoming', 'WY'), ('Missouri', 'MO'), ('New York', 'NY'), ('Oklahoma', 'OK'), 
    ('Tennessee', 'TN'), ('California', 'CA'), ('Florida', 'FL'), ('Indiana', 'IN'), 
    ('Kentucky', 'KY'), ('Mississippi', 'MS')
]

# Major cities by state to target searches
STATE_CITIES = {
    'DC': ['Washington'],
    'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Glendale'],
    'AK': ['Anchorage', 'Fairbanks', 'Juneau'],
    'DE': ['Wilmington', 'Dover', 'Newark'],
    'HI': ['Honolulu', 'Pearl City', 'Hilo'],
    'ID': ['Boise', 'Meridian', 'Nampa', 'Idaho Falls'],
    'IA': ['Des Moines', 'Cedar Rapids', 'Davenport'],
    'ME': ['Portland', 'Lewiston', 'Bangor'],
    'MT': ['Billings', 'Missoula', 'Great Falls'],
    'NE': ['Omaha', 'Lincoln', 'Bellevue'],
    'NV': ['Las Vegas', 'Henderson', 'Reno'],
    'NH': ['Manchester', 'Nashua', 'Concord'],
    'NM': ['Albuquerque', 'Las Cruces', 'Rio Rancho'],
    'ND': ['Fargo', 'Bismarck', 'Grand Forks'],
    'RI': ['Providence', 'Warwick', 'Cranston'],
    'SC': ['Charleston', 'Columbia', 'North Charleston'],
    'SD': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
    'UT': ['Salt Lake City', 'West Valley City', 'Provo'],
    'VT': ['Burlington', 'South Burlington', 'Rutland'],
    'WV': ['Charleston', 'Huntington', 'Morgantown'],
    'WY': ['Cheyenne', 'Casper', 'Laramie'],
    'MO': ['Kansas City', 'St. Louis', 'Springfield'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'],
    'OK': ['Oklahoma City', 'Tulsa', 'Norman'],
    'TN': ['Nashville', 'Memphis', 'Knoxville'],
    'CA': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno'],
    'FL': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg'],
    'IN': ['Indianapolis', 'Fort Wayne', 'Evansville'],
    'KY': ['Louisville', 'Lexington', 'Bowling Green'],
    'MS': ['Jackson', 'Gulfport', 'Southaven']
}

class WebSearchScraper:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.scraped_date = datetime.now().strftime('%Y-%m-%d')
        
    def search_businesses(self, state_name: str, state_abbrev: str, city: str) -> List[Dict[str, Any]]:
        """Search for foundation repair businesses in a specific city/state"""
        businesses = []
        
        # Try different search queries
        queries = [
            f"foundation repair companies {city} {state_name}",
            f"foundation repair contractors {city} {state_abbrev}",
            f"basement waterproofing {city} {state_name}",
            f"concrete foundation repair {city} {state_abbrev}"
        ]
        
        for query in queries:
            try:
                print(f"Searching: {query}")
                # This would be replaced with actual web_search call in OpenClaw environment
                # For now, we'll structure it to be filled in by the calling system
                search_results = self._mock_search(query, city, state_name, state_abbrev)
                businesses.extend(search_results)
                
                # Rate limiting
                time.sleep(2)
                
            except Exception as e:
                print(f"Error searching {query}: {e}")
                
        return businesses
    
    def _mock_search(self, query: str, city: str, state_name: str, state_abbrev: str) -> List[Dict[str, Any]]:
        """Mock search results - this will be replaced with real web_search calls"""
        # This is just a placeholder structure
        return [{
            'business_name': f'Mock Foundation Repair Co - {city}',
            'phone': '',
            'address': f'{city}, {state_abbrev}',
            'city': city,
            'state': state_abbrev,
            'zip': '',
            'website': '',
            'rating': '',
            'review_count': '',
            'description': 'Foundation repair and waterproofing services',
            'latitude': '',
            'longitude': '',
            'source_query': query,
            'scraped_date': self.scraped_date
        }]
    
    def save_to_csv(self, businesses: List[Dict[str, Any]], state_abbrev: str):
        """Save businesses to CSV file in OutScraper format"""
        if not businesses:
            return
            
        filename = f"foundation_repair_search_{state_abbrev.lower()}_{self.scraped_date}.csv"
        filepath = os.path.join(self.output_dir, filename)
        
        # OutScraper CSV headers
        headers = [
            'business_name', 'phone', 'address', 'city', 'state', 'zip',
            'website', 'rating', 'review_count', 'description', 
            'latitude', 'longitude', 'source_query', 'scraped_date'
        ]
        
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(businesses)
            
        print(f"Saved {len(businesses)} businesses to {filename}")

def main():
    output_dir = "/Users/clawrl/clawd/directory-research/raw-data"
    scraper = WebSearchScraper(output_dir)
    
    # Focus on first 10 states for initial batch
    initial_states = TARGET_STATES[:10]
    
    for state_name, state_abbrev in initial_states:
        print(f"\n=== Processing {state_name} ({state_abbrev}) ===")
        
        cities = STATE_CITIES.get(state_abbrev, [state_name])
        all_businesses = []
        
        for city in cities[:3]:  # Limit to top 3 cities per state initially
            print(f"Searching in {city}...")
            businesses = scraper.search_businesses(state_name, state_abbrev, city)
            all_businesses.extend(businesses)
        
        # Remove duplicates based on business name
        seen_names = set()
        unique_businesses = []
        for business in all_businesses:
            name_key = business['business_name'].lower().strip()
            if name_key not in seen_names:
                seen_names.add(name_key)
                unique_businesses.append(business)
        
        scraper.save_to_csv(unique_businesses, state_abbrev)
        print(f"Completed {state_name}: {len(unique_businesses)} unique businesses")

if __name__ == "__main__":
    main()