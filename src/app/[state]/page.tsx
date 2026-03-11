import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateBreadcrumbSchema, jsonLdScript } from '@/lib/structured-data'
import { notFound } from 'next/navigation'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import ExpertBio from '@/components/ExpertBio'
import AnimatedFAQ from '@/components/AnimatedFAQ'

// Force dynamic rendering to avoid cookies issue during static generation
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ state: string }>
}

interface StateData {
  id: number
  name: string
  abbreviation: string
  slug: string
}

interface CityData {
  id: number
  name: string
  slug: string
  business_count: number
}

// Fallback state data for when database is not available
const FALLBACK_STATES: Record<string, StateData> = {
  'texas': { id: 1, name: 'Texas', abbreviation: 'TX', slug: 'texas' },
  'california': { id: 2, name: 'California', abbreviation: 'CA', slug: 'california' },
  'florida': { id: 3, name: 'Florida', abbreviation: 'FL', slug: 'florida' },
  'georgia': { id: 4, name: 'Georgia', abbreviation: 'GA', slug: 'georgia' },
  'north-carolina': { id: 5, name: 'North Carolina', abbreviation: 'NC', slug: 'north-carolina' },
  'ohio': { id: 6, name: 'Ohio', abbreviation: 'OH', slug: 'ohio' },
  'michigan': { id: 7, name: 'Michigan', abbreviation: 'MI', slug: 'michigan' },
  'pennsylvania': { id: 8, name: 'Pennsylvania', abbreviation: 'PA', slug: 'pennsylvania' },
  'illinois': { id: 9, name: 'Illinois', abbreviation: 'IL', slug: 'illinois' },
  'virginia': { id: 10, name: 'Virginia', abbreviation: 'VA', slug: 'virginia' },
  'tennessee': { id: 11, name: 'Tennessee', abbreviation: 'TN', slug: 'tennessee' },
  'missouri': { id: 12, name: 'Missouri', abbreviation: 'MO', slug: 'missouri' },
}

const FALLBACK_CITIES: Record<string, CityData[]> = {
  'texas': [
    { id: 1, name: 'Houston', slug: 'houston', business_count: 25 },
    { id: 2, name: 'Dallas', slug: 'dallas', business_count: 18 },
    { id: 3, name: 'Austin', slug: 'austin', business_count: 12 },
    { id: 4, name: 'San Antonio', slug: 'san-antonio', business_count: 15 },
    { id: 5, name: 'Fort Worth', slug: 'fort-worth', business_count: 9 },
    { id: 6, name: 'El Paso', slug: 'el-paso', business_count: 7 },
  ],
  'california': [
    { id: 5, name: 'Los Angeles', slug: 'los-angeles', business_count: 32 },
    { id: 6, name: 'San Francisco', slug: 'san-francisco', business_count: 14 },
    { id: 7, name: 'San Diego', slug: 'san-diego', business_count: 11 },
    { id: 8, name: 'Sacramento', slug: 'sacramento', business_count: 8 },
  ],
  'florida': [
    { id: 8, name: 'Miami', slug: 'miami', business_count: 19 },
    { id: 9, name: 'Orlando', slug: 'orlando', business_count: 13 },
    { id: 10, name: 'Tampa', slug: 'tampa', business_count: 16 },
    { id: 11, name: 'Jacksonville', slug: 'jacksonville', business_count: 12 },
  ],
  // Add more states as needed
}

async function getStateData(stateSlug: string): Promise<{state: StateData, cities: CityData[]} | null> {
  try {
    const supabase = supabaseAdmin
    
    const { data: state, error: stateError } = await supabase
      .from('states')
      .select('*')
      .eq('slug', stateSlug)
      .single()

    if (stateError || !state) {
      // Fallback to hardcoded state data
      const fallbackState = FALLBACK_STATES[stateSlug]
      if (!fallbackState) return null
      
      const fallbackCities = FALLBACK_CITIES[stateSlug] || []
      return { state: fallbackState, cities: fallbackCities }
    }

    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        slug,
        businesses!inner(count)
      `)
      .eq('state_id', state.id)
      .not('businesses', 'is', null)

    const citiesWithCount = cities?.map((city: any) => ({
      ...city,
      business_count: city.businesses?.[0]?.count || city.businesses?.length || 0
    })).filter((city: CityData) => city.business_count > 0) || []

    return { state, cities: citiesWithCount }
  } catch (error) {
    console.error('Database error, using fallback data:', error)
    // Fallback to hardcoded state data
    const fallbackState = FALLBACK_STATES[stateSlug]
    if (!fallbackState) return null
    
    const fallbackCities = FALLBACK_CITIES[stateSlug] || []
    return { state: fallbackState, cities: fallbackCities }
  }
}

// State-specific content
const stateContent: Record<string, {
  soilTypes: string,
  commonIssues: string,
  avgCosts: string,
  seasonalFactors: string,
  regulations: string,
  topCities: string
}> = {
  'texas': {
    soilTypes: 'Expansive clay soils dominate Texas, particularly the notorious Blackland Prairie clay in Dallas-Fort Worth and the plastic clay of the Gulf Coast Plain near Houston. These montmorillonite-rich clays can expand up to 30% when wet, creating extreme foundation stress throughout the state.',
    commonIssues: 'Foundation failures occur primarily from clay heave and shrinkage cycles, with the highest damage rates in Dallas, Houston, and San Antonio. Pier and beam foundations suffer from shifting clay support, while concrete slabs crack from uneven soil movement during Texas drought-wet cycles.',
    avgCosts: 'Foundation repairs range from $4,500 to $18,000 statewide, with Dallas-Fort Worth averaging $12,000 due to severe clay conditions. Houston repairs cost $8,000-$15,000, while rural East Texas sees lower costs of $3,500-$8,000 due to more stable sandy loam soils.',
    seasonalFactors: 'Summer drought creates maximum clay shrinkage from June through September, while spring rains (March-May) cause rapid clay expansion. Foundation movement peaks during drought-to-wet transitions, making fall and early winter optimal for repairs when soil moisture stabilizes.',
    regulations: 'Texas requires contractor registration through TRCC (Texas Residential Construction Commission) and specific foundation repair licensing. Permits are required for major structural work in most municipalities, and the Texas Deceptive Trade Practices Act provides strong consumer protections against foundation repair fraud.',
    topCities: 'Dallas and Houston dominate foundation repair demand due to extensive clay soils and large populations, while Austin, San Antonio, and Fort Worth also see high volumes. Plano, Frisco, and other North Texas suburbs experience particularly severe clay-related foundation issues.'
  },
  'california': {
    soilTypes: 'California features diverse soil conditions from adobe clay in the Central Valley to sandy coastal soils and volcanic ash deposits. The Bay Area contains problematic Bay Mud, while Southern California has expansive clay mixed with decomposed granite that creates unique foundation challenges.',
    commonIssues: 'Seismic activity causes foundation cracking and settling throughout the state, while hillside homes face soil creep and landslide risks. Los Angeles and the Bay Area see liquefaction damage in sandy soils, and drought-induced clay shrinkage affects Central Valley and Inland Empire foundations.',
    avgCosts: 'Foundation repairs range from $5,000 to $25,000, with San Francisco Bay Area averaging $15,000-$22,000 due to seismic requirements. Los Angeles repairs cost $8,000-$18,000, while Central Valley and rural areas see $4,500-$12,000 depending on soil type and accessibility.',
    seasonalFactors: 'Winter rains (November-March) saturate soils and trigger landslides, while summer drought causes clay shrinkage. Seismic activity is unpredictable but foundation repairs are best scheduled during dry months when soil conditions are stable and construction access is easier.',
    regulations: 'California requires CSLB (Contractors State License Board) C-5 framing licenses for structural foundation work. Seismic retrofit and major repairs require engineered plans and city permits, with strict compliance to CBC (California Building Code) seismic standards and environmental regulations.',
    topCities: 'Los Angeles and the San Francisco Bay Area lead repair demand due to seismic activity and diverse soil conditions, while Sacramento, San Jose, and Fresno see significant volume. Hillside communities like Berkeley, Oakland hills, and Malibu have specialized foundation needs due to slope instability.'
  },
  'florida': {
    soilTypes: 'Florida is built primarily on sandy soils overlying limestone bedrock, creating unique foundation challenges. The state features sugar sand in central regions, organic muck in the Everglades, and coastal shell deposits that provide varying foundation support throughout different regions.',
    commonIssues: 'Sinkhole formation affects over 50,000 homes statewide, particularly in Hernando, Hillsborough, and Pasco counties. High water tables cause foundation undermining during heavy rains, while sandy soils allow concrete slab settlement and pool deck failures in coastal areas.',
    avgCosts: 'Foundation repairs range from $3,500 to $15,000 for typical settlement issues, but sinkhole remediation costs $15,000-$50,000. Miami-Dade and Broward County average $6,000-$12,000, while Central Florida sinkhole regions see highly variable costs depending on geological investigation requirements.',
    seasonalFactors: 'Hurricane season (June-November) brings foundation-damaging storm surge and flooding, while summer thunderstorms cause rapid water table fluctuations. Winter dry season (December-April) is optimal for foundation work when water tables recede and soil conditions stabilize.',
    regulations: 'Florida requires state certification for foundation contractors and mandatory sinkhole inspection disclosures during property sales. Building permits are required for structural foundation work, and insurance regulations require pre-approved contractors for sinkhole claims under Florida Statute 627.706.',
    topCities: 'Tampa Bay area leads in foundation repair volume due to sinkhole activity and sandy soils, while Miami-Dade and Orlando see high demand from settlement issues. Clearwater, St. Petersburg, and Lakeland experience frequent sinkhole-related foundation problems requiring specialized expertise.'
  },
  'alabama': {
    soilTypes: 'Alabama features red clay soils in the northern regions and sandy coastal plains in the south. The state contains problematic expansive clays derived from limestone weathering, particularly in Jefferson and Madison counties, mixed with sandy loam soils that provide more stable foundation conditions.',
    commonIssues: 'Clay soil expansion affects Birmingham and Huntsville area foundations, while southern Alabama faces sandy soil settlement issues. Mobile Bay area homes experience high water table problems, and mining subsidence in coal regions creates unique foundation settlement patterns.',
    avgCosts: 'Foundation repairs range from $3,200 to $11,000 statewide, with Birmingham averaging $7,500 due to clay soil conditions. Mobile and Montgomery see costs of $4,000-$8,500, while rural areas typically range $2,800-$6,500 due to lower labor costs and simpler access.',
    seasonalFactors: 'Spring rains (March-May) cause clay expansion and potential foundation heave, while summer heat creates soil shrinkage. Hurricane season affects coastal foundations with storm surge, making fall and winter optimal for repairs when soil moisture stabilizes.',
    regulations: 'Alabama requires contractor licensing through ACLB (Alabama Contractor Licensing Board) for structural work. Foundation repairs over $10,000 require permits in most municipalities, and the Alabama Homeowner Protection Act provides warranty requirements for new construction foundation work.',
    topCities: 'Birmingham dominates repair demand due to expansive clay soils and older housing stock, while Huntsville, Mobile, and Montgomery also generate significant volume. Tuscaloosa and Auburn see moderate demand influenced by local soil conditions and university-area housing density.'
  },
  'alaska': {
    soilTypes: 'Alaska presents unique permafrost and frost-susceptible soils that create extreme foundation challenges. Much of the state contains permafrost overlain by seasonal frost layers, while coastal areas feature glacial till and organic soils that behave differently under freeze-thaw cycles.',
    commonIssues: 'Permafrost thaw causes catastrophic foundation settlement as climate warming affects soil stability. Frost heave during freeze cycles pushes foundations upward, while spring thaw creates bearing capacity failures and foundation undermining in many regions of the state.',
    avgCosts: 'Foundation repairs range from $8,000 to $25,000 due to specialized cold-climate techniques and remote access challenges. Anchorage averages $12,000-$18,000, while rural areas see $15,000-$30,000 due to material transport costs and limited contractor availability.',
    seasonalFactors: 'Spring thaw (April-June) causes maximum foundation movement as frost layers melt, while winter freeze cycles create heave conditions. Summer construction season (June-August) provides the only window for major foundation work when soil conditions allow equipment access.',
    regulations: 'Alaska requires contractor licensing through Department of Commerce for structural work exceeding $1,000. Foundation work in permafrost areas requires engineered designs following state building codes, and remote areas may have limited permitting oversight but still require compliance with international building codes.',
    topCities: 'Anchorage generates most repair demand due to population concentration and challenging soil conditions, while Fairbanks sees significant permafrost-related foundation issues. Juneau, Wasilla, and Palmer also experience foundation problems related to freeze-thaw cycles and unstable soils.'
  },
  'arizona': {
    soilTypes: 'Arizona contains expansive caliche clay soils throughout the Phoenix Valley and Tucson Basin, mixed with desert hardpan and decomposed granite. These alkaline clay soils expand dramatically when irrigated, while rocky decomposed granite areas provide more stable foundation conditions.',
    commonIssues: 'Caliche clay expansion affects most Valley homes when landscape irrigation introduces moisture to previously dry soils. Desert settlement occurs as organic soil components decompose, while flash flood erosion undermines foundations in wash areas throughout the state.',
    avgCosts: 'Foundation repairs range from $4,000 to $14,000, with Phoenix averaging $8,500-$12,000 due to widespread caliche conditions. Tucson sees similar costs of $7,500-$11,500, while rural high desert areas range $5,000-$9,000 depending on soil type and access challenges.',
    seasonalFactors: 'Monsoon season (July-September) saturates dry clay soils causing maximum expansion, while winter provides stable conditions for repairs. Spring landscaping and irrigation installation often triggers foundation movement, making fall the optimal repair season when soil moisture stabilizes.',
    regulations: 'Arizona requires ROC (Registrar of Contractors) licensing for structural foundation work. Foundation repairs require permits for structural modifications, and the Arizona Revised Statutes provide consumer protections including lien rights and warranty requirements for foundation work.',
    topCities: 'Phoenix metropolitan area dominates repair volume due to extensive caliche clay soils and rapid development on problematic sites. Tucson, Mesa, Scottsdale, and Tempe also see high demand, while Flagstaff experiences different foundation issues related to mountain clay and freeze-thaw cycles.'
  },
  'arkansas': {
    soilTypes: 'Arkansas features diverse soils from Mississippi River Delta clay in the east to Ouachita Mountain decomposed shale and sandstone in the west. The state contains problematic gumbo clay that becomes plastic when wet, mixed with sandy loam soils in highland regions.',
    commonIssues: 'Delta region clay soils cause expansion and contraction cycles affecting eastern Arkansas foundations. Ozark Mountain areas experience rock movement and shale decomposition issues, while Mississippi River flooding creates foundation undermining and settlement problems in low-lying areas.',
    avgCosts: 'Foundation repairs range from $3,000 to $10,000 statewide, with Little Rock averaging $6,500 due to moderate clay conditions. Delta region repairs cost $4,500-$8,500, while mountain areas see $5,000-$9,500 due to rock work and access challenges.',
    seasonalFactors: 'Spring flooding (March-May) saturates clay soils and can undermine foundations, while summer drought causes clay shrinkage. Winter provides stable soil conditions, making fall through early spring optimal for foundation repairs when weather permits construction activity.',
    regulations: 'Arkansas requires contractor licensing through Arkansas Contractor Licensing Board for work over $2,000. Foundation repairs require building permits in most municipalities, and Arkansas law provides mechanic lien rights and requires written contracts for foundation work exceeding $500.',
    topCities: 'Little Rock leads repair demand due to population density and clay soil conditions, while Fort Smith, Fayetteville, and Springdale also generate significant volume. Hot Springs and Jonesboro see moderate activity related to local geological conditions and housing density.'
  },
  'colorado': {
    soilTypes: 'Colorado contains highly expansive bentonite clay soils along the Front Range, particularly problematic around Denver and Colorado Springs. The state also features decomposed granite in mountain areas and sandy soils in eastern plains that create varying foundation challenges.',
    commonIssues: 'Bentonite clay expansion affects most Front Range foundations when moisture levels change from irrigation or precipitation. High altitude freeze-thaw cycles damage foundations in mountain areas, while eastern plains experience minimal foundation issues due to stable sandy soils.',
    avgCosts: 'Foundation repairs range from $5,500 to $16,000, with Denver averaging $10,000-$14,000 due to severe bentonite clay conditions. Colorado Springs and Boulder see similar costs, while mountain communities face $8,000-$18,000 due to access challenges and freeze-thaw damage.',
    seasonalFactors: 'Spring snowmelt and summer thunderstorms saturate clay soils causing maximum expansion from April through August. Winter freeze-thaw cycles create additional foundation stress in mountain areas, making late summer and fall optimal for repairs when soil conditions stabilize.',
    regulations: 'Colorado requires contractor registration through Department of Regulatory Agencies for foundation work. Building permits are required for structural modifications, and Colorado Revised Statutes provide consumer protection including right to cancel contracts and lien law procedures.',
    topCities: 'Denver dominates repair demand due to extensive bentonite clay soils and large population, while Colorado Springs, Aurora, and Boulder also see high volumes. Lakewood, Thornton, and Westminster experience significant foundation movement due to clay soil conditions throughout the Front Range.'
  },
  'connecticut': {
    soilTypes: 'Connecticut features glacial till soils with varying clay content and seasonal frost susceptibility. The state contains dense hardpan layers that can impede drainage, mixed with rocky till that provides generally stable foundation conditions compared to expansive clay states.',
    commonIssues: 'Frost heave affects foundations during severe winters, while spring thaw can cause settlement as saturated soils lose bearing capacity. Older homes face fieldstone foundation deterioration, and wet basement conditions from high water tables create ongoing structural concerns.',
    avgCosts: 'Foundation repairs range from $4,500 to $13,500, with Hartford and New Haven averaging $8,500-$11,000. Coastal areas see higher costs due to access challenges and marine environments, while rural areas typically range $6,000-$9,500 due to simpler site conditions.',
    seasonalFactors: 'Winter freeze-thaw cycles create maximum foundation stress from December through March, while spring thaw causes soil instability. Summer provides optimal repair conditions with stable soil moisture and accessible sites, extending through early fall before winter preparation.',
    regulations: 'Connecticut requires Home Improvement Contractor licensing through DCP (Department of Consumer Protection) for foundation work. Building permits are required for structural modifications, and Connecticut General Statutes provide home improvement contract protections including cooling-off periods.',
    topCities: 'Hartford and New Haven lead repair demand due to older housing stock and glacial soil conditions, while Bridgeport, Stamford, and Waterbury also generate volume. New London and Norwich see moderate activity related to coastal soil conditions and foundation age.'
  },
  'delaware': {
    soilTypes: 'Delaware contains Atlantic Coastal Plain sandy soils in the south and Piedmont clay soils in the north. The state features marine clay deposits that can be problematic for foundations, mixed with well-draining sandy soils that provide stable support conditions.',
    commonIssues: 'Northern Delaware clay soils cause moderate expansion and settlement issues, while southern sandy soils experience foundation settlement and erosion. Coastal areas face salt intrusion and high water table problems that affect foundation stability and durability over time.',
    avgCosts: 'Foundation repairs range from $4,000 to $12,000, with Wilmington averaging $7,500-$10,500 due to clay soil conditions. Dover and southern areas see costs of $5,500-$9,000, while coastal regions may face higher costs due to environmental considerations and access challenges.',
    seasonalFactors: 'Winter freeze-thaw affects northern foundations while southern areas remain stable, and spring rains can saturate clay soils causing movement. Summer provides optimal repair conditions statewide, while hurricane season may affect coastal foundation work with storm surge concerns.',
    regulations: 'Delaware requires contractor licensing through Division of Professional Regulation for foundation work over $1,500. Building permits are required for structural work, and Delaware Code provides consumer protection including contractor bond requirements and lien procedures for unpaid work.',
    topCities: 'Wilmington dominates repair demand due to population density and clay soil conditions, while Dover, Newark, and Middletown also generate repair volume. Rehoboth Beach and coastal areas see specialized foundation needs related to marine environments and soil conditions.'
  },
  'georgia': {
    soilTypes: 'Georgia features red clay soils throughout much of the state derived from weathered granite and gneiss, creating moderate to high expansion potential. The coastal plain contains sandy soils with better drainage, while north Georgia mountains have decomposed granite mixed with clay.',
    commonIssues: 'Red clay expansion and shrinkage cycles affect foundations statewide, with highest damage in Atlanta metro area. Southeastern Georgia faces sandy soil settlement issues, while north Georgia experiences rock movement and steep slope foundation challenges in mountainous terrain.',
    avgCosts: 'Foundation repairs range from $3,500 to $12,500, with Atlanta averaging $7,500-$11,000 due to clay conditions and high demand. Coastal areas like Savannah see $5,000-$9,000, while rural north Georgia ranges $4,500-$8,500 depending on terrain and access.',
    seasonalFactors: 'Summer heat causes clay shrinkage creating foundation stress from June through September, while winter and spring rains cause clay expansion. Fall provides optimal repair conditions when soil moisture stabilizes before winter weather affects construction schedules.',
    regulations: 'Georgia requires contractor licensing through Secretary of State for residential work over $2,500. Foundation work requires building permits in most jurisdictions, and Georgia Code provides consumer protection including bond requirements and right to cancel home improvement contracts.',
    topCities: 'Atlanta dominates repair demand due to extensive red clay soils and population density, while Augusta, Columbus, and Savannah also generate significant volume. Macon, Athens, and Warner Robins experience moderate activity related to local soil conditions and housing growth.'
  },
  'hawaii': {
    soilTypes: 'Hawaii contains unique volcanic soils including expansive montmorillonite clays on older islands and porous volcanic ash on newer formations. The state features coral sand in coastal areas and organic soils in rainforest regions that create diverse foundation challenges.',
    commonIssues: 'Volcanic clay expansion affects older island foundations during rainy seasons, while newer volcanic soils experience settlement as ash compacts. Coastal erosion undermines foundations, and high rainfall areas face continuous moisture problems affecting foundation stability.',
    avgCosts: 'Foundation repairs range from $6,000 to $18,000 due to island logistics and specialized materials. Honolulu averages $9,000-$14,000, while outer island repairs cost $8,000-$20,000 due to material shipping and limited contractor availability creating premium pricing.',
    seasonalFactors: 'Rainy season (October-April) saturates volcanic clays causing maximum expansion, while dry season provides stable repair conditions. Hurricane season may disrupt construction schedules, making spring and early summer optimal for foundation work before intense rainfall begins.',
    regulations: 'Hawaii requires contractor licensing through DCCA (Department of Commerce and Consumer Affairs) for work over $1,000. Foundation work requires building permits with special attention to seismic and wind loads, and Hawaii Revised Statutes provide strong consumer protections.',
    topCities: 'Honolulu dominates repair demand due to population concentration and diverse soil conditions, while Hilo, Kailua-Kona, and Kahului also see activity. Pearl City and Kaneohe experience foundation issues related to volcanic soil conditions and marine environments.'
  },
  'idaho': {
    soilTypes: 'Idaho contains volcanic ash soils in southern regions and glacial lake deposits in northern areas. The state features problematic expansive clays derived from ancient lake beds, particularly around Boise, mixed with rocky mountain soils that provide more stable foundation conditions.',
    commonIssues: 'Lake bed clay expansion affects Treasure Valley foundations when irrigation introduces moisture to previously dry soils. Northern Idaho faces frost heave and foundation movement from freeze-thaw cycles, while volcanic ash areas experience settlement as soils compact over time.',
    avgCosts: 'Foundation repairs range from $4,500 to $13,000, with Boise averaging $7,500-$11,500 due to expansive clay conditions. Coeur d\'Alene and northern areas see $6,000-$12,000 including frost-related repairs, while rural areas range $5,000-$9,000 with limited contractor availability.',
    seasonalFactors: 'Spring snowmelt saturates clay soils causing expansion from March through May, while winter freeze-thaw creates additional foundation stress. Summer provides optimal repair conditions with stable soil moisture, extending through early fall before winter weather returns.',
    regulations: 'Idaho requires contractor registration through Division of Building Safety for work over $2,000. Foundation repairs require permits for structural work, and Idaho Code provides consumer protection including contractor bond requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Boise dominates repair demand due to expansive lake bed clays and population growth, while Meridian, Nampa, and Caldwell also see high volumes. Coeur d\'Alene and Moscow experience foundation issues related to northern Idaho\'s freeze-thaw cycles and different soil conditions.'
  },
  'illinois': {
    soilTypes: 'Illinois features deep prairie soils with high clay content throughout most of the state, creating moderate expansion potential. The glacial till contains layers of clay and sand that behave differently under moisture changes, while Chicago area lake plain soils present unique challenges.',
    commonIssues: 'Clay soil expansion affects foundations statewide during wet periods, with Chicago facing additional challenges from lake effect moisture. Basement foundations experience frequent water infiltration and settlement issues, while older homes face deteriorating foundation walls from freeze-thaw cycles.',
    avgCosts: 'Foundation repairs range from $4,000 to $14,000, with Chicago averaging $8,500-$13,000 due to complex soil conditions and high labor costs. Suburban areas see $6,500-$10,500, while downstate regions typically range $4,500-$8,500 with lower labor and material costs.',
    seasonalFactors: 'Spring thaw and summer rains saturate clay soils causing maximum expansion from March through August. Severe winter freeze-thaw cycles stress foundations, making late summer through fall optimal for repairs before winter weather halts construction activity.',
    regulations: 'Illinois requires contractor licensing through IDFPR (Department of Financial and Professional Regulation) for residential work. Foundation repairs require building permits in most municipalities, and Illinois law provides home improvement contract protections including cooling-off periods and bond requirements.',
    topCities: 'Chicago dominates repair demand due to population density and complex glacial soils, while Aurora, Rockford, and Peoria also generate significant volume. Springfield, Joliet, and Naperville experience foundation issues related to prairie clay soils and older housing stock.'
  },
  'indiana': {
    soilTypes: 'Indiana contains glacial till soils with moderate clay content and seasonal frost susceptibility throughout most of the state. Southern Indiana features limestone-derived clay soils with different expansion characteristics, while northwestern areas have lake plain clays from ancient Lake Michigan.',
    commonIssues: 'Moderate clay expansion affects foundations during wet periods, while freeze-thaw cycles cause foundation movement and basement wall failures. Southern Indiana experiences limestone-related drainage issues, and older homes face deteriorating block foundation walls from moisture infiltration.',
    avgCosts: 'Foundation repairs range from $3,500 to $11,500, with Indianapolis averaging $6,500-$9,500 due to moderate soil conditions. Fort Wayne and southern areas see similar costs, while rural regions typically range $4,000-$7,500 with lower labor costs and simpler access.',
    seasonalFactors: 'Spring rains and snowmelt saturate soils causing foundation movement from March through May, while winter freeze-thaw creates additional stress. Summer provides stable repair conditions, while fall work must be completed before ground freeze affects foundation access.',
    regulations: 'Indiana requires contractor registration through Professional Licensing Agency for work over $150. Foundation repairs require building permits for structural work, and Indiana Code provides consumer protection including contract requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Indianapolis leads repair demand due to population density and glacial till soils, while Fort Wayne, Evansville, and South Bend also generate volume. Gary, Carmel, and Fishers experience foundation issues related to regional soil conditions and housing age factors.'
  },
  'iowa': {
    soilTypes: 'Iowa features deep prairie soils with high organic content and moderate clay layers throughout the state. The glacial till contains expansive clays that affect foundations during moisture changes, while river valley areas have alluvial soils with different bearing characteristics.',
    commonIssues: 'Clay soil expansion during wet periods causes foundation movement, while deep frost penetration creates heave conditions during severe winters. Older homes experience basement foundation settlement, and rural areas face issues from agricultural drainage affecting soil moisture levels.',
    avgCosts: 'Foundation repairs range from $3,200 to $10,500, with Des Moines averaging $5,500-$8,500 due to moderate clay conditions. Cedar Rapids and Davenport see similar costs, while rural areas typically range $3,500-$6,500 with agricultural soil considerations and limited contractor availability.',
    seasonalFactors: 'Spring thaw and summer rains cause maximum clay expansion from March through July, while harsh winters create deep frost penetration affecting foundations. Fall provides optimal repair conditions before winter weather, though soil preparation may be needed for frost protection.',
    regulations: 'Iowa requires contractor registration through Labor Services Division for residential work over $200. Foundation repairs require building permits for structural modifications, and Iowa Code provides consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Des Moines dominates repair demand due to prairie clay soils and population density, while Cedar Rapids, Davenport, and Sioux City also generate repair volume. Iowa City and Waterloo experience foundation issues related to local soil conditions and housing age.'
  },
  'kansas': {
    soilTypes: 'Kansas contains highly expansive Permian and Cretaceous clay soils throughout much of the state, particularly problematic in central and western regions. These bentonite-rich clays can expand dramatically with moisture changes, while eastern areas have less expansive prairie soils.',
    commonIssues: 'Extreme clay expansion affects foundations statewide, with western Kansas experiencing the most severe conditions. Drought-wet cycles cause dramatic soil movement, while eastern areas face moderate expansion issues combined with basement foundation settlement from older construction methods.',
    avgCosts: 'Foundation repairs range from $4,000 to $15,000, with Wichita averaging $7,500-$12,000 due to expansive clay conditions. Kansas City area sees $6,500-$10,500, while western regions may face $8,000-$14,000 due to severe soil conditions and limited contractor availability.',
    seasonalFactors: 'Spring rains cause maximum clay expansion after winter drought from April through June, while summer heat creates shrinkage stress. Tornado season may disrupt construction schedules, making fall optimal for repairs when soil conditions stabilize and weather permits work.',
    regulations: 'Kansas does not require general contractor licensing for residential work, but foundation work over $5,000 requires building permits. Kansas Statutes provide consumer protection through home improvement contract requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Wichita leads repair demand due to expansive clay soils and population density, while Overland Park, Kansas City, and Topeka also generate significant volume. Lawrence and Olathe experience foundation movement related to clay soil conditions and rapid suburban development.'
  },
  'kentucky': {
    soilTypes: 'Kentucky features limestone-derived clay soils throughout much of the state with moderate expansion potential, mixed with sandstone and shale-derived soils in eastern mountains. Karst topography creates unique foundation challenges with limestone solution features and variable soil depth.',
    commonIssues: 'Limestone clay expansion causes moderate foundation movement during moisture changes, while eastern Kentucky faces rock movement and slope stability issues. Karst terrain creates sinkhole formation and foundation settlement, particularly in south-central regions where limestone is most prevalent.',
    avgCosts: 'Foundation repairs range from $3,500 to $11,000, with Louisville averaging $6,500-$9,500 due to clay conditions along the Ohio River. Lexington sees similar costs, while eastern mountain areas face $5,500-$10,500 due to terrain challenges and rock work requirements.',
    seasonalFactors: 'Spring rains saturate clay soils causing expansion from March through May, while winter freeze-thaw affects limestone areas. Summer provides stable repair conditions, while fall work allows completion before winter weather affects mountain access and limestone quarry operations.',
    regulations: 'Kentucky requires contractor licensing through Department of Housing for residential work over $1,000. Foundation repairs require building permits for structural work, and Kentucky Revised Statutes provide consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Louisville dominates repair demand due to Ohio River clay soils and population density, while Lexington, Bowling Green, and Owensboro also generate volume. Covington and Richmond experience foundation issues related to regional limestone and clay soil conditions.'
  },
  'louisiana': {
    soilTypes: 'Louisiana features highly problematic clay soils throughout much of the state, with New Orleans area containing organic clays and silts that provide poor foundation support. The Mississippi River Delta contains alluvial clays that shrink and swell dramatically, while coastal areas have organic soils and sand.',
    commonIssues: 'Extreme clay expansion and shrinkage affects foundations statewide, with New Orleans facing additional settlement from organic soil compression. Coastal areas experience foundation undermining from hurricanes and storm surge, while river parishes face flood-related foundation damage and soil instability.',
    avgCosts: 'Foundation repairs range from $4,500 to $16,000, with New Orleans averaging $8,500-$14,000 due to complex soil conditions and high demand. Baton Rouge sees $6,500-$11,500, while rural areas face $5,000-$9,500 with considerations for flood zone requirements and soil conditions.',
    seasonalFactors: 'Hurricane season (June-November) creates foundation-damaging storm surge and flooding, while summer heat causes maximum clay shrinkage. Winter provides optimal repair conditions when soil moisture stabilizes, though work must account for potential spring flooding patterns.',
    regulations: 'Louisiana requires contractor licensing through State Licensing Board for work over $7,500. Foundation work in flood zones requires special permits and elevation considerations, and Louisiana Revised Statutes provide consumer protection including bond requirements and warranty provisions.',
    topCities: 'New Orleans leads repair demand due to unique soil conditions and hurricane exposure, while Baton Rouge, Shreveport, and Lafayette also generate significant volume. Metairie and Kenner experience severe foundation issues from organic clays and Mississippi River proximity.'
  },
  'maine': {
    soilTypes: 'Maine contains glacial till soils with variable clay content and extensive rocky areas that provide generally stable foundation conditions. Coastal areas feature marine clay deposits that can be problematic, while inland regions have well-draining sandy soils mixed with granite-derived materials.',
    commonIssues: 'Frost heave affects foundations during severe winters throughout the state, while spring thaw causes settlement in poorly drained areas. Coastal foundations face salt exposure and marine clay settlement, and older homes experience fieldstone foundation deterioration from freeze-thaw cycles.',
    avgCosts: 'Foundation repairs range from $5,000 to $14,000, with Portland averaging $7,500-$12,000 due to marine clay conditions and coastal access challenges. Bangor and inland areas see $6,000-$10,500, while rural areas face $7,000-$13,000 due to limited contractor availability and access challenges.',
    seasonalFactors: 'Winter freeze-thaw creates maximum foundation stress from December through March, while spring thaw causes soil instability. Short construction season requires repairs during summer months when soil conditions are stable and sites are accessible before winter returns.',
    regulations: 'Maine does not require general contractor licensing but foundation work over $3,000 requires building permits. Maine Revised Statutes provide consumer protection through home improvement contract requirements including cooling-off periods and written contract provisions.',
    topCities: 'Portland dominates repair demand due to marine clay soils and population density, while Lewiston, Bangor, and Auburn also generate volume. Augusta and Biddeford experience foundation issues related to coastal and inland glacial soil conditions respectively.'
  },
  'maryland': {
    soilTypes: 'Maryland features diverse soil conditions from Piedmont clay soils in central regions to Atlantic Coastal Plain sandy soils in the east. The state contains marine clay deposits that can be expansive, while western areas have mountain soils derived from limestone and sandstone.',
    commonIssues: 'Central Maryland clay expansion causes foundation movement during wet periods, while eastern sandy soils experience settlement and erosion issues. Coastal areas face salt intrusion and high water table problems, and Baltimore area foundations deal with urban soil contamination and variable fill materials.',
    avgCosts: 'Foundation repairs range from $4,500 to $13,500, with Baltimore averaging $8,000-$12,000 due to urban soil conditions and high labor costs. Annapolis and coastal areas see $6,500-$11,000, while western mountain areas face $5,500-$10,000 depending on terrain access.',
    seasonalFactors: 'Spring rains saturate clay soils causing expansion from March through May, while winter freeze-thaw affects inland areas. Summer provides optimal repair conditions statewide, while hurricane season may affect coastal foundation work with storm surge and flooding concerns.',
    regulations: 'Maryland requires Home Improvement Contractor licensing through Department of Labor for work over $500. Foundation repairs require building permits for structural work, and Maryland Code provides consumer protection including bond requirements and cooling-off periods for contracts.',
    topCities: 'Baltimore leads repair demand due to urban soil conditions and aging housing stock, while Rockville, Frederick, and Annapolis also generate significant volume. Silver Spring and Gaithersburg experience foundation issues related to Piedmont clay soils and suburban development patterns.'
  },
  'massachusetts': {
    soilTypes: 'Massachusetts contains glacial till soils with variable clay content and extensive rocky areas throughout the state. Coastal areas feature marine clay deposits that can cause foundation issues, while inland regions have well-draining soils mixed with granite-derived materials and seasonal frost concerns.',
    commonIssues: 'Frost heave affects foundations during harsh New England winters, while spring thaw causes settlement in clay-rich areas. Older colonial homes experience fieldstone foundation deterioration, and coastal areas face foundation damage from nor\'easters and salt exposure affecting concrete structures.',
    avgCosts: 'Foundation repairs range from $5,500 to $15,000, with Boston averaging $9,000-$13,500 due to high labor costs and complex urban conditions. Worcester and Springfield see $7,000-$11,500, while Cape Cod faces $8,000-$14,000 due to coastal access challenges and marine environment.',
    seasonalFactors: 'Severe winter freeze-thaw creates maximum foundation stress from December through March, while spring thaw causes soil instability. Short construction season requires summer repairs when soil conditions are stable and harsh weather doesn\'t affect construction schedules.',
    regulations: 'Massachusetts requires Home Improvement Contractor registration through Office of Consumer Affairs for work over $1,000. Foundation work requires building permits, and Massachusetts General Laws provide strong consumer protection including cooling-off periods and bond requirements.',
    topCities: 'Boston dominates repair demand due to population density and historic housing stock with aging foundations, while Worcester, Springfield, and Cambridge also generate significant volume. Lowell and New Bedford experience foundation issues related to industrial history and varied soil conditions.'
  },
  'michigan': {
    soilTypes: 'Michigan features glacial till soils with high clay content and seasonal frost susceptibility throughout the state. Lake effect areas contain additional moisture-retaining clays, while northern regions have sandy soils mixed with organic materials that behave differently under freeze-thaw conditions.',
    commonIssues: 'Deep frost penetration causes severe foundation heave during harsh winters, while spring thaw creates settlement issues. Clay soil expansion affects foundations during wet periods, and Great Lakes proximity creates high water table problems in coastal areas affecting basement foundations.',
    avgCosts: 'Foundation repairs range from $4,500 to $13,500, with Detroit averaging $7,500-$11,500 due to clay conditions and urban factors. Grand Rapids and Lansing see $6,000-$10,000, while northern areas face $6,500-$12,000 due to severe frost conditions and limited contractor availability.',
    seasonalFactors: 'Harsh winters create maximum frost heave from December through February, while spring thaw causes dramatic soil changes. Short construction season requires repairs during summer months when soil conditions stabilize and severe weather doesn\'t halt construction activity.',
    regulations: 'Michigan requires contractor licensing through LARA (Licensing and Regulatory Affairs) for residential work. Foundation repairs require building permits for structural modifications, and Michigan law provides consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Detroit leads repair demand due to clay soils and large housing stock, while Grand Rapids, Warren, and Sterling Heights also generate significant volume. Lansing and Ann Arbor experience foundation issues related to glacial till soils and freeze-thaw cycles.'
  },
  'minnesota': {
    soilTypes: 'Minnesota contains glacial lake clay soils with high expansion potential throughout much of the state, particularly problematic in the Twin Cities metro area. Northern regions feature organic soils mixed with sandy glacial deposits, while southern areas have prairie soils with moderate clay content.',
    commonIssues: 'Severe clay expansion affects Twin Cities foundations during wet periods, while extreme frost penetration creates heave conditions during harsh winters. Northern Minnesota faces foundation issues from organic soil settlement, and lake proximity creates high water table problems affecting basement foundations.',
    avgCosts: 'Foundation repairs range from $5,000 to $14,500, with Minneapolis-St. Paul averaging $8,000-$12,500 due to expansive clay conditions. Duluth and northern areas see $6,500-$11,500 including frost-related repairs, while rural areas face $5,500-$9,500 with considerations for severe winter conditions.',
    seasonalFactors: 'Extreme winters create deep frost penetration affecting foundations from November through March, while spring thaw and summer rains cause clay expansion. Short construction season requires repairs during summer months when soil conditions are stable and accessible.',
    regulations: 'Minnesota requires contractor licensing through Department of Labor for residential work over $100. Foundation repairs require building permits for structural work, and Minnesota Statutes provide consumer protection including bond requirements and home improvement contract cooling-off periods.',
    topCities: 'Minneapolis and St. Paul dominate repair demand due to expansive glacial lake clays, while Duluth, Rochester, and Bloomington also generate significant volume. Plymouth and Minnetonka experience severe foundation movement from clay soil conditions in the metro area.'
  },
  'mississippi': {
    soilTypes: 'Mississippi features highly expansive clay soils throughout much of the state, with Jackson area containing particularly problematic Yazoo Clay formation. Coastal areas have sandy soils and organic materials, while delta regions contain alluvial clays that behave unpredictably under moisture changes.',
    commonIssues: 'Extreme clay expansion and shrinkage creates severe foundation damage statewide, with Jackson experiencing some of the worst conditions in the nation. Coastal areas face hurricane damage and storm surge foundation undermining, while delta regions have flood-related foundation settlement and instability.',
    avgCosts: 'Foundation repairs range from $3,500 to $14,000, with Jackson averaging $6,500-$12,000 due to severe Yazoo Clay conditions. Gulf Coast sees $5,500-$10,500 including hurricane-related repairs, while rural areas typically range $4,000-$8,000 with limited contractor availability affecting pricing.',
    seasonalFactors: 'Summer drought causes maximum clay shrinkage creating severe foundation stress, while spring and fall rains cause dramatic expansion. Hurricane season affects coastal foundations, making late fall through early spring optimal for repairs when soil moisture stabilizes.',
    regulations: 'Mississippi requires contractor licensing through Board of Contractors for residential work over $10,000. Foundation repairs require building permits in most municipalities, and Mississippi Code provides consumer protection including bond requirements and mechanic lien procedures.',
    topCities: 'Jackson dominates repair demand due to notorious Yazoo Clay soils causing extreme foundation movement, while Gulfport, Biloxi, and Hattiesburg also generate significant volume. Meridian and Tupelo experience foundation issues related to regional clay conditions and housing density.'
  },
  'missouri': {
    soilTypes: 'Missouri features diverse soil conditions from expansive clay soils in western regions to limestone-derived clay in the Ozarks. The state contains problematic glacial till in northern areas and alluvial soils along major rivers that create variable foundation support conditions.',
    commonIssues: 'Clay soil expansion affects foundations throughout the state during wet periods, while limestone areas experience karst-related settlement and sinkhole formation. River bottom areas face flood-related foundation damage, and older homes experience settlement from inadequate original foundation design.',
    avgCosts: 'Foundation repairs range from $3,800 to $12,500, with Kansas City and St. Louis averaging $6,500-$10,500 due to clay conditions and market competition. Springfield sees $5,500-$9,000, while rural areas typically range $4,500-$7,500 with regional soil considerations and contractor availability.',
    seasonalFactors: 'Spring rains cause clay expansion and potential flooding from March through May, while summer drought creates soil shrinkage. Winter freeze-thaw affects northern areas, making fall optimal for repairs when soil conditions stabilize before winter weather begins.',
    regulations: 'Missouri does not require general contractor licensing for residential work, but foundation work requires building permits. Missouri Revised Statutes provide consumer protection through home improvement contract requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Kansas City and St. Louis dominate repair demand due to clay soil conditions and large populations, while Springfield, Independence, and Columbia also generate significant volume. Branson and Cape Girardeau experience foundation issues related to Ozark limestone and Missouri River proximity respectively.'
  },
  'montana': {
    soilTypes: 'Montana contains expansive bentonite clay soils throughout much of the state, particularly problematic in eastern regions and around Billings. Western mountain areas feature decomposed granite and rocky soils, while northern plains have glacial till that creates moderate foundation challenges.',
    commonIssues: 'Bentonite clay expansion creates severe foundation movement when moisture levels change, while mountain areas face frost heave and rock movement during freeze-thaw cycles. Prairie regions experience foundation settlement from high winds and severe weather, with limited tree protection affecting soil moisture.',
    avgCosts: 'Foundation repairs range from $5,500 to $15,500, with Billings averaging $7,500-$12,500 due to expansive clay conditions. Missoula and western areas see $6,500-$13,000 including mountain access challenges, while rural areas face $8,000-$16,000 due to limited contractor availability and material transport.',
    seasonalFactors: 'Harsh winters create deep frost affecting foundations from November through March, while spring snowmelt saturates clay soils causing expansion. Short construction season requires summer repairs when weather permits access and soil conditions are stable.',
    regulations: 'Montana does not require general contractor licensing for residential work under $25,000, but foundation work requires building permits. Montana Code provides consumer protection through mechanic lien procedures and requires written contracts for home improvement work.',
    topCities: 'Billings leads repair demand due to bentonite clay soils and population density, while Missoula, Great Falls, and Bozeman also generate repair volume. Helena and Kalispell experience foundation issues related to mountain soil conditions and severe winter weather effects.'
  },
  'nebraska': {
    soilTypes: 'Nebraska features highly expansive clay soils throughout much of the state, with particularly problematic conditions in eastern regions around Omaha and Lincoln. Western areas contain less expansive soils, while the Platte River valley has alluvial soils with variable foundation support characteristics.',
    commonIssues: 'Severe clay expansion and shrinkage creates significant foundation damage during drought-wet cycles, particularly in eastern Nebraska. Prairie wind and weather extremes affect foundation stability, while river areas face potential flood damage and soil erosion affecting foundation support.',
    avgCosts: 'Foundation repairs range from $4,200 to $13,000, with Omaha averaging $6,500-$10,500 due to clay conditions and market factors. Lincoln sees similar costs, while western areas typically range $5,500-$9,500 with considerations for wind exposure and soil conditions.',
    seasonalFactors: 'Spring rains after winter drought cause maximum clay expansion from March through June, while summer heat creates soil shrinkage. Severe thunderstorms and tornado activity may affect construction schedules, making fall optimal for repairs when soil conditions stabilize.',
    regulations: 'Nebraska does not require general contractor licensing for residential work, but foundation repairs require building permits in most municipalities. Nebraska Revised Statutes provide consumer protection through mechanic lien procedures and home improvement contract requirements.',
    topCities: 'Omaha dominates repair demand due to expansive clay soils and population density, while Lincoln, Bellevue, and Grand Island also generate significant volume. Kearney and North Platte experience foundation issues related to prairie clay conditions and wind exposure.'
  },
  'nevada': {
    soilTypes: 'Nevada contains diverse soil conditions from expansive clay in valleys to rocky desert soils and caliche hardpan. Las Vegas area features problematic caliche that becomes extremely hard when dry but can cause foundation movement when irrigated, while northern areas have different clay compositions.',
    commonIssues: 'Caliche clay expansion affects Las Vegas foundations when landscape irrigation introduces moisture to previously dry soils. Desert settlement occurs as organic materials decompose, while flash flood erosion can undermine foundations in wash areas throughout the state.',
    avgCosts: 'Foundation repairs range from $5,000 to $16,000, with Las Vegas averaging $8,000-$13,000 due to caliche conditions and rapid development. Reno sees $6,500-$11,500, while rural areas face $7,000-$14,000 due to material transport costs and limited contractor availability in remote locations.',
    seasonalFactors: 'Rare but intense rainfall events can saturate dry soils causing unexpected foundation movement, while extreme summer heat affects construction schedules. Winter provides optimal repair conditions in southern Nevada, while northern areas face some freeze-thaw considerations.',
    regulations: 'Nevada requires contractor licensing through Nevada State Contractors Board for work over $1,000. Foundation repairs require building permits for structural work, and Nevada Revised Statutes provide consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Las Vegas dominates repair demand due to caliche soil conditions and rapid population growth, while Henderson, Reno, and North Las Vegas also generate significant volume. Carson City and Sparks experience foundation issues related to regional soil conditions and development patterns.'
  },
  'new-hampshire': {
    soilTypes: 'New Hampshire features glacial till soils with variable clay content and extensive rocky areas that generally provide stable foundation conditions. The state contains frost-susceptible soils that expand during freeze-thaw cycles, while mountain areas have thin soils over granite bedrock.',
    commonIssues: 'Frost heave affects foundations during severe New England winters, while spring thaw causes settlement in poorly drained areas. Rocky conditions require specialized foundation techniques, and older homes experience fieldstone foundation deterioration from repeated freeze-thaw cycles.',
    avgCosts: 'Foundation repairs range from $5,500 to $14,500, with Manchester averaging $7,500-$12,000 due to glacial soil conditions. Nashua and Portsmouth see similar costs, while rural mountain areas face $8,000-$15,000 due to access challenges and rock work requirements.',
    seasonalFactors: 'Harsh winters create maximum foundation stress from December through March with deep frost penetration, while spring thaw causes soil instability. Short construction season requires summer repairs when soil conditions are stable and mountain access is available.',
    regulations: 'New Hampshire does not require general contractor licensing but foundation work over $2,500 requires building permits. New Hampshire Revised Statutes provide consumer protection through home improvement contract requirements including cooling-off periods.',
    topCities: 'Manchester leads repair demand due to population density and glacial till conditions, while Nashua, Concord, and Dover also generate repair volume. Portsmouth and Derry experience foundation issues related to coastal and inland glacial soil conditions respectively.'
  },
  'new-jersey': {
    soilTypes: 'New Jersey features diverse soil conditions from Piedmont clay in northern regions to Atlantic Coastal Plain sandy soils in the south. The state contains marine clay deposits that can be problematic for foundations, while central areas have glacial till with moderate clay content.',
    commonIssues: 'Northern clay expansion causes foundation movement during wet periods, while southern sandy soils experience settlement and erosion issues. Coastal areas face salt intrusion and high water table problems, and urban areas deal with contaminated soils and variable fill materials.',
    avgCosts: 'Foundation repairs range from $5,500 to $16,000, with Newark and northern areas averaging $9,000-$14,000 due to clay conditions and high labor costs. Atlantic City and shore areas see $7,000-$12,500, while central regions typically range $6,500-$11,000.',
    seasonalFactors: 'Spring rains saturate clay soils causing expansion from March through May, while winter freeze-thaw affects northern areas. Hurricane season may disrupt coastal foundation work, making summer through early fall optimal for repairs when soil conditions are stable.',
    regulations: 'New Jersey requires Home Improvement Contractor registration through Division of Consumer Affairs for work over $500. Foundation repairs require building permits for structural work, and New Jersey law provides strong consumer protection including bond requirements.',
    topCities: 'Newark and Jersey City lead repair demand due to urban soil conditions and population density, while Paterson, Elizabeth, and Edison also generate significant volume. Atlantic City and shore communities experience foundation issues from coastal sandy soils and marine environments.'
  },
  'new-mexico': {
    soilTypes: 'New Mexico contains expansive clay soils throughout much of the state, particularly problematic in the Rio Grande valley and around Albuquerque. The state features caliche hardpan layers and adobe clay that expand dramatically when moisture is introduced to previously dry conditions.',
    commonIssues: 'Clay and caliche expansion affects foundations when landscape irrigation or rare heavy rains introduce moisture to dry soils. Flash flood erosion can undermine foundations, while high desert conditions cause soil settlement as organic materials decompose over time.',
    avgCosts: 'Foundation repairs range from $5,000 to $15,000, with Albuquerque averaging $7,500-$12,500 due to expansive clay conditions. Santa Fe sees $6,500-$11,500, while rural areas face $6,000-$13,000 due to material transport challenges and limited contractor availability.',
    seasonalFactors: 'Monsoon season (July-September) can saturate dry clay soils causing unexpected expansion, while winter provides stable repair conditions. Spring winds may affect construction schedules, making fall through early spring optimal for foundation work when soil conditions are predictable.',
    regulations: 'New Mexico requires contractor licensing through Construction Industries Division for work over $7,200. Foundation repairs require building permits for structural work, and New Mexico Statutes provide consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Albuquerque dominates repair demand due to Rio Grande valley clay soils and population density, while Las Cruces, Santa Fe, and Rio Rancho also generate significant volume. Roswell and Farmington experience foundation issues related to regional clay conditions and irrigation effects.'
  },
  'new-york': {
    soilTypes: 'New York features diverse soil conditions from glacial till with clay layers in upstate regions to marine clay deposits on Long Island. The state contains frost-susceptible soils throughout, while NYC area has complex urban fill materials and varied foundation challenges.',
    commonIssues: 'Frost heave affects foundations during harsh winters statewide, while clay areas experience expansion during wet periods. Long Island faces marine clay settlement issues, and urban areas deal with aging infrastructure and complex soil conditions from centuries of development.',
    avgCosts: 'Foundation repairs range from $6,000 to $18,000, with NYC averaging $10,000-$16,000 due to complex urban conditions and high labor costs. Albany and upstate areas see $7,000-$12,500, while Long Island faces $8,500-$15,000 due to marine clay conditions and access challenges.',
    seasonalFactors: 'Severe winters create maximum foundation stress from December through March, while spring thaw causes soil instability. Short construction season requires summer repairs when soil conditions are stable and harsh weather doesn\'t affect urban construction logistics.',
    regulations: 'New York requires Home Improvement Contractor licensing in NYC and some counties, with work over $200 requiring permits. New York law provides strong consumer protection including cooling-off periods, bond requirements, and strict licensing enforcement.',
    topCities: 'New York City dominates repair demand due to aging infrastructure and complex urban soil conditions, while Buffalo, Rochester, and Syracuse also generate significant volume. Yonkers and Albany experience foundation issues related to regional glacial soils and urban development patterns.'
  },
  'north-carolina': {
    soilTypes: 'North Carolina features red clay soils throughout the Piedmont region with moderate to high expansion potential, while coastal plains contain sandy soils with better drainage. Mountain areas have decomposed granite mixed with clay, creating diverse foundation challenges across the state.',
    commonIssues: 'Piedmont red clay expansion affects foundations during wet periods, particularly around Charlotte and Raleigh. Coastal areas experience foundation settlement in sandy soils, while mountain regions face slope stability issues and rock movement during freeze-thaw cycles.',
    avgCosts: 'Foundation repairs range from $4,000 to $13,000, with Charlotte and Raleigh averaging $7,000-$11,500 due to clay conditions and urban development. Coastal areas see $5,500-$9,500, while mountain regions face $6,000-$12,000 due to terrain challenges and specialized requirements.',
    seasonalFactors: 'Summer heat causes clay shrinkage while spring rains cause expansion, creating foundation stress from March through September. Hurricane season affects coastal foundations with storm surge and flooding, making fall through early spring optimal for repairs.',
    regulations: 'North Carolina requires contractor licensing through Board of Examiners for work over $30,000, with foundation work requiring building permits. North Carolina General Statutes provide consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Charlotte leads repair demand due to Piedmont red clay soils and rapid growth, while Raleigh, Greensboro, and Durham also generate significant volume. Wilmington and Asheville experience different foundation challenges from coastal sandy soils and mountain conditions respectively.'
  },
  'north-dakota': {
    soilTypes: 'North Dakota contains highly expansive bentonite clay soils throughout much of the state, creating some of the most severe foundation conditions in the nation. Prairie regions feature glacial lake clays with extreme expansion potential, while western areas have mixed clay and sandy soils.',
    commonIssues: 'Extreme bentonite clay expansion creates severe foundation damage when moisture levels change, with some areas experiencing soil movement exceeding industry standards. Deep frost penetration during harsh winters adds to foundation stress, while prairie wind affects soil moisture distribution.',
    avgCosts: 'Foundation repairs range from $6,000 to $18,000, with Fargo averaging $8,000-$14,000 due to extreme clay conditions. Bismarck sees similar costs, while western oil region areas face $9,000-$20,000 due to limited contractor availability and severe soil conditions.',
    seasonalFactors: 'Extreme winters create deep frost penetration from November through March, while spring thaw and occasional heavy rains cause dramatic clay expansion. Short construction season requires summer repairs when weather permits access and soil conditions are manageable.',
    regulations: 'North Dakota does not require general contractor licensing for residential work, but foundation repairs require building permits in most municipalities. North Dakota Century Code provides consumer protection through mechanic lien procedures and contract requirements.',
    topCities: 'Fargo dominates repair demand due to expansive glacial lake clays and population density, while Bismarck, Grand Forks, and Minot also generate repair volume. Williston experiences foundation issues related to bentonite clay conditions and oil boom construction challenges.'
  },
  'ohio': {
    soilTypes: 'Ohio features glacial till soils with moderate to high clay content throughout most of the state, creating seasonal foundation challenges. The state contains lacustrine clays from ancient lakes that can be particularly problematic, while southeastern areas have clay soils derived from sandstone and shale.',
    commonIssues: 'Clay soil expansion affects foundations during wet periods statewide, while freeze-thaw cycles cause foundation movement and basement wall failures. Great Lakes proximity creates high water table issues in northern areas, and older industrial cities face contaminated soil challenges.',
    avgCosts: 'Foundation repairs range from $4,000 to $12,500, with Cleveland and Columbus averaging $6,500-$10,500 due to clay conditions and market competition. Cincinnati sees similar costs, while rural areas typically range $4,500-$8,500 with regional soil considerations.',
    seasonalFactors: 'Spring rains and snowmelt saturate clay soils causing expansion from March through May, while winter freeze-thaw creates additional foundation stress. Summer provides optimal repair conditions when soil moisture stabilizes and weather permits consistent construction activity.',
    regulations: 'Ohio does not require general contractor licensing but foundation work requires building permits. Ohio Revised Code provides consumer protection through home improvement contract requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Columbus leads repair demand due to population growth and glacial till clay soils, while Cleveland, Cincinnati, and Toledo also generate significant volume. Akron and Dayton experience foundation issues related to regional clay conditions and older housing stock.'
  },
  'oklahoma': {
    soilTypes: 'Oklahoma contains highly expansive clay soils throughout much of the state, with particularly problematic conditions in central regions around Oklahoma City. The state features bentonite-rich clays that can expand dramatically with moisture changes, while eastern areas have somewhat less expansive prairie soils.',
    commonIssues: 'Extreme clay expansion and shrinkage creates severe foundation damage during drought-wet cycles, with Oklahoma City experiencing some of the highest foundation repair rates nationally. Tornado activity may cause additional foundation damage, while oil field areas face soil instability from extraction activities.',
    avgCosts: 'Foundation repairs range from $4,500 to $16,000, with Oklahoma City averaging $7,000-$13,000 due to severe clay conditions and high demand. Tulsa sees $6,000-$11,000, while rural areas face $5,500-$9,500 with considerations for wind exposure and soil extremes.',
    seasonalFactors: 'Spring rains after winter drought cause maximum clay expansion from March through May, while summer heat creates severe shrinkage. Tornado season affects construction schedules, making fall optimal for repairs when soil conditions stabilize and severe weather subsides.',
    regulations: 'Oklahoma requires contractor licensing through Department of Labor for residential work over $1,000. Foundation repairs require building permits in most municipalities, and Oklahoma Statutes provide consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Oklahoma City dominates repair demand due to notorious expansive clay soils causing extreme foundation movement, while Tulsa, Norman, and Broken Arrow also generate significant volume. Lawton and Edmond experience severe foundation issues from regional clay conditions and rapid development.'
  },
  'oregon': {
    soilTypes: 'Oregon features diverse soil conditions from volcanic ash and pumice in eastern regions to marine clay deposits along the coast. The Willamette Valley contains alluvial soils with seasonal clay expansion, while mountain areas have thin soils over volcanic bedrock.',
    commonIssues: 'Western Oregon clay expansion affects foundations during wet seasons, while eastern volcanic soils experience settlement as ash layers compact. Coastal areas face marine clay settlement and salt exposure, and mountain regions deal with slope stability and seasonal frost issues.',
    avgCosts: 'Foundation repairs range from $5,500 to $14,500, with Portland averaging $8,000-$12,500 due to clay conditions and high labor costs. Eugene and Salem see $6,500-$11,000, while coastal and mountain areas face $7,000-$13,500 due to access challenges and specialized requirements.',
    seasonalFactors: 'Winter rains saturate clay soils causing expansion from November through March, while dry summers provide optimal repair conditions. Coastal storms may affect foundation work schedules, making late summer through early fall ideal for repairs when soil conditions are stable.',
    regulations: 'Oregon requires contractor licensing through Construction Contractors Board for work over $1,000. Foundation repairs require building permits for structural work, and Oregon Revised Statutes provide consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Portland dominates repair demand due to Willamette Valley clay soils and population density, while Eugene, Salem, and Gresham also generate significant volume. Medford and Bend experience different foundation challenges from regional soil conditions and climate factors.'
  },
  'pennsylvania': {
    soilTypes: 'Pennsylvania features diverse soil conditions from glacial till in northern regions to limestone-derived clay in central areas. The state contains shale and sandstone-derived soils in western regions, while southeastern areas have clay soils that can cause foundation movement.',
    commonIssues: 'Clay soil expansion affects foundations during wet periods, particularly in southeastern regions around Philadelphia. Limestone areas experience karst-related settlement and sinkhole formation, while freeze-thaw cycles cause foundation movement throughout the state, especially in older construction.',
    avgCosts: 'Foundation repairs range from $4,500 to $14,000, with Philadelphia averaging $8,000-$12,500 due to urban clay conditions and high labor costs. Pittsburgh sees $6,500-$10,500, while rural areas typically range $5,000-$9,000 depending on terrain and soil conditions.',
    seasonalFactors: 'Spring rains saturate clay soils causing expansion from March through May, while winter freeze-thaw creates foundation stress. Summer provides optimal repair conditions when soil moisture stabilizes, while fall work allows completion before winter weather affects construction.',
    regulations: 'Pennsylvania requires Home Improvement Contractor registration through Attorney General for work over $5,000. Foundation repairs require building permits for structural work, and Pennsylvania law provides consumer protection including cooling-off periods and bond requirements.',
    topCities: 'Philadelphia leads repair demand due to urban clay soil conditions and aging housing stock, while Pittsburgh, Allentown, and Erie also generate significant volume. Reading and Scranton experience foundation issues related to regional limestone and shale-derived soil conditions.'
  },
  'rhode-island': {
    soilTypes: 'Rhode Island contains glacial till soils with moderate clay content and extensive rocky areas that generally provide stable foundation conditions. Coastal areas feature marine clay deposits that can cause settlement issues, while inland regions have well-draining soils mixed with granite materials.',
    commonIssues: 'Frost heave affects foundations during New England winters, while coastal areas face marine clay settlement and salt exposure. Older colonial foundations experience deterioration from freeze-thaw cycles, and high water tables near the coast create basement foundation challenges.',
    avgCosts: 'Foundation repairs range from $5,500 to $15,000, with Providence averaging $8,000-$13,000 due to urban conditions and marine clay proximity. Newport and coastal areas see $7,500-$14,000 due to marine environment challenges, while rural areas face $6,500-$11,500.',
    seasonalFactors: 'Winter freeze-thaw creates foundation stress from December through March, while spring provides soil instability from thaw conditions. Summer offers optimal repair conditions when soil moisture is stable and coastal access is unimpeded by winter storms.',
    regulations: 'Rhode Island requires contractor registration through Department of Business Regulation for work over $1,000. Foundation repairs require building permits for structural work, and Rhode Island General Laws provide consumer protection including cooling-off periods.',
    topCities: 'Providence dominates repair demand due to population density and mixed glacial-marine soil conditions, while Warwick, Cranston, and Pawtucket also generate repair volume. Newport and coastal communities experience foundation issues from marine clay soils and salt exposure.'
  },
  'south-carolina': {
    soilTypes: 'South Carolina features red clay soils in upstate regions with moderate expansion potential, while coastal areas contain sandy soils and marine clay deposits. The state has diverse soil conditions from Piedmont clay to Atlantic Coastal Plain sands that create varying foundation challenges.',
    commonIssues: 'Upstate clay expansion affects foundations during wet periods, particularly around Greenville and Spartanburg. Coastal areas experience foundation settlement in sandy soils and high water table issues, while hurricane storm surge can undermine coastal foundations.',
    avgCosts: 'Foundation repairs range from $3,800 to $12,000, with Charleston and coastal areas averaging $6,500-$10,500 due to marine environment considerations. Columbia and upstate areas see $5,000-$9,000, while rural regions typically range $4,000-$7,500 with lower labor costs.',
    seasonalFactors: 'Summer heat causes clay shrinkage in upstate areas while coastal regions remain stable, and hurricane season (June-November) affects coastal foundation work. Spring rains can saturate clay soils, making fall optimal for repairs when conditions stabilize.',
    regulations: 'South Carolina requires contractor licensing through Labor, Licensing and Regulation for residential work over $5,000. Foundation repairs require building permits, and South Carolina Code provides consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Charleston leads repair demand due to coastal sandy soils and historic housing stock, while Columbia, Greenville, and Rock Hill also generate significant volume. Myrtle Beach and Hilton Head experience foundation issues from coastal sandy soils and hurricane exposure.'
  },
  'south-dakota': {
    soilTypes: 'South Dakota contains highly expansive bentonite clay soils in western regions creating extreme foundation challenges, while eastern areas have glacial till with moderate clay content. The state features pierre shale-derived clays that can expand dramatically when moisture levels change.',
    commonIssues: 'Western bentonite clay expansion creates severe foundation damage with some of the most extreme soil movement conditions in the nation. Eastern areas experience moderate clay expansion and deep frost penetration, while prairie wind affects soil moisture distribution statewide.',
    avgCosts: 'Foundation repairs range from $5,500 to $17,000, with Rapid City averaging $7,500-$14,000 due to bentonite clay conditions. Sioux Falls sees $6,000-$11,000 with more moderate glacial till soils, while rural western areas face $8,000-$18,000 due to severe conditions and limited contractors.',
    seasonalFactors: 'Harsh winters create deep frost penetration from November through March, while spring moisture causes dramatic clay expansion in western regions. Short construction season requires summer repairs when weather permits access and soil conditions are manageable.',
    regulations: 'South Dakota does not require general contractor licensing for residential work, but foundation repairs require building permits in most municipalities. South Dakota law provides consumer protection through mechanic lien procedures and home improvement contract requirements.',
    topCities: 'Sioux Falls leads repair demand due to population density and glacial till conditions, while Rapid City faces severe bentonite clay foundation issues. Aberdeen and Watertown experience moderate foundation problems related to regional clay soil conditions and harsh winters.'
  },
  'tennessee': {
    soilTypes: 'Tennessee features limestone-derived clay soils throughout much of the state with moderate expansion potential, creating foundation challenges in Nashville and Memphis areas. Eastern regions contain mountain soils derived from sandstone and shale, while western areas have alluvial clays from the Mississippi River system.',
    commonIssues: 'Limestone clay expansion affects foundations during wet periods, particularly in Middle Tennessee around Nashville. Eastern mountain areas face rock movement and slope stability issues, while western regions experience Mississippi River flooding effects and alluvial soil settlement.',
    avgCosts: 'Foundation repairs range from $3,500 to $11,500, with Nashville averaging $6,000-$9,500 due to limestone clay conditions. Memphis sees $5,500-$9,000, while eastern mountain areas face $5,000-$10,500 due to terrain challenges and rock work requirements.',
    seasonalFactors: 'Spring rains saturate limestone clays causing expansion from March through May, while summer drought can cause shrinkage. Winter freeze-thaw affects mountain areas, making summer through early fall optimal for repairs when soil conditions are stable.',
    regulations: 'Tennessee requires contractor licensing through Department of Commerce for residential work over $3,000. Foundation repairs require building permits for structural work, and Tennessee Code provides consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Nashville dominates repair demand due to limestone clay soils and population growth, while Memphis, Knoxville, and Chattanooga also generate significant volume. Clarksville and Murfreesboro experience foundation issues related to Middle Tennessee limestone clay conditions.'
  },
  'utah': {
    soilTypes: 'Utah contains expansive clay soils throughout the Wasatch Front and Salt Lake Valley areas, with particularly problematic conditions around Salt Lake City and Provo. The state features lake bed clays from ancient Lake Bonneville that expand dramatically when moisture is introduced.',
    commonIssues: 'Lake bed clay expansion affects Wasatch Front foundations when landscape irrigation introduces moisture to previously dry soils. Mountain areas experience frost heave and rock movement, while desert regions face soil settlement as organic materials decompose.',
    avgCosts: 'Foundation repairs range from $5,000 to $15,000, with Salt Lake City averaging $7,500-$12,500 due to expansive lake bed clay conditions. Provo and Utah County see similar costs, while rural areas face $6,000-$13,000 due to material transport and specialized soil conditions.',
    seasonalFactors: 'Spring snowmelt can saturate clay soils causing expansion from March through May, while summer heat creates soil shrinkage. Mountain winter conditions limit access, making late spring through fall optimal for repairs when soil conditions are stable.',
    regulations: 'Utah requires contractor licensing through Division of Professional Licensing for work over $3,000. Foundation repairs require building permits for structural work, and Utah Code provides consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Salt Lake City dominates repair demand due to Lake Bonneville clay soils and population density, while West Valley City, Provo, and West Jordan also generate significant volume. Ogden and Orem experience foundation movement from regional lake bed clay conditions.'
  },
  'vermont': {
    soilTypes: 'Vermont features glacial till soils with variable clay content throughout the state, creating moderate foundation challenges. The state contains frost-susceptible soils and extensive rocky areas, while valley regions have more clay content that can affect foundations during wet periods.',
    commonIssues: 'Frost heave affects foundations during severe New England winters throughout the state, while spring thaw causes settlement in clay-rich valley areas. Rocky mountain soils require specialized foundation techniques, and older homes experience fieldstone foundation deterioration from freeze-thaw cycles.',
    avgCosts: 'Foundation repairs range from $5,500 to $14,000, with Burlington averaging $7,500-$12,000 due to Lake Champlain clay deposits. Montpelier and valley areas see $6,500-$11,000, while mountain regions face $7,000-$13,500 due to access challenges and rock work.',
    seasonalFactors: 'Harsh winters create maximum foundation stress from December through March with deep frost penetration, while spring thaw causes soil instability. Short construction season requires summer repairs when soil conditions are stable and mountain access is available.',
    regulations: 'Vermont does not require general contractor licensing but foundation work over $5,000 requires building permits. Vermont Statutes provide consumer protection through home improvement contract requirements including cooling-off periods and dispute resolution procedures.',
    topCities: 'Burlington leads repair demand due to Lake Champlain clay deposits and population density, while Rutland, Barre, and Montpelier also generate repair volume. Brattleboro and St. Albans experience foundation issues related to valley clay soils and freeze-thaw cycles.'
  },
  'virginia': {
    soilTypes: 'Virginia features red clay soils throughout the Piedmont region with moderate expansion potential, while coastal areas contain sandy soils and marine clay deposits. The state has mountain soils in western regions derived from limestone and sandstone that create different foundation challenges.',
    commonIssues: 'Piedmont red clay expansion affects foundations in central Virginia during wet periods, particularly around Richmond and the DC suburbs. Coastal areas experience foundation settlement and high water table issues, while mountain regions face rock movement and slope stability challenges.',
    avgCosts: 'Foundation repairs range from $4,500 to $14,000, with Northern Virginia averaging $8,500-$13,000 due to clay conditions and high labor costs. Richmond sees $6,000-$10,500, while coastal areas face $5,500-$10,000 depending on marine environment considerations.',
    seasonalFactors: 'Spring rains saturate clay soils causing expansion from March through May, while summer heat can cause shrinkage. Hurricane season may affect coastal foundation work, making fall through early spring optimal for repairs when soil conditions are stable.',
    regulations: 'Virginia requires contractor licensing through Board for Contractors for work over $1,000. Foundation repairs require building permits for structural work, and Virginia Code provides consumer protection including bond requirements and home improvement contract regulations.',
    topCities: 'Virginia Beach and Norfolk lead coastal repair demand, while Richmond dominates Piedmont clay repair volume. Arlington, Alexandria, and Fairfax generate high demand due to Northern Virginia clay conditions and population density.'
  },
  'washington': {
    soilTypes: 'Washington features diverse soil conditions from glacial till in northern regions to volcanic ash deposits from Mount St. Helens. Western areas contain marine clay deposits that can be problematic, while eastern regions have volcanic soils and occasional expansive clays.',
    commonIssues: 'Western Washington clay expansion affects foundations during wet seasons, while eastern volcanic soils experience settlement as ash layers compact. Coastal areas face marine clay settlement and seismic activity damage, and mountain regions deal with slope stability issues.',
    avgCosts: 'Foundation repairs range from $6,000 to $16,000, with Seattle averaging $9,000-$14,000 due to marine clay conditions and high labor costs. Spokane sees $6,500-$11,500, while coastal and mountain areas face $7,500-$15,000 due to access challenges and seismic requirements.',
    seasonalFactors: 'Winter rains saturate clay soils causing expansion from November through March, while dry summers provide optimal repair conditions. Seismic activity is unpredictable but construction is best scheduled during stable weather when soil conditions permit access.',
    regulations: 'Washington requires contractor licensing through Department of Labor & Industries for work over $1,000. Foundation repairs require building permits with seismic considerations, and Washington law provides consumer protection including bond requirements and recovery fund provisions.',
    topCities: 'Seattle dominates repair demand due to marine clay soils and seismic considerations, while Spokane, Tacoma, and Vancouver also generate significant volume. Bellevue and Everett experience foundation issues from regional glacial and marine clay soil conditions.'
  },
  'west-virginia': {
    soilTypes: 'West Virginia features clay soils derived from sandstone and shale throughout the mountainous terrain, creating unique foundation challenges on steep slopes. The state contains coal mine subsidence areas that affect foundation stability, while river valleys have alluvial soils with different characteristics.',
    commonIssues: 'Mountain slope instability affects foundations throughout the state, while coal mine subsidence creates sudden foundation settlement in affected areas. Shale-derived clay soils experience moderate expansion during wet periods, and steep terrain creates drainage and erosion issues.',
    avgCosts: 'Foundation repairs range from $4,000 to $13,000, with Charleston averaging $5,500-$9,500 due to river valley clay conditions. Morgantown sees $5,000-$9,000, while mountain areas face $6,000-$12,000 due to access challenges and specialized slope stabilization requirements.',
    seasonalFactors: 'Spring rains can trigger slope movement and saturate clay soils from March through May, while winter freeze-thaw affects mountain foundations. Summer provides optimal repair conditions when terrain is accessible and soil conditions are stable.',
    regulations: 'West Virginia requires contractor licensing through Division of Labor for work over $2,500. Foundation work in mine subsidence areas requires special considerations and insurance, and West Virginia Code provides consumer protection including bond requirements.',
    topCities: 'Charleston leads repair demand due to river valley location and clay soil conditions, while Huntington, Morgantown, and Parkersburg also generate repair volume. Wheeling and Martinsburg experience foundation issues related to regional clay conditions and terrain challenges.'
  },
  'wisconsin': {
    soilTypes: 'Wisconsin contains glacial till soils with high clay content and seasonal frost susceptibility throughout the state. Northern regions feature organic soils mixed with sandy deposits, while southern areas have prairie soils with moderate clay content that affects foundation stability.',
    commonIssues: 'Deep frost penetration causes severe foundation heave during harsh Wisconsin winters, while clay soil expansion affects foundations during wet periods. Great Lakes proximity creates high water table issues, and older homes experience basement foundation settlement and wall failures.',
    avgCosts: 'Foundation repairs range from $4,500 to $13,000, with Milwaukee averaging $7,000-$11,000 due to clay conditions and Great Lakes effects. Madison sees $6,000-$10,000, while northern areas face $6,500-$12,000 due to severe frost conditions and organic soil challenges.',
    seasonalFactors: 'Extreme winters create maximum frost penetration from December through February, while spring thaw causes dramatic soil changes. Short construction season requires repairs during summer months when soil conditions stabilize and harsh weather permits construction activity.',
    regulations: 'Wisconsin does not require general contractor licensing but foundation work requires building permits. Wisconsin Statutes provide consumer protection through home improvement contract requirements and mechanics lien procedures for payment disputes.',
    topCities: 'Milwaukee dominates repair demand due to Great Lakes clay effects and population density, while Madison, Green Bay, and Kenosha also generate significant volume. Appleton and Racine experience foundation issues related to glacial till soils and freeze-thaw cycles.'
  },
  'wyoming': {
    soilTypes: 'Wyoming contains highly expansive bentonite clay soils throughout much of the state, creating some of the most severe foundation conditions in the nation. The state features Pierre shale-derived clays that can expand dramatically when moisture levels change, while mountain areas have rocky soils.',
    commonIssues: 'Extreme bentonite clay expansion creates severe foundation damage when moisture levels change, with some regions experiencing soil movement that exceeds most engineering standards. Mountain areas face frost heave and rock movement, while prairie winds affect soil moisture distribution.',
    avgCosts: 'Foundation repairs range from $6,500 to $18,000, with Cheyenne averaging $8,000-$15,000 due to extreme bentonite clay conditions. Casper sees similar costs, while rural areas face $9,000-$20,000 due to severe soil conditions and very limited contractor availability.',
    seasonalFactors: 'Harsh winters create deep frost penetration from November through March, while rare but intense precipitation events can cause dramatic clay expansion. Short construction season requires summer repairs when weather permits access and soil conditions are manageable.',
    regulations: 'Wyoming does not require general contractor licensing for residential work, but foundation repairs require building permits in incorporated areas. Wyoming Statutes provide consumer protection through mechanic lien procedures and basic contract requirements.',
    topCities: 'Cheyenne leads repair demand due to bentonite clay soils and population concentration, while Casper, Laramie, and Gillette also see foundation issues. Jackson experiences different challenges from mountain soils and freeze-thaw cycles in the resort area.'
  }
}

// State-specific hero images — rotated across 4 Envato licensed images
const stateHeroImages = [
  '/images/heroes/foundation-formwork-rebar-home-addition.jpg',
  '/images/heroes/concrete-block-foundation-footing-repair.jpg',
  '/images/heroes/poured-concrete-foundation-walls-residential.jpg',
  '/images/heroes/concrete-block-foundation-construction-closeup.jpg',
]
const stateImages: Record<string, string> = {
  'texas': stateHeroImages[0],
  'california': stateHeroImages[1],
  'florida': stateHeroImages[2],
  'new-york': stateHeroImages[3],
  'pennsylvania': stateHeroImages[0],
  'illinois': stateHeroImages[1],
  'ohio': stateHeroImages[2],
  'georgia': stateHeroImages[3],
  'north-carolina': stateHeroImages[0],
  'michigan': stateHeroImages[1],
  'virginia': stateHeroImages[2],
  'tennessee': stateHeroImages[3],
  'missouri': stateHeroImages[0],
  'arizona': stateHeroImages[1],
  'colorado': stateHeroImages[2],
  'washington': stateHeroImages[3],
  'oregon': stateHeroImages[0],
  'minnesota': stateHeroImages[1],
  'indiana': stateHeroImages[2],
  'louisiana': stateHeroImages[3],
  'alabama': stateHeroImages[0],
  'south-carolina': stateHeroImages[1],
  'kentucky': stateHeroImages[2],
  'oklahoma': stateHeroImages[3],
  'mississippi': stateHeroImages[0],
  'arkansas': stateHeroImages[1],
  'kansas': stateHeroImages[2],
  'maryland': stateHeroImages[3],
  'new-jersey': stateHeroImages[0],
  'connecticut': stateHeroImages[1],
  'massachusetts': stateHeroImages[2],
  'default': stateHeroImages[0],
}

// Generate static params for common states
export async function generateStaticParams() {
  // Return the most common state routes to pre-generate
  return [
    { state: 'texas' },
    { state: 'california' },
    { state: 'florida' },
    { state: 'georgia' },
    { state: 'north-carolina' },
    { state: 'ohio' },
    { state: 'michigan' },
    { state: 'pennsylvania' },
    { state: 'illinois' },
    { state: 'virginia' },
    { state: 'tennessee' },
    { state: 'missouri' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  
  const stateData = await getStateData(state)
  if (!stateData) {
    return {
      title: 'State Not Found',
      description: 'The requested state page could not be found.',
    }
  }

  const { state: stateInfo } = stateData
  const url = `https://foundationscout.com/${state}`

  return {
    title: `Top Foundation Repair Contractors in ${stateInfo.name} (2026) | Compare Contractors`,
    description: `Find foundation repair contractors in ${stateInfo.name}. Compare ratings, read reviews, get compare local quotes. Licensed professionals serving 50+ cities statewide.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${stateInfo.name} Foundation Repair Contractors | Foundation Repair Directory`,
      description: `Find trusted foundation repair contractors in ${stateInfo.name}. Compare local experts, read verified reviews, and get estimates for pier & beam, slab, and basement repairs.`,
      url: url,
      images: [
        {
          url: 'https://foundationscout.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Foundation Repair in ${stateInfo.name}`,
        },
      ],
    },
  }
}

export default async function StatePage({ params }: Props) {
  const { state } = await params
  
  const stateData = await getStateData(state)
  if (!stateData) {
    notFound()
  }

  const { state: stateInfo, cities } = stateData
  const content = stateContent[state] || stateContent['texas'] // Fallback
  
  // Generate structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://foundationscout.com' },
    { name: `Foundation Repair in ${stateInfo.name}`, url: `https://foundationscout.com/${state}` }
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{stateInfo.name}</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-24 bg-slate-900 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={stateImages[state] || stateImages['default']}
              alt={`Foundation repair and construction work in ${stateInfo.name} — professional contractors installing concrete footings and structural reinforcement`}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[350px]">
              {/* Left side - Text content */}
              <div className="text-white">
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  Foundation Repair in {stateInfo.name}
                </h1>
                <p className="text-slate-200 text-lg mb-8 max-w-2xl leading-relaxed">
                  Browse foundation repair contractors by city in {stateInfo.name}. 
                  Find licensed professionals near you. Currently serving {cities.length} cities with verified contractors.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="material-symbols-outlined text-amber-400 text-sm">verified</span>
                    <span className="text-white text-sm font-medium">Licensed Contractors</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="material-symbols-outlined text-amber-400 text-sm fill-1">star</span>
                    <span className="text-white text-sm font-medium">Verified Reviews</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - Image space (image is in background) */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-3">Cities We Serve in {stateInfo.name}</h2>
              <p className="text-slate-600">Find foundation repair contractors in these cities across {stateInfo.name}.</p>
            </div>
            
            {cities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-on-scroll">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${state}/${city.slug}`}
                    className="city-card bg-white border border-slate-200 rounded-xl shadow-sm group flex flex-col p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <span className="material-symbols-outlined text-xl">location_city</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{city.name}</h3>
                        <p className="text-xs text-slate-500">{stateInfo.abbreviation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-500 text-sm">engineering</span>
                        <span className="text-slate-600 text-sm font-mono">
                          {city.business_count} contractor{city.business_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600">
                        <span className="text-xs font-bold">View</span>
                        <span className="material-symbols-outlined text-xs city-arrow">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="animate-on-scroll text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">map</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon to {stateInfo.name}</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  We&apos;re actively expanding our contractor network in {stateInfo.name}. Check back soon or join as a contractor to be listed.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-lg">handshake</span>
                  Join as a Contractor
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* State-Specific Content */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-6">
                Don't Let {stateInfo.name} Soil Conditions Damage Your Foundation
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {stateInfo.name} homeowners understand the importance of a solid foundation. Local soil conditions, 
                climate patterns, and building codes all affect foundation health. Our directory connects you 
                with verified foundation repair professionals across {stateInfo.name} who specialize in pier & beam, 
                slab, and basement repair services.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">terrain</span>
                    <h3 className="text-lg font-semibold text-slate-900">Soil Conditions</h3>
                  </div>
                  <p className="text-slate-600">{content.soilTypes}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
                    <h3 className="text-lg font-semibold text-slate-900">Common Issues</h3>
                  </div>
                  <p className="text-slate-600">{content.commonIssues}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">payments</span>
                    <h3 className="text-lg font-semibold text-slate-900">Average Costs</h3>
                  </div>
                  <p className="text-slate-600">{content.avgCosts}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">schedule</span>
                    <h3 className="text-lg font-semibold text-slate-900">Seasonal Factors</h3>
                  </div>
                  <p className="text-slate-600">{content.seasonalFactors}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">gavel</span>
                    <h3 className="text-lg font-semibold text-slate-900">Regulations & Licensing</h3>
                  </div>
                  <p className="text-slate-600">{content.regulations}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">location_city</span>
                    <h3 className="text-lg font-semibold text-slate-900">Top Cities</h3>
                  </div>
                  <p className="text-slate-600">{content.topCities}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Bio Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 animate-on-scroll">
            <ExpertBio variant="compact" className="mb-16" />
          </div>
        </section>

        {/* FAQ Section with Enhanced Animations */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 animate-on-scroll">
            <AnimatedFAQ
              title={`Foundation Repair FAQs for ${stateInfo.name}`}
              items={[
                {
                  question: `How much does foundation repair cost in ${stateInfo.name}?`,
                  answer: `${content.avgCosts} Costs vary based on the type of foundation, extent of damage, and local labor rates. Get multiple quotes for accurate pricing.`
                },
                {
                  question: "What are the signs I need foundation repair?",
                  answer: "Look for cracks in walls or foundation, doors/windows that stick, uneven floors, or gaps between wall and ceiling. Schedule a professional inspection if you notice these signs."
                },
                {
                  question: "How long does foundation repair take?",
                  answer: `Most foundation repairs take 1-3 days, though extensive repairs or adverse weather conditions in ${stateInfo.name} may extend the timeline.`
                },
                {
                  question: `What soil conditions affect foundations in ${stateInfo.name}?`,
                  answer: content.soilTypes
                },
                {
                  question: `When is the best time for foundation repairs in ${stateInfo.name}?`,
                  answer: content.seasonalFactors
                }
              ]}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12"
            />
          </div>
        </section>
      </main>

      <StitchFooter />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema)}
      />
    </div>
  )
}