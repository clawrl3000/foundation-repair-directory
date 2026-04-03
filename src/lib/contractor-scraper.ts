import axios from 'axios'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const SCRAPE_CACHE_DAYS = 30 // Re-scrape after 30 days

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface ContractorProfile {
  name: string
  phone: string | null
  website_url: string | null
  rating: number | null
  review_count: number | null
  address: string | null
  // Scraped data
  services: string[]
  specialties: string[]
  pricing_info: string | null
  warranty_info: string | null
  free_inspection: boolean | null
  service_area: string | null
  years_in_business: string | null
  certifications: string[]
  about_summary: string | null
  scraped: boolean
}

// ── Extract useful info from a contractor's website ─────────────────────────
async function scrapeContractorSite(url: string): Promise<Partial<ContractorProfile>> {
  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FoundationScout/1.0; +https://foundationscout.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      maxRedirects: 3,
    })

    const $ = cheerio.load(response.data)
    const bodyText = $('body').text().replace(/\s+/g, ' ').toLowerCase()
    const fullText = $('body').text().replace(/\s+/g, ' ')

    // ── Extract services ──────────────────────────────────────────────────
    const serviceKeywords = [
      'foundation repair', 'basement waterproofing', 'crawl space',
      'pier installation', 'slab repair', 'crack repair', 'crack injection',
      'wall anchors', 'carbon fiber', 'french drain', 'sump pump',
      'helical piers', 'push piers', 'mudjacking', 'polyurethane foam',
      'structural repair', 'bowing wall', 'egress window', 'encapsulation',
      'drainage', 'grading', 'underpinning', 'leveling', 'lifting',
      'sealing', 'mold remediation', 'dehumidifier',
    ]
    const services = serviceKeywords.filter(s => bodyText.includes(s))

    // ── Extract specialties (what they emphasize) ─────────────────────────
    const specialties: string[] = []
    if (bodyText.includes('residential') && bodyText.includes('commercial')) {
      specialties.push('Residential & Commercial')
    } else if (bodyText.includes('residential')) {
      specialties.push('Residential')
    } else if (bodyText.includes('commercial')) {
      specialties.push('Commercial')
    }
    if (bodyText.includes('24/7') || bodyText.includes('24 hour') || bodyText.includes('emergency')) {
      specialties.push('24/7 Emergency Service')
    }
    if (bodyText.includes('family owned') || bodyText.includes('family-owned')) {
      specialties.push('Family-Owned')
    }
    if (bodyText.includes('locally owned') || bodyText.includes('locally-owned') || bodyText.includes('local')) {
      specialties.push('Locally Owned')
    }

    // ── Pricing info ──────────────────────────────────────────────────────
    let pricing_info: string | null = null
    const pricePatterns = [
      /(?:starting|from|as low as|prices? (?:start|begin|from))[\s:]*\$[\d,]+/i,
      /free\s+(?:estimate|inspection|consultation|assessment|quote)/i,
      /\$[\d,]+\s*[-–]\s*\$[\d,]+/,
      /financing\s+(?:available|options|offered)/i,
    ]
    for (const pattern of pricePatterns) {
      const match = fullText.match(pattern)
      if (match) {
        pricing_info = (pricing_info ? pricing_info + '; ' : '') + match[0].trim()
      }
    }

    // ── Free inspection ───────────────────────────────────────────────────
    const free_inspection = /free\s+(?:inspection|estimate|consultation|assessment|evaluation)/i.test(fullText)

    // ── Warranty info ─────────────────────────────────────────────────────
    let warranty_info: string | null = null
    const warrantyPatterns = [
      /(?:lifetime|limited lifetime|transferable|25[- ]year|20[- ]year|10[- ]year)\s+warranty/i,
      /warranty[\s:]+[^.]{10,80}\./i,
      /guaranteed\s+[^.]{10,60}\./i,
    ]
    for (const pattern of warrantyPatterns) {
      const match = fullText.match(pattern)
      if (match) {
        warranty_info = match[0].trim()
        break
      }
    }

    // ── Service area ──────────────────────────────────────────────────────
    let service_area: string | null = null
    const areaPatterns = [
      /serv(?:ing|ice area|ices?)[\s:]+([^.]{10,100})/i,
      /proudly serv(?:ing|e)[\s:]+([^.]{10,100})/i,
    ]
    for (const pattern of areaPatterns) {
      const match = fullText.match(pattern)
      if (match) {
        service_area = match[1]?.trim().substring(0, 100) || null
        break
      }
    }

    // ── Years in business ─────────────────────────────────────────────────
    let years_in_business: string | null = null
    const yearsPatterns = [
      /(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|in business|serving)/i,
      /since\s+((?:19|20)\d{2})/i,
      /established\s+(?:in\s+)?((?:19|20)\d{2})/i,
      /founded\s+(?:in\s+)?((?:19|20)\d{2})/i,
    ]
    for (const pattern of yearsPatterns) {
      const match = fullText.match(pattern)
      if (match) {
        years_in_business = match[0].trim()
        break
      }
    }

    // ── Certifications ────────────────────────────────────────────────────
    const certKeywords = ['bbb', 'a+ rated', 'certified', 'licensed', 'insured', 'bonded', 'accredited']
    const certifications = certKeywords.filter(c => bodyText.includes(c)).map(c => {
      if (c === 'bbb') return 'BBB Accredited'
      if (c === 'a+ rated') return 'A+ BBB Rating'
      return c.charAt(0).toUpperCase() + c.slice(1)
    })

    // ── About/summary (meta description or first paragraph) ──────────────
    let about_summary = $('meta[name="description"]').attr('content') || null
    if (!about_summary) {
      // Try to grab first meaningful paragraph
      const firstP = $('p').filter(function () {
        const text = $(this).text().trim()
        return text.length > 50 && text.length < 500
      }).first().text().trim()
      if (firstP) about_summary = firstP.substring(0, 300)
    }

    return {
      services,
      specialties,
      pricing_info,
      warranty_info,
      free_inspection,
      service_area,
      years_in_business,
      certifications,
      about_summary: about_summary?.substring(0, 300) || null,
      scraped: true,
    }
  } catch (err: any) {
    console.error(`Scrape failed for ${url}: ${err.message}`)
    return { scraped: false, services: [], specialties: [], certifications: [] }
  }
}

// ── Main function: get enriched contractor profiles ─────────────────────────
export async function getEnrichedContractors(contractors: any[]): Promise<ContractorProfile[]> {
  const supabase = getSupabase()
  const enriched: ContractorProfile[] = []

  for (const contractor of contractors.slice(0, 5)) {
    // Check if we have cached scraped data
    const cacheAge = contractor.scraped_at
      ? (Date.now() - new Date(contractor.scraped_at).getTime()) / (1000 * 60 * 60 * 24)
      : Infinity

    let scrapedData: Partial<ContractorProfile> = {}

    if (contractor.scraped_data && cacheAge < SCRAPE_CACHE_DAYS) {
      // Use cached data
      scrapedData = contractor.scraped_data as Partial<ContractorProfile>
      scrapedData.scraped = true
    } else if (contractor.website_url) {
      // Scrape fresh
      scrapedData = await scrapeContractorSite(contractor.website_url)

      // Cache the results
      if (scrapedData.scraped) {
        await supabase
          .from('businesses')
          .update({
            scraped_data: scrapedData,
            scraped_at: new Date().toISOString(),
          })
          .eq('id', contractor.id)
      }
    }

    enriched.push({
      name: contractor.name,
      phone: contractor.phone,
      website_url: contractor.website_url,
      rating: contractor.rating,
      review_count: contractor.review_count,
      address: contractor.address,
      services: scrapedData.services || [],
      specialties: scrapedData.specialties || [],
      pricing_info: scrapedData.pricing_info || null,
      warranty_info: scrapedData.warranty_info || null,
      free_inspection: scrapedData.free_inspection || null,
      service_area: scrapedData.service_area || null,
      years_in_business: scrapedData.years_in_business || null,
      certifications: scrapedData.certifications || [],
      about_summary: scrapedData.about_summary || null,
      scraped: scrapedData.scraped || false,
    })
  }

  return enriched
}
