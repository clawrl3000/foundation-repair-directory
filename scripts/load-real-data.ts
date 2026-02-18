/**
 * Load real scraped business data from CSVs into Supabase
 * Handles two CSV formats:
 * 1. OutScraper format: business_name,phone,address,city,state,zip,website,rating,review_count,description,latitude,longitude,source_query,scraped_date
 * 2. Florida format: business_name,phone,address,city,state,rating,review_count,website_url,description,year_established
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const RAW_DATA_DIR = path.join(__dirname, '../../directory-research/raw-data')

// State name to abbreviation mapping
const STATE_ABBREVS: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  'district of columbia': 'DC'
}

// Reverse mapping
const ABBREV_TO_NAME: Record<string, string> = {}
for (const [name, abbrev] of Object.entries(STATE_ABBREVS)) {
  ABBREV_TO_NAME[abbrev] = name
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes
    } else if (line[i] === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += line[i]
    }
  }
  result.push(current.trim())
  return result
}

interface RawBusiness {
  name: string
  phone: string
  address: string
  city: string
  stateName: string
  stateAbbrev: string
  zip: string
  website: string
  rating: number | null
  reviewCount: number
  description: string
  latitude: number | null
  longitude: number | null
  yearEstablished: number | null
}

function normalizeState(raw: string): { name: string; abbrev: string } | null {
  const s = raw.trim().toLowerCase()
  if (STATE_ABBREVS[s]) return { name: s.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), abbrev: STATE_ABBREVS[s] }
  const upper = s.toUpperCase()
  if (ABBREV_TO_NAME[upper]) {
    const name = ABBREV_TO_NAME[upper]
    return { name: name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), abbrev: upper }
  }
  return null
}

function loadCSVs(): RawBusiness[] {
  const businesses: RawBusiness[] = []
  const seen = new Set<string>()
  
  const files = fs.readdirSync(RAW_DATA_DIR).filter(f => f.endsWith('.csv'))
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(RAW_DATA_DIR, file), 'utf-8')
    const lines = content.split('\n').filter(l => l.trim())
    if (lines.length < 2) continue
    
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim())
    
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h] = fields[idx] || '' })
      
      const name = row['business_name'] || ''
      if (!name) continue
      
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (seen.has(key)) continue
      seen.add(key)
      
      const stateRaw = row['state'] || ''
      const stateInfo = normalizeState(stateRaw)
      if (!stateInfo) {
        // Try to extract state from filename
        const match = file.match(/foundation_repair_search_(.+?)_\d/)
        if (match) {
          const fromFile = normalizeState(match[1].replace(/_/g, ' '))
          if (!fromFile) continue
          Object.assign(stateInfo || {}, fromFile)
        } else continue
      }
      
      const rating = parseFloat(row['rating'] || '')
      const reviewCount = parseInt(row['review_count'] || '0')
      const lat = parseFloat(row['latitude'] || '')
      const lng = parseFloat(row['longitude'] || '')
      const yearEst = parseInt(row['year_established'] || '')
      
      businesses.push({
        name,
        phone: row['phone'] || '',
        address: row['address'] || '',
        city: row['city'] || '',
        stateName: stateInfo!.name,
        stateAbbrev: stateInfo!.abbrev,
        zip: row['zip'] || '',
        website: row['website'] || row['website_url'] || '',
        rating: isNaN(rating) ? null : rating,
        reviewCount: isNaN(reviewCount) ? 0 : reviewCount,
        description: row['description'] || '',
        latitude: isNaN(lat) ? null : lat,
        longitude: isNaN(lng) ? null : lng,
        yearEstablished: isNaN(yearEst) ? null : yearEst,
      })
    }
  }
  
  return businesses
}

async function main() {
  console.log('Loading CSVs...')
  const businesses = loadCSVs()
  console.log(`Found ${businesses.length} unique businesses`)
  
  // Collect unique states and cities
  const stateSet = new Map<string, { name: string; abbrev: string }>()
  const citySet = new Map<string, { name: string; stateName: string }>()
  
  for (const b of businesses) {
    stateSet.set(b.stateAbbrev, { name: b.stateName, abbrev: b.stateAbbrev })
    if (b.city) {
      citySet.set(`${b.city.toLowerCase()}|${b.stateAbbrev}`, { name: b.city, stateName: b.stateName })
    }
  }
  
  // Also ensure all 50 states exist
  for (const [name, abbrev] of Object.entries(STATE_ABBREVS)) {
    if (!stateSet.has(abbrev)) {
      stateSet.set(abbrev, { 
        name: name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), 
        abbrev 
      })
    }
  }
  
  // Insert states
  console.log(`Inserting ${stateSet.size} states...`)
  const stateRows = Array.from(stateSet.values()).map(s => ({
    name: s.name,
    abbreviation: s.abbrev,
    slug: slugify(s.name),
  }))
  
  const { data: insertedStates, error: stateErr } = await supabase
    .from('states')
    .upsert(stateRows, { onConflict: 'slug' })
    .select('id, abbreviation, slug')
  
  if (stateErr) { console.error('State insert error:', stateErr); return }
  console.log(`Inserted ${insertedStates?.length} states`)
  
  // Build state lookup
  const stateLookup = new Map<string, number>()
  for (const s of insertedStates || []) {
    stateLookup.set(s.abbreviation, s.id)
  }
  
  // Insert cities
  console.log(`Inserting ${citySet.size} cities...`)
  const cityRows = Array.from(citySet.entries()).map(([key, c]) => {
    const abbrev = key.split('|')[1]
    return {
      name: c.name,
      slug: slugify(c.name),
      state_id: stateLookup.get(abbrev),
    }
  }).filter(c => c.state_id)
  
  // Batch insert cities (some may have duplicate slugs within a state)
  const uniqueCityRows: typeof cityRows = []
  const cityKeys = new Set<string>()
  for (const c of cityRows) {
    const key = `${c.slug}-${c.state_id}`
    if (!cityKeys.has(key)) {
      cityKeys.add(key)
      uniqueCityRows.push(c)
    }
  }
  
  // Insert in batches of 100
  const cityLookup = new Map<string, number>() // "cityslug|stateId" -> cityId
  for (let i = 0; i < uniqueCityRows.length; i += 100) {
    const batch = uniqueCityRows.slice(i, i + 100)
    const { data: insertedCities, error: cityErr } = await supabase
      .from('cities')
      .upsert(batch, { onConflict: 'slug,state_id', ignoreDuplicates: true })
      .select('id, slug, state_id')
    
    if (cityErr) {
      // If upsert fails due to no unique constraint, try insert
      console.error('City upsert error (trying insert):', cityErr.message)
      for (const c of batch) {
        const { data, error } = await supabase.from('cities').insert(c).select('id, slug, state_id')
        if (data?.[0]) cityLookup.set(`${data[0].slug}|${data[0].state_id}`, data[0].id)
      }
    } else {
      for (const c of insertedCities || []) {
        cityLookup.set(`${c.slug}|${c.state_id}`, c.id)
      }
    }
  }
  console.log(`Inserted cities, lookup has ${cityLookup.size} entries`)
  
  // If lookup is incomplete, fetch all cities
  if (cityLookup.size < uniqueCityRows.length) {
    const { data: allCities } = await supabase.from('cities').select('id, slug, state_id')
    for (const c of allCities || []) {
      cityLookup.set(`${c.slug}|${c.state_id}`, c.id)
    }
    console.log(`Refreshed city lookup: ${cityLookup.size} entries`)
  }
  
  // Insert businesses
  console.log(`Inserting ${businesses.length} businesses...`)
  let inserted = 0
  let errors = 0
  
  for (let i = 0; i < businesses.length; i += 50) {
    const batch = businesses.slice(i, i + 50).map(b => {
      const stateId = stateLookup.get(b.stateAbbrev)
      const citySlug = b.city ? slugify(b.city) : ''
      const cityId = citySlug ? cityLookup.get(`${citySlug}|${stateId}`) : undefined
      
      return {
        name: b.name,
        slug: slugify(b.name),
        phone: b.phone || null,
        address: b.address || null,
        city_id: cityId || null,
        state_id: stateId || null,
        zip: b.zip || null,
        website_url: b.website || null,
        rating: b.rating,
        review_count: b.reviewCount,
        description: b.description || null,
        latitude: b.latitude,
        longitude: b.longitude,
        year_established: b.yearEstablished,
        is_active: true,
        data_source: 'outscraper',
        data_quality_score: (b.phone ? 20 : 0) + (b.website ? 20 : 0) + (b.rating ? 20 : 0) + (b.description ? 20 : 0) + (b.address ? 20 : 0),
      }
    })
    
    const { data, error } = await supabase.from('businesses').upsert(batch, { onConflict: 'slug,state_id', ignoreDuplicates: true }).select('id')
    if (error) {
      console.error(`Batch ${i} error:`, error.message)
      // Try one by one
      for (const b of batch) {
        const { error: e2 } = await supabase.from('businesses').insert(b)
        if (e2) { errors++; if (errors <= 5) console.error(`  ${b.name}: ${e2.message}`) }
        else inserted++
      }
    } else {
      inserted += data?.length || 0
    }
  }
  
  console.log(`\nDone! Inserted ${inserted} businesses (${errors} errors)`)
  
  // Verify
  const { count } = await supabase.from('businesses').select('id', { count: 'exact', head: true })
  console.log(`Total businesses in DB: ${count}`)
  const { count: stateCount } = await supabase.from('states').select('id', { count: 'exact', head: true })
  console.log(`Total states in DB: ${stateCount}`)
  const { count: cityCount } = await supabase.from('cities').select('id', { count: 'exact', head: true })
  console.log(`Total cities in DB: ${cityCount}`)
}

main().catch(console.error)
