/**
 * Foundation Repair Directory - Database Seeder
 * Populates Supabase with realistic foundation repair companies across top 20 states
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Top 20 states for foundation repair with major cities
const statesCities = {
  'texas': {
    abbreviation: 'TX',
    cities: [
      { name: 'Houston', slug: 'houston', population: 2304580, latitude: 29.7604, longitude: -95.3698 },
      { name: 'Dallas', slug: 'dallas', population: 1304379, latitude: 32.7767, longitude: -96.7970 },
      { name: 'San Antonio', slug: 'san-antonio', population: 1547253, latitude: 29.4241, longitude: -98.4936 },
      { name: 'Austin', slug: 'austin', population: 978908, latitude: 30.2672, longitude: -97.7431 },
      { name: 'Fort Worth', slug: 'fort-worth', population: 909585, latitude: 32.7555, longitude: -97.3308 },
      { name: 'Plano', slug: 'plano', population: 288061, latitude: 33.0198, longitude: -96.6989 },
      { name: 'Garland', slug: 'garland', population: 246018, latitude: 32.9126, longitude: -96.6389 },
      { name: 'Irving', slug: 'irving', population: 256684, latitude: 32.8140, longitude: -96.9489 }
    ]
  },
  'california': {
    abbreviation: 'CA',
    cities: [
      { name: 'Los Angeles', slug: 'los-angeles', population: 3898747, latitude: 34.0522, longitude: -118.2437 },
      { name: 'San Diego', slug: 'san-diego', population: 1386932, latitude: 32.7157, longitude: -117.1611 },
      { name: 'San Jose', slug: 'san-jose', population: 1013240, latitude: 37.3382, longitude: -121.8863 },
      { name: 'San Francisco', slug: 'san-francisco', population: 873965, latitude: 37.7749, longitude: -122.4194 },
      { name: 'Sacramento', slug: 'sacramento', population: 524943, latitude: 38.5816, longitude: -121.4944 },
      { name: 'Oakland', slug: 'oakland', population: 433031, latitude: 37.8044, longitude: -122.2712 },
      { name: 'Fresno', slug: 'fresno', population: 542107, latitude: 36.7378, longitude: -119.7871 }
    ]
  },
  'florida': {
    abbreviation: 'FL',
    cities: [
      { name: 'Miami', slug: 'miami', population: 467963, latitude: 25.7617, longitude: -80.1918 },
      { name: 'Tampa', slug: 'tampa', population: 399700, latitude: 27.9506, longitude: -82.4572 },
      { name: 'Orlando', slug: 'orlando', population: 307573, latitude: 28.5383, longitude: -81.3792 },
      { name: 'Jacksonville', slug: 'jacksonville', population: 949611, latitude: 30.3322, longitude: -81.6557 },
      { name: 'Fort Lauderdale', slug: 'fort-lauderdale', population: 182760, latitude: 26.1224, longitude: -80.1373 },
      { name: 'St. Petersburg', slug: 'st-petersburg', population: 258308, latitude: 27.7676, longitude: -82.6404 }
    ]
  },
  'georgia': {
    abbreviation: 'GA',
    cities: [
      { name: 'Atlanta', slug: 'atlanta', population: 498715, latitude: 33.7490, longitude: -84.3880 },
      { name: 'Augusta', slug: 'augusta', population: 202081, latitude: 33.4735, longitude: -82.0105 },
      { name: 'Columbus', slug: 'columbus', population: 206922, latitude: 32.4609, longitude: -84.9877 },
      { name: 'Savannah', slug: 'savannah', population: 147780, latitude: 32.0835, longitude: -81.0998 },
      { name: 'Athens', slug: 'athens', population: 127315, latitude: 33.9519, longitude: -83.3576 }
    ]
  },
  'north-carolina': {
    abbreviation: 'NC',
    cities: [
      { name: 'Charlotte', slug: 'charlotte', population: 885708, latitude: 35.2271, longitude: -80.8431 },
      { name: 'Raleigh', slug: 'raleigh', population: 474069, latitude: 35.7796, longitude: -78.6382 },
      { name: 'Greensboro', slug: 'greensboro', population: 299035, latitude: 36.0726, longitude: -79.7920 },
      { name: 'Durham', slug: 'durham', population: 283506, latitude: 35.9940, longitude: -78.8986 },
      { name: 'Winston-Salem', slug: 'winston-salem', population: 249545, latitude: 36.0999, longitude: -80.2442 }
    ]
  },
  'ohio': {
    abbreviation: 'OH',
    cities: [
      { name: 'Columbus', slug: 'columbus', population: 905748, latitude: 39.9612, longitude: -82.9988 },
      { name: 'Cleveland', slug: 'cleveland', population: 372624, latitude: 41.4993, longitude: -81.6944 },
      { name: 'Cincinnati', slug: 'cincinnati', population: 309317, latitude: 39.1031, longitude: -84.5120 },
      { name: 'Toledo', slug: 'toledo', population: 270871, latitude: 41.6528, longitude: -83.5379 },
      { name: 'Akron', slug: 'akron', population: 197597, latitude: 41.0814, longitude: -81.5190 }
    ]
  },
  'michigan': {
    abbreviation: 'MI',
    cities: [
      { name: 'Detroit', slug: 'detroit', population: 639111, latitude: 42.3314, longitude: -83.0458 },
      { name: 'Grand Rapids', slug: 'grand-rapids', population: 198917, latitude: 42.9634, longitude: -85.6681 },
      { name: 'Warren', slug: 'warren', population: 139387, latitude: 42.5144, longitude: -83.0146 },
      { name: 'Sterling Heights', slug: 'sterling-heights', population: 134346, latitude: 42.5803, longitude: -83.0302 },
      { name: 'Ann Arbor', slug: 'ann-arbor', population: 123851, latitude: 42.2808, longitude: -83.7430 }
    ]
  },
  'pennsylvania': {
    abbreviation: 'PA',
    cities: [
      { name: 'Philadelphia', slug: 'philadelphia', population: 1603797, latitude: 39.9526, longitude: -75.1652 },
      { name: 'Pittsburgh', slug: 'pittsburgh', population: 302971, latitude: 40.4406, longitude: -79.9959 },
      { name: 'Allentown', slug: 'allentown', population: 125845, latitude: 40.6023, longitude: -75.4714 },
      { name: 'Erie', slug: 'erie', population: 95508, latitude: 42.1292, longitude: -80.0851 },
      { name: 'Reading', slug: 'reading', population: 95112, latitude: 40.3357, longitude: -75.9268 }
    ]
  },
  'illinois': {
    abbreviation: 'IL',
    cities: [
      { name: 'Chicago', slug: 'chicago', population: 2665039, latitude: 41.8781, longitude: -87.6298 },
      { name: 'Aurora', slug: 'aurora', population: 180542, latitude: 41.7606, longitude: -88.3201 },
      { name: 'Naperville', slug: 'naperville', population: 149540, latitude: 41.7508, longitude: -88.1535 },
      { name: 'Joliet', slug: 'joliet', population: 150362, latitude: 41.5250, longitude: -88.0817 },
      { name: 'Rockford', slug: 'rockford', population: 148655, latitude: 42.2711, longitude: -89.0940 }
    ]
  },
  'virginia': {
    abbreviation: 'VA',
    cities: [
      { name: 'Virginia Beach', slug: 'virginia-beach', population: 459470, latitude: 36.8529, longitude: -75.9780 },
      { name: 'Norfolk', slug: 'norfolk', population: 238005, latitude: 36.9048, longitude: -76.2599 },
      { name: 'Chesapeake', slug: 'chesapeake', population: 249422, latitude: 36.7682, longitude: -76.2875 },
      { name: 'Richmond', slug: 'richmond', population: 230436, latitude: 37.5407, longitude: -77.4360 },
      { name: 'Newport News', slug: 'newport-news', population: 186247, latitude: 37.0871, longitude: -76.4730 }
    ]
  },
  'tennessee': {
    abbreviation: 'TN',
    cities: [
      { name: 'Nashville', slug: 'nashville', population: 689447, latitude: 36.1627, longitude: -86.7816 },
      { name: 'Memphis', slug: 'memphis', population: 633104, latitude: 35.1495, longitude: -90.0490 },
      { name: 'Knoxville', slug: 'knoxville', population: 190740, latitude: 35.9606, longitude: -83.9207 },
      { name: 'Chattanooga', slug: 'chattanooga', population: 181099, latitude: 35.0456, longitude: -85.2672 },
      { name: 'Clarksville', slug: 'clarksville', population: 166722, latitude: 36.5298, longitude: -87.3595 }
    ]
  },
  'missouri': {
    abbreviation: 'MO',
    cities: [
      { name: 'Kansas City', slug: 'kansas-city', population: 508090, latitude: 39.0997, longitude: -94.5786 },
      { name: 'St. Louis', slug: 'st-louis', population: 301578, latitude: 38.6270, longitude: -90.1994 },
      { name: 'Springfield', slug: 'springfield', population: 169176, latitude: 37.2153, longitude: -93.2982 },
      { name: 'Columbia', slug: 'columbia', population: 126254, latitude: 38.9517, longitude: -92.3341 }
    ]
  },
  'alabama': {
    abbreviation: 'AL',
    cities: [
      { name: 'Birmingham', slug: 'birmingham', population: 200733, latitude: 33.5186, longitude: -86.8104 },
      { name: 'Montgomery', slug: 'montgomery', population: 200603, latitude: 32.3668, longitude: -86.3000 },
      { name: 'Mobile', slug: 'mobile', population: 187041, latitude: 30.6944, longitude: -88.0431 },
      { name: 'Huntsville', slug: 'huntsville', population: 215006, latitude: 34.7304, longitude: -86.5861 }
    ]
  },
  'louisiana': {
    abbreviation: 'LA',
    cities: [
      { name: 'New Orleans', slug: 'new-orleans', population: 383997, latitude: 29.9511, longitude: -90.0715 },
      { name: 'Baton Rouge', slug: 'baton-rouge', population: 220236, latitude: 30.4515, longitude: -91.1871 },
      { name: 'Shreveport', slug: 'shreveport', population: 187593, latitude: 32.5252, longitude: -93.7502 },
      { name: 'Lafayette', slug: 'lafayette', population: 126674, latitude: 30.2241, longitude: -92.0198 }
    ]
  },
  'mississippi': {
    abbreviation: 'MS',
    cities: [
      { name: 'Jackson', slug: 'jackson', population: 153701, latitude: 32.2988, longitude: -90.1848 },
      { name: 'Gulfport', slug: 'gulfport', population: 72926, latitude: 30.3674, longitude: -89.0928 },
      { name: 'Southaven', slug: 'southaven', population: 55026, latitude: 34.9889, longitude: -90.0126 },
      { name: 'Hattiesburg', slug: 'hattiesburg', population: 48730, latitude: 31.3271, longitude: -89.2903 }
    ]
  },
  'south-carolina': {
    abbreviation: 'SC',
    cities: [
      { name: 'Charleston', slug: 'charleston', population: 150227, latitude: 32.7765, longitude: -79.9311 },
      { name: 'Columbia', slug: 'columbia', population: 137300, latitude: 34.0007, longitude: -81.0348 },
      { name: 'North Charleston', slug: 'north-charleston', population: 114852, latitude: 32.8546, longitude: -79.9748 },
      { name: 'Mount Pleasant', slug: 'mount-pleasant', population: 88796, latitude: 32.7940, longitude: -79.8628 }
    ]
  },
  'oklahoma': {
    abbreviation: 'OK',
    cities: [
      { name: 'Oklahoma City', slug: 'oklahoma-city', population: 695020, latitude: 35.4676, longitude: -97.5164 },
      { name: 'Tulsa', slug: 'tulsa', population: 413066, latitude: 36.1540, longitude: -95.9928 },
      { name: 'Norman', slug: 'norman', population: 128026, latitude: 35.2226, longitude: -97.4395 },
      { name: 'Broken Arrow', slug: 'broken-arrow', population: 113540, latitude: 36.0526, longitude: -95.7969 }
    ]
  },
  'arkansas': {
    abbreviation: 'AR',
    cities: [
      { name: 'Little Rock', slug: 'little-rock', population: 198606, latitude: 34.7465, longitude: -92.2896 },
      { name: 'Fayetteville', slug: 'fayetteville', population: 93949, latitude: 36.0625, longitude: -94.1574 },
      { name: 'Fort Smith', slug: 'fort-smith', population: 89142, latitude: 35.3859, longitude: -94.3985 },
      { name: 'Springdale', slug: 'springdale', population: 84161, latitude: 36.1867, longitude: -94.1288 }
    ]
  },
  'indiana': {
    abbreviation: 'IN',
    cities: [
      { name: 'Indianapolis', slug: 'indianapolis', population: 887642, latitude: 39.7684, longitude: -86.1581 },
      { name: 'Fort Wayne', slug: 'fort-wayne', population: 270402, latitude: 41.0793, longitude: -85.1394 },
      { name: 'Evansville', slug: 'evansville', population: 118414, latitude: 37.9716, longitude: -87.5710 },
      { name: 'South Bend', slug: 'south-bend', population: 103395, latitude: 41.6764, longitude: -86.2520 }
    ]
  },
  'kentucky': {
    abbreviation: 'KY',
    cities: [
      { name: 'Louisville', slug: 'louisville', population: 633045, latitude: 38.2527, longitude: -85.7585 },
      { name: 'Lexington', slug: 'lexington', population: 323780, latitude: 38.0406, longitude: -84.5037 },
      { name: 'Bowling Green', slug: 'bowling-green', population: 72294, latitude: 36.9685, longitude: -86.4808 },
      { name: 'Owensboro', slug: 'owensboro', population: 60183, latitude: 37.7719, longitude: -87.1111 }
    ]
  }
}

// Foundation repair company names and types
const companyTypes = [
  { type: 'Foundation Pros', variations: ['Foundation Pros', 'Foundation Specialists', 'Foundation Experts'] },
  { type: 'Basement Systems', variations: ['Basement Systems', 'Basement Solutions', 'Basement Repair Co'] },
  { type: 'Ram Jack', variations: ['Ram Jack', 'Foundation Masters', 'Foundation Authority'] },
  { type: 'Local Names', variations: ['{city} Foundation Repair', '{city} Basement Solutions', '{state} Foundation Pros', 'Elite Foundation Services', 'Superior Foundation Solutions', 'Premier Foundation Repair'] }
]

const services = [
  'Foundation Repair', 'Pier & Beam Repair', 'Slab Foundation Repair', 
  'Wall Anchor Installation', 'Foundation Crack Repair', 'Basement Waterproofing',
  'Crawl Space Repair', 'House Leveling', 'Underpinning', 'Drainage Solutions'
]

// Generate realistic business data
function generateBusinessName(cityName: string, stateName: string): string {
  const templates = [
    `${cityName} Foundation Repair`,
    `${cityName} Foundation Solutions`,
    `${cityName} Basement Systems`,
    `${stateName} Foundation Pros`,
    `Elite Foundation Services`,
    `Superior Foundation Solutions`,
    `Premier Foundation Repair`,
    `Foundation Masters ${cityName}`,
    `${cityName} Foundation Authority`,
    `Advanced Foundation Solutions`,
    `Reliable Foundation Repair`,
    `Professional Foundation Services`
  ]
  
  return templates[Math.floor(Math.random() * templates.length)]
}

function generatePhone(stateAbbr: string): string {
  const areaCodes: { [key: string]: string[] } = {
    'TX': ['713', '214', '512', '210', '817', '972', '281', '832'],
    'CA': ['213', '323', '424', '310', '626', '818', '909', '951'],
    'FL': ['305', '786', '954', '754', '561', '407', '321', '813'],
    'GA': ['404', '770', '678', '470', '912', '229', '706', '762'],
    'NC': ['704', '980', '919', '984', '336', '828', '252', '910'],
    'OH': ['216', '440', '330', '234', '614', '380', '513', '937'],
    'MI': ['313', '248', '734', '586', '947', '616', '269', '231'],
    'PA': ['215', '267', '445', '484', '610', '412', '724', '878'],
    'IL': ['312', '773', '872', '224', '847', '708', '630', '331'],
    'VA': ['757', '804', '540', '276', '434', '571', '703'],
    'TN': ['615', '629', '901', '731', '865', '423'],
    'MO': ['816', '975', '314', '636', '573', '660', '417'],
    'AL': ['205', '659', '256', '938', '334', '251'],
    'LA': ['504', '985', '225', '318', '337'],
    'MS': ['601', '769', '228', '662'],
    'SC': ['803', '843', '854', '864'],
    'OK': ['405', '572', '918', '539'],
    'AR': ['501', '870', '479', '327'],
    'IN': ['317', '463', '260', '574', '765', '930', '812'],
    'KY': ['502', '270', '364', '606', '859']
  }
  
  const stateAreaCodes = areaCodes[stateAbbr] || ['555']
  const areaCode = stateAreaCodes[Math.floor(Math.random() * stateAreaCodes.length)]
  const exchange = Math.floor(Math.random() * 900) + 100
  const number = Math.floor(Math.random() * 9000) + 1000
  
  return `(${areaCode}) ${exchange}-${number}`
}

function generateBusinesses(cityName: string, citySlug: string, stateName: string, stateAbbr: string, count: number) {
  const businesses = []
  
  for (let i = 0; i < count; i++) {
    const name = generateBusinessName(cityName, stateName)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const rating = Math.random() > 0.3 ? (3.5 + Math.random() * 1.5).toFixed(1) : null
    const reviewCount = rating ? Math.floor(Math.random() * 200) + 10 : 0
    const yearsInBusiness = Math.floor(Math.random() * 25) + 5
    
    businesses.push({
      name,
      slug: `${slug}-${i}`, // Ensure uniqueness
      phone: generatePhone(stateAbbr),
      address: `${Math.floor(Math.random() * 9999) + 100} ${['Main St', 'Oak Ave', 'First St', 'Park Blvd', 'Center Dr'][Math.floor(Math.random() * 5)]}`,
      description: `Professional foundation repair services in ${cityName}, ${stateAbbr}. ${yearsInBusiness}+ years of experience providing quality foundation solutions.`,
      year_established: new Date().getFullYear() - yearsInBusiness,
      license_number: `${stateAbbr}${Math.floor(Math.random() * 100000) + 10000}`,
      rating: rating ? parseFloat(rating) : null,
      review_count: reviewCount,
      is_verified: Math.random() > 0.7,
      is_featured: Math.random() > 0.8,
      data_quality_score: Math.floor(Math.random() * 30) + 70,
      data_source: 'seeded'
    })
  }
  
  return businesses
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // First, populate states and cities
    console.log('📍 Seeding states and cities...')
    
    for (const [stateSlug, stateData] of Object.entries(statesCities)) {
      // Insert state
      const { data: state, error: stateError } = await supabase
        .from('states')
        .insert({
          name: stateSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          abbreviation: stateData.abbreviation,
          slug: stateSlug
        })
        .select()
        .single()
      
      if (stateError && !stateError.message.includes('duplicate key')) {
        console.error(`Error inserting state ${stateSlug}:`, stateError)
        continue
      }
      
      // Get state ID
      const { data: stateData2 } = await supabase
        .from('states')
        .select('id')
        .eq('slug', stateSlug)
        .single()
      
      const stateId = stateData2?.id
      
      if (!stateId) {
        console.error(`Could not get state ID for ${stateSlug}`)
        continue
      }
      
      // Insert cities for this state
      for (const city of stateData.cities) {
        const { error: cityError } = await supabase
          .from('cities')
          .insert({
            ...city,
            state_id: stateId
          })
        
        if (cityError && !cityError.message.includes('duplicate key')) {
          console.error(`Error inserting city ${city.name}:`, cityError)
        }
      }
    }
    
    console.log('🏢 Seeding businesses...')
    
    // Now populate businesses
    for (const [stateSlug, stateData] of Object.entries(statesCities)) {
      console.log(`Processing ${stateSlug}...`)
      
      // Get state ID
      const { data: state } = await supabase
        .from('states')
        .select('id')
        .eq('slug', stateSlug)
        .single()
      
      const stateId = state?.id
      
      if (!stateId) continue
      
      for (const city of stateData.cities) {
        // Get city ID
        const { data: cityData } = await supabase
          .from('cities')
          .select('id')
          .eq('slug', city.slug)
          .eq('state_id', stateId)
          .single()
        
        const cityId = cityData?.id
        
        if (!cityId) continue
        
        // Generate businesses for this city
        const businessCount = city.population > 500000 ? 8 : city.population > 200000 ? 6 : 4
        const businesses = generateBusinesses(
          city.name, 
          city.slug, 
          stateSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          stateData.abbreviation,
          businessCount
        )
        
        // Insert businesses
        for (const business of businesses) {
          const { data: insertedBusiness, error } = await supabase
            .from('businesses')
            .insert({
              ...business,
              city_id: cityId,
              state_id: stateId,
              latitude: city.latitude + (Math.random() - 0.5) * 0.1,
              longitude: city.longitude + (Math.random() - 0.5) * 0.1,
            })
            .select()
            .single()
          
          if (error) {
            console.error(`Error inserting business ${business.name}:`, error)
            continue
          }
          
          // Assign random services to each business
          const serviceCount = Math.floor(Math.random() * 4) + 2 // 2-5 services per business
          const selectedServices = services.slice().sort(() => 0.5 - Math.random()).slice(0, serviceCount)
          
          for (const serviceName of selectedServices) {
            // Get service ID
            const { data: service } = await supabase
              .from('services')
              .select('id')
              .eq('name', serviceName)
              .single()
            
            if (service?.id && insertedBusiness?.id) {
              await supabase
                .from('business_services')
                .insert({
                  business_id: insertedBusiness.id,
                  service_id: service.id
                })
            }
          }
          
          // Add some features
          const commonFeatures = ['Free Inspection', 'Licensed & Insured', 'Free Estimates']
          const randomFeatures = ['Lifetime Warranty', 'Financing Available', 'Emergency Service', 'BBB Accredited']
          
          // Always add common features
          for (const featureName of commonFeatures) {
            const { data: feature } = await supabase
              .from('features')
              .select('id')
              .eq('name', featureName)
              .single()
            
            if (feature?.id && insertedBusiness?.id) {
              await supabase
                .from('business_features')
                .insert({
                  business_id: insertedBusiness.id,
                  feature_id: feature.id,
                  value: 'yes'
                })
            }
          }
          
          // Add 1-2 random features
          const selectedRandomFeatures = randomFeatures.slice().sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1)
          for (const featureName of selectedRandomFeatures) {
            const { data: feature } = await supabase
              .from('features')
              .select('id')
              .eq('name', featureName)
              .single()
            
            if (feature?.id && insertedBusiness?.id) {
              const value = featureName === 'Lifetime Warranty' ? 'lifetime' : 
                           featureName === 'Financing Available' ? 'available' : 'yes'
              
              await supabase
                .from('business_features')
                .insert({
                  business_id: insertedBusiness.id,
                  feature_id: feature.id,
                  value
                })
            }
          }
        }
        
        console.log(`  ✅ Added ${businessCount} businesses to ${city.name}, ${stateData.abbreviation}`)
      }
    }
    
    // Get final count
    const { count } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
    
    console.log(`🎉 Database seeding complete! Added ${count} businesses across 20 states.`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✨ All done!')
    process.exit(0)
  })
}