/**
 * Check current business distribution by state in Foundation Scout database
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function checkDistribution() {
  // Get business count by state
  const { data: stateData, error } = await supabase
    .from('states')
    .select(`
      name,
      abbreviation,
      businesses:businesses(count)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  // Transform the data and sort by business count
  const distribution = stateData.map(state => ({
    name: state.name,
    abbreviation: state.abbreviation,
    count: state.businesses[0]?.count || 0
  })).sort((a, b) => a.count - b.count)

  console.log('Current business distribution by state:')
  console.log('=====================================')
  
  let total = 0
  distribution.forEach((state, index) => {
    console.log(`${(index + 1).toString().padStart(2)}: ${state.name.padEnd(20)} (${state.abbreviation}) - ${state.count} businesses`)
    total += state.count
  })
  
  console.log(`\nTotal businesses: ${total}`)
  console.log(`Average per state: ${(total / 50).toFixed(1)}`)
  
  // Identify the 30 states with fewest businesses
  const bottom30 = distribution.slice(0, 30)
  console.log('\nBottom 30 states (need more businesses):')
  console.log('========================================')
  bottom30.forEach((state, index) => {
    console.log(`${(index + 1).toString().padStart(2)}: ${state.name} (${state.abbreviation}) - ${state.count} businesses`)
  })
  
  return bottom30
}

checkDistribution().catch(console.error)