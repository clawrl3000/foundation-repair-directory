import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// ZIP prefix (3-digit) to state mapping — covers all US ZIP ranges
const ZIP_PREFIX_TO_STATE: Record<string, string> = {
  // 006-009: Puerto Rico (skip)
  '010': 'massachusetts', '011': 'massachusetts', '012': 'massachusetts', '013': 'massachusetts', '014': 'massachusetts', '015': 'massachusetts', '016': 'massachusetts', '017': 'massachusetts', '018': 'massachusetts', '019': 'massachusetts', '020': 'massachusetts', '021': 'massachusetts', '022': 'massachusetts', '023': 'massachusetts', '024': 'massachusetts', '025': 'massachusetts', '026': 'massachusetts', '027': 'massachusetts',
  '028': 'rhode-island', '029': 'rhode-island',
  '030': 'new-hampshire', '031': 'new-hampshire', '032': 'new-hampshire', '033': 'new-hampshire', '034': 'new-hampshire', '035': 'new-hampshire', '036': 'new-hampshire', '037': 'new-hampshire', '038': 'new-hampshire',
  '039': 'maine', '040': 'maine', '041': 'maine', '042': 'maine', '043': 'maine', '044': 'maine', '045': 'maine', '046': 'maine', '047': 'maine', '048': 'maine', '049': 'maine',
  '050': 'vermont', '051': 'vermont', '052': 'vermont', '053': 'vermont', '054': 'vermont', '056': 'vermont', '057': 'vermont', '058': 'vermont', '059': 'vermont',
  '060': 'connecticut', '061': 'connecticut', '062': 'connecticut', '063': 'connecticut', '064': 'connecticut', '065': 'connecticut', '066': 'connecticut', '067': 'connecticut', '068': 'connecticut', '069': 'connecticut',
  '070': 'new-jersey', '071': 'new-jersey', '072': 'new-jersey', '073': 'new-jersey', '074': 'new-jersey', '075': 'new-jersey', '076': 'new-jersey', '077': 'new-jersey', '078': 'new-jersey', '079': 'new-jersey', '080': 'new-jersey', '081': 'new-jersey', '082': 'new-jersey', '083': 'new-jersey', '084': 'new-jersey', '085': 'new-jersey', '086': 'new-jersey', '087': 'new-jersey', '088': 'new-jersey', '089': 'new-jersey',
  '100': 'new-york', '101': 'new-york', '102': 'new-york', '103': 'new-york', '104': 'new-york', '105': 'new-york', '106': 'new-york', '107': 'new-york', '108': 'new-york', '109': 'new-york',
  '110': 'new-york', '111': 'new-york', '112': 'new-york', '113': 'new-york', '114': 'new-york', '115': 'new-york', '116': 'new-york', '117': 'new-york', '118': 'new-york', '119': 'new-york',
  '120': 'new-york', '121': 'new-york', '122': 'new-york', '123': 'new-york', '124': 'new-york', '125': 'new-york', '126': 'new-york', '127': 'new-york', '128': 'new-york', '129': 'new-york',
  '130': 'new-york', '131': 'new-york', '132': 'new-york', '133': 'new-york', '134': 'new-york', '135': 'new-york', '136': 'new-york', '137': 'new-york', '138': 'new-york', '139': 'new-york',
  '140': 'new-york', '141': 'new-york', '142': 'new-york', '143': 'new-york', '144': 'new-york', '145': 'new-york', '146': 'new-york', '147': 'new-york', '148': 'new-york', '149': 'new-york',
  '150': 'pennsylvania', '151': 'pennsylvania', '152': 'pennsylvania', '153': 'pennsylvania', '154': 'pennsylvania', '155': 'pennsylvania', '156': 'pennsylvania', '157': 'pennsylvania', '158': 'pennsylvania', '159': 'pennsylvania',
  '160': 'pennsylvania', '161': 'pennsylvania', '162': 'pennsylvania', '163': 'pennsylvania', '164': 'pennsylvania', '165': 'pennsylvania', '166': 'pennsylvania', '167': 'pennsylvania', '168': 'pennsylvania', '169': 'pennsylvania',
  '170': 'pennsylvania', '171': 'pennsylvania', '172': 'pennsylvania', '173': 'pennsylvania', '174': 'pennsylvania', '175': 'pennsylvania', '176': 'pennsylvania', '177': 'pennsylvania', '178': 'pennsylvania', '179': 'pennsylvania',
  '180': 'pennsylvania', '181': 'pennsylvania', '182': 'pennsylvania', '183': 'pennsylvania', '184': 'pennsylvania', '185': 'pennsylvania', '186': 'pennsylvania', '187': 'pennsylvania', '188': 'pennsylvania', '189': 'pennsylvania',
  '190': 'pennsylvania', '191': 'pennsylvania', '192': 'pennsylvania', '193': 'pennsylvania', '194': 'pennsylvania', '195': 'pennsylvania', '196': 'pennsylvania',
  '197': 'delaware', '198': 'delaware', '199': 'delaware',
  '200': 'virginia', '201': 'virginia', '202': 'washington-dc', '203': 'washington-dc', '204': 'virginia', '205': 'virginia',
  '206': 'maryland', '207': 'maryland', '208': 'maryland', '209': 'maryland', '210': 'maryland', '211': 'maryland', '212': 'maryland', '214': 'maryland', '215': 'maryland', '216': 'maryland', '217': 'maryland', '218': 'maryland', '219': 'maryland',
  '220': 'virginia', '221': 'virginia', '222': 'virginia', '223': 'virginia', '224': 'virginia', '225': 'virginia', '226': 'virginia', '227': 'virginia', '228': 'virginia', '229': 'virginia',
  '230': 'virginia', '231': 'virginia', '232': 'virginia', '233': 'virginia', '234': 'virginia', '235': 'virginia', '236': 'virginia', '237': 'virginia', '238': 'virginia', '239': 'virginia',
  '240': 'virginia', '241': 'virginia', '242': 'virginia', '243': 'virginia', '244': 'virginia', '245': 'virginia', '246': 'virginia',
  '247': 'west-virginia', '248': 'west-virginia', '249': 'west-virginia', '250': 'west-virginia', '251': 'west-virginia', '252': 'west-virginia', '253': 'west-virginia', '254': 'west-virginia', '255': 'west-virginia', '256': 'west-virginia', '257': 'west-virginia', '258': 'west-virginia', '259': 'west-virginia', '260': 'west-virginia', '261': 'west-virginia', '262': 'west-virginia', '263': 'west-virginia', '264': 'west-virginia', '265': 'west-virginia', '266': 'west-virginia', '267': 'west-virginia', '268': 'west-virginia',
  '270': 'north-carolina', '271': 'north-carolina', '272': 'north-carolina', '273': 'north-carolina', '274': 'north-carolina', '275': 'north-carolina', '276': 'north-carolina', '277': 'north-carolina', '278': 'north-carolina', '279': 'north-carolina', '280': 'north-carolina', '281': 'north-carolina', '282': 'north-carolina', '283': 'north-carolina', '284': 'north-carolina', '285': 'north-carolina', '286': 'north-carolina', '287': 'north-carolina', '288': 'north-carolina', '289': 'north-carolina',
  '290': 'south-carolina', '291': 'south-carolina', '292': 'south-carolina', '293': 'south-carolina', '294': 'south-carolina', '295': 'south-carolina', '296': 'south-carolina', '297': 'south-carolina', '298': 'south-carolina', '299': 'south-carolina',
  '300': 'georgia', '301': 'georgia', '302': 'georgia', '303': 'georgia', '304': 'georgia', '305': 'georgia', '306': 'georgia', '307': 'georgia', '308': 'georgia', '309': 'georgia',
  '310': 'georgia', '311': 'georgia', '312': 'georgia', '313': 'georgia', '314': 'georgia', '315': 'georgia', '316': 'georgia', '317': 'georgia', '318': 'georgia', '319': 'georgia',
  '320': 'florida', '321': 'florida', '322': 'florida', '323': 'florida', '324': 'florida', '325': 'florida', '326': 'florida', '327': 'florida', '328': 'florida', '329': 'florida',
  '330': 'florida', '331': 'florida', '332': 'florida', '333': 'florida', '334': 'florida', '335': 'florida', '336': 'florida', '337': 'florida', '338': 'florida', '339': 'florida',
  '340': 'florida', '341': 'florida', '342': 'florida', '344': 'florida', '346': 'florida', '347': 'florida', '349': 'florida',
  '350': 'alabama', '351': 'alabama', '352': 'alabama', '354': 'alabama', '355': 'alabama', '356': 'alabama', '357': 'alabama', '358': 'alabama', '359': 'alabama', '360': 'alabama', '361': 'alabama', '362': 'alabama', '363': 'alabama', '364': 'alabama', '365': 'alabama', '366': 'alabama', '367': 'alabama', '368': 'alabama', '369': 'alabama',
  '370': 'tennessee', '371': 'tennessee', '372': 'tennessee', '373': 'tennessee', '374': 'tennessee', '375': 'tennessee', '376': 'tennessee', '377': 'tennessee', '378': 'tennessee', '379': 'tennessee', '380': 'tennessee', '381': 'tennessee', '382': 'tennessee', '383': 'tennessee', '384': 'tennessee', '385': 'tennessee',
  '386': 'mississippi', '387': 'mississippi', '388': 'mississippi', '389': 'mississippi', '390': 'mississippi', '391': 'mississippi', '392': 'mississippi', '393': 'mississippi', '394': 'mississippi', '395': 'mississippi', '396': 'mississippi', '397': 'mississippi',
  '400': 'kentucky', '401': 'kentucky', '402': 'kentucky', '403': 'kentucky', '404': 'kentucky', '405': 'kentucky', '406': 'kentucky', '407': 'kentucky', '408': 'kentucky', '409': 'kentucky',
  '410': 'kentucky', '411': 'kentucky', '412': 'kentucky', '413': 'kentucky', '414': 'kentucky', '415': 'kentucky', '416': 'kentucky', '417': 'kentucky', '418': 'kentucky',
  '420': 'kentucky', '421': 'kentucky', '422': 'kentucky', '423': 'kentucky', '424': 'kentucky', '425': 'kentucky', '426': 'kentucky', '427': 'kentucky',
  '430': 'ohio', '431': 'ohio', '432': 'ohio', '433': 'ohio', '434': 'ohio', '435': 'ohio', '436': 'ohio', '437': 'ohio', '438': 'ohio', '439': 'ohio',
  '440': 'ohio', '441': 'ohio', '442': 'ohio', '443': 'ohio', '444': 'ohio', '445': 'ohio', '446': 'ohio', '447': 'ohio', '448': 'ohio', '449': 'ohio',
  '450': 'ohio', '451': 'ohio', '452': 'ohio', '453': 'ohio', '454': 'ohio', '455': 'ohio', '456': 'ohio', '457': 'ohio', '458': 'ohio',
  '460': 'indiana', '461': 'indiana', '462': 'indiana', '463': 'indiana', '464': 'indiana', '465': 'indiana', '466': 'indiana', '467': 'indiana', '468': 'indiana', '469': 'indiana',
  '470': 'indiana', '471': 'indiana', '472': 'indiana', '473': 'indiana', '474': 'indiana', '475': 'indiana', '476': 'indiana', '477': 'indiana', '478': 'indiana', '479': 'indiana',
  '480': 'michigan', '481': 'michigan', '482': 'michigan', '483': 'michigan', '484': 'michigan', '485': 'michigan', '486': 'michigan', '487': 'michigan', '488': 'michigan', '489': 'michigan',
  '490': 'michigan', '491': 'michigan', '492': 'michigan', '493': 'michigan', '494': 'michigan', '495': 'michigan', '496': 'michigan', '497': 'michigan', '498': 'michigan', '499': 'michigan',
  '500': 'iowa', '501': 'iowa', '502': 'iowa', '503': 'iowa', '504': 'iowa', '505': 'iowa', '506': 'iowa', '507': 'iowa', '508': 'iowa', '509': 'iowa',
  '510': 'iowa', '511': 'iowa', '512': 'iowa', '513': 'iowa', '514': 'iowa', '515': 'iowa', '516': 'iowa', '520': 'iowa', '521': 'iowa', '522': 'iowa', '523': 'iowa', '524': 'iowa', '525': 'iowa', '526': 'iowa', '527': 'iowa', '528': 'iowa',
  '530': 'wisconsin', '531': 'wisconsin', '532': 'wisconsin', '534': 'wisconsin', '535': 'wisconsin', '537': 'wisconsin', '538': 'wisconsin', '539': 'wisconsin',
  '540': 'wisconsin', '541': 'wisconsin', '542': 'wisconsin', '543': 'wisconsin', '544': 'wisconsin', '545': 'wisconsin', '546': 'wisconsin', '547': 'wisconsin', '548': 'wisconsin', '549': 'wisconsin',
  '550': 'minnesota', '551': 'minnesota', '553': 'minnesota', '554': 'minnesota', '555': 'minnesota', '556': 'minnesota', '557': 'minnesota', '558': 'minnesota', '559': 'minnesota', '560': 'minnesota', '561': 'minnesota', '562': 'minnesota', '563': 'minnesota', '564': 'minnesota', '565': 'minnesota', '566': 'minnesota', '567': 'minnesota',
  '570': 'south-dakota', '571': 'south-dakota', '572': 'south-dakota', '573': 'south-dakota', '574': 'south-dakota', '575': 'south-dakota', '576': 'south-dakota', '577': 'south-dakota',
  '580': 'north-dakota', '581': 'north-dakota', '582': 'north-dakota', '583': 'north-dakota', '584': 'north-dakota', '585': 'north-dakota', '586': 'north-dakota', '587': 'north-dakota', '588': 'north-dakota',
  '590': 'montana', '591': 'montana', '592': 'montana', '593': 'montana', '594': 'montana', '595': 'montana', '596': 'montana', '597': 'montana', '598': 'montana', '599': 'montana',
  '600': 'illinois', '601': 'illinois', '602': 'illinois', '603': 'illinois', '604': 'illinois', '605': 'illinois', '606': 'illinois', '607': 'illinois', '608': 'illinois', '609': 'illinois',
  '610': 'illinois', '611': 'illinois', '612': 'illinois', '613': 'illinois', '614': 'illinois', '615': 'illinois', '616': 'illinois', '617': 'illinois', '618': 'illinois', '619': 'illinois',
  '620': 'illinois', '621': 'illinois', '622': 'illinois', '623': 'illinois', '624': 'illinois', '625': 'illinois', '626': 'illinois', '627': 'illinois', '628': 'illinois', '629': 'illinois',
  '630': 'missouri', '631': 'missouri', '633': 'missouri', '634': 'missouri', '635': 'missouri', '636': 'missouri', '637': 'missouri', '638': 'missouri', '639': 'missouri',
  '640': 'missouri', '641': 'missouri', '644': 'missouri', '645': 'missouri', '646': 'missouri', '647': 'missouri', '648': 'missouri', '649': 'missouri', '650': 'missouri', '651': 'missouri', '652': 'missouri', '653': 'missouri', '654': 'missouri', '655': 'missouri', '656': 'missouri', '657': 'missouri', '658': 'missouri',
  '660': 'kansas', '661': 'kansas', '662': 'kansas', '664': 'kansas', '665': 'kansas', '666': 'kansas', '667': 'kansas', '668': 'kansas', '669': 'kansas',
  '670': 'kansas', '671': 'kansas', '672': 'kansas', '673': 'kansas', '674': 'kansas', '675': 'kansas', '676': 'kansas', '677': 'kansas', '678': 'kansas', '679': 'kansas',
  '680': 'nebraska', '681': 'nebraska', '683': 'nebraska', '684': 'nebraska', '685': 'nebraska', '686': 'nebraska', '687': 'nebraska', '688': 'nebraska', '689': 'nebraska', '690': 'nebraska', '691': 'nebraska', '692': 'nebraska', '693': 'nebraska',
  '700': 'louisiana', '701': 'louisiana', '703': 'louisiana', '704': 'louisiana', '705': 'louisiana', '706': 'louisiana', '707': 'louisiana', '708': 'louisiana', '710': 'louisiana', '711': 'louisiana', '712': 'louisiana', '713': 'louisiana', '714': 'louisiana',
  '716': 'arkansas', '717': 'arkansas', '718': 'arkansas', '719': 'arkansas', '720': 'arkansas', '721': 'arkansas', '722': 'arkansas', '723': 'arkansas', '724': 'arkansas', '725': 'arkansas', '726': 'arkansas', '727': 'arkansas', '728': 'arkansas', '729': 'arkansas',
  '730': 'oklahoma', '731': 'oklahoma', '734': 'oklahoma', '735': 'oklahoma', '736': 'oklahoma', '737': 'oklahoma', '738': 'oklahoma', '739': 'oklahoma', '740': 'oklahoma', '741': 'oklahoma', '743': 'oklahoma', '744': 'oklahoma', '745': 'oklahoma', '746': 'oklahoma', '747': 'oklahoma', '748': 'oklahoma', '749': 'oklahoma',
  '750': 'texas', '751': 'texas', '752': 'texas', '753': 'texas', '754': 'texas', '755': 'texas', '756': 'texas', '757': 'texas', '758': 'texas', '759': 'texas',
  '760': 'texas', '761': 'texas', '762': 'texas', '763': 'texas', '764': 'texas', '765': 'texas', '766': 'texas', '767': 'texas', '768': 'texas', '769': 'texas',
  '770': 'texas', '771': 'texas', '772': 'texas', '773': 'texas', '774': 'texas', '775': 'texas', '776': 'texas', '777': 'texas', '778': 'texas', '779': 'texas',
  '780': 'texas', '781': 'texas', '782': 'texas', '783': 'texas', '784': 'texas', '785': 'texas', '786': 'texas', '787': 'texas', '788': 'texas', '789': 'texas',
  '790': 'texas', '791': 'texas', '792': 'texas', '793': 'texas', '794': 'texas', '795': 'texas', '796': 'texas', '797': 'texas', '798': 'texas', '799': 'texas',
  '800': 'colorado', '801': 'colorado', '802': 'colorado', '803': 'colorado', '804': 'colorado', '805': 'colorado', '806': 'colorado', '807': 'colorado', '808': 'colorado', '809': 'colorado', '810': 'colorado', '811': 'colorado', '812': 'colorado', '813': 'colorado', '814': 'colorado', '815': 'colorado', '816': 'colorado',
  '820': 'wyoming', '821': 'wyoming', '822': 'wyoming', '823': 'wyoming', '824': 'wyoming', '825': 'wyoming', '826': 'wyoming', '827': 'wyoming', '828': 'wyoming', '829': 'wyoming', '830': 'wyoming', '831': 'wyoming',
  '832': 'idaho', '833': 'idaho', '834': 'idaho', '835': 'idaho', '836': 'idaho', '837': 'idaho', '838': 'idaho',
  '840': 'utah', '841': 'utah', '842': 'utah', '843': 'utah', '844': 'utah', '845': 'utah', '846': 'utah', '847': 'utah',
  '850': 'arizona', '851': 'arizona', '852': 'arizona', '853': 'arizona', '855': 'arizona', '856': 'arizona', '857': 'arizona', '859': 'arizona', '860': 'arizona',
  '863': 'new-mexico', '864': 'new-mexico', '865': 'new-mexico', '870': 'new-mexico', '871': 'new-mexico', '872': 'new-mexico', '873': 'new-mexico', '874': 'new-mexico', '875': 'new-mexico', '877': 'new-mexico', '878': 'new-mexico', '879': 'new-mexico', '880': 'new-mexico', '881': 'new-mexico', '882': 'new-mexico', '883': 'new-mexico', '884': 'new-mexico',
  '889': 'nevada', '890': 'nevada', '891': 'nevada', '893': 'nevada', '894': 'nevada', '895': 'nevada', '897': 'nevada', '898': 'nevada',
  '900': 'california', '901': 'california', '902': 'california', '903': 'california', '904': 'california', '905': 'california', '906': 'california', '907': 'california', '908': 'california', '910': 'california', '911': 'california', '912': 'california', '913': 'california', '914': 'california', '915': 'california', '916': 'california', '917': 'california', '918': 'california',
  '919': 'california', '920': 'california', '921': 'california', '922': 'california', '923': 'california', '924': 'california', '925': 'california', '926': 'california', '927': 'california', '928': 'california',
  '930': 'california', '931': 'california', '932': 'california', '933': 'california', '934': 'california', '935': 'california', '936': 'california', '937': 'california', '938': 'california', '939': 'california',
  '940': 'california', '941': 'california', '942': 'california', '943': 'california', '944': 'california', '945': 'california', '946': 'california', '947': 'california', '948': 'california', '949': 'california',
  '950': 'california', '951': 'california', '952': 'california', '953': 'california', '954': 'california', '955': 'california', '956': 'california', '957': 'california', '958': 'california', '959': 'california', '960': 'california', '961': 'california',
  '970': 'oregon', '971': 'oregon', '972': 'oregon', '973': 'oregon', '974': 'oregon', '975': 'oregon', '976': 'oregon', '977': 'oregon', '978': 'oregon', '979': 'oregon',
  '980': 'washington', '981': 'washington', '982': 'washington', '983': 'washington', '984': 'washington', '985': 'washington', '986': 'washington', '988': 'washington', '989': 'washington', '990': 'washington', '991': 'washington', '992': 'washington', '993': 'washington', '994': 'washington',
  '995': 'alaska', '996': 'alaska', '997': 'alaska', '998': 'alaska', '999': 'alaska',
  '967': 'hawaii', '968': 'hawaii',
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip')
  
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })
  }

  const prefix = zip.substring(0, 3)
  const stateSlug = ZIP_PREFIX_TO_STATE[prefix]
  
  if (!stateSlug) {
    return NextResponse.json({ error: 'ZIP code not recognized' }, { status: 404 })
  }

  // Look up the state in our DB to get the full name
  const { data: stateData } = await supabaseAdmin
    .from('states')
    .select('name, slug, abbreviation')
    .eq('slug', stateSlug)
    .single()

  if (!stateData) {
    return NextResponse.json({ 
      stateSlug,
      stateName: stateSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      city: null,
      citySlug: null
    })
  }

  // Try to find the nearest city in this state that we have in our DB
  // For now, return the state and let the frontend navigate to the state page
  const { data: cities } = await supabaseAdmin
    .from('cities')
    .select('name, slug, state_id')
    .eq('states.slug', stateSlug)
    .limit(1)

  // Also try a direct city lookup via businesses with addresses containing the zip
  const { data: bizWithZip } = await supabaseAdmin
    .from('businesses')
    .select('city_id, cities(name, slug, state_id)')
    .ilike('address', `%${zip}%`)
    .limit(1)

  let city = null
  let citySlug = null

  if (bizWithZip && bizWithZip.length > 0) {
    const cityData = (bizWithZip[0] as any).cities
    if (cityData) {
      city = cityData.name
      citySlug = cityData.slug
    }
  }

  return NextResponse.json({
    stateSlug: stateData.slug,
    stateName: stateData.name,
    stateAbbr: stateData.abbreviation,
    city,
    citySlug
  })
}
