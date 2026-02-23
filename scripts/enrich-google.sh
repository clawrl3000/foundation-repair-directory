#!/bin/bash
# Foundation Scout - Google Places API Enrichment
# Looks up each business via Google Places API, enriches Supabase with:
#   - editorial_summary → description
#   - rating/review count (update if fresher)
#   - opening_hours
#   - place types → service matching
# Usage: ./enrich-google.sh [--limit N] [--offset N] [--dry-run]

set -euo pipefail

SUPABASE_URL="https://zvfobtpgucmitsaeltig.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"
GOOGLE_KEY="AIzaSyBYKhmKGml71Ihdj9no6ZYvd8kTgwqCmg0"
LIMIT=10
OFFSET=0
DRY_RUN=false
LOG_FILE="/tmp/enrich-google-$(date +%Y%m%d-%H%M%S).log"

while [[ $# -gt 0 ]]; do
  case $1 in
    --limit) LIMIT="$2"; shift 2;;
    --offset) OFFSET="$2"; shift 2;;
    --dry-run) DRY_RUN=true; shift;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "🔍 Foundation Scout Google Places Enrichment" | tee "$LOG_FILE"
echo "  Limit: $LIMIT | Offset: $OFFSET | Dry run: $DRY_RUN" | tee -a "$LOG_FILE"
echo "  Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Fetch businesses
BUSINESSES=$(curl -s "${SUPABASE_URL}/rest/v1/businesses?select=id,name,slug,description,rating,review_count,city_id,state_id,cities:city_id(name),states:state_id(name,abbreviation)&is_active=eq.true&order=review_count.desc.nullslast&offset=${OFFSET}&limit=${LIMIT}" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

TMPFILE=$(mktemp)
echo "$BUSINESSES" > "$TMPFILE"
export ENRICH_DRY_RUN="$DRY_RUN"
export ENRICH_INPUT="$TMPFILE"
export GOOGLE_KEY="$GOOGLE_KEY"
export SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_KEY="$SUPABASE_KEY"
export ENRICH_LOG="$LOG_FILE"

python3 << 'PYTHON_SCRIPT'
import json, os, sys, time, urllib.request, urllib.parse

with open(os.environ["ENRICH_INPUT"]) as f:
    businesses = json.load(f)

GOOGLE_KEY = os.environ["GOOGLE_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
DRY_RUN = os.environ.get("ENRICH_DRY_RUN", "false") == "true"
LOG_FILE = os.environ["ENRICH_LOG"]

def log(msg):
    print(msg)
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")

log(f"📋 Found {len(businesses)} businesses to process")

# Service keyword mapping - used to match Google review text to our service IDs
SERVICE_KEYWORDS = {
    1: ["foundation repair", "foundation fix", "foundation problem"],
    2: ["pier and beam", "pier & beam"],
    3: ["slab foundation", "slab repair", "slab lifting", "slab leak"],
    4: ["wall anchor", "wall anchors", "bowing wall", "bowing walls"],
    5: ["foundation crack", "crack repair", "crack sealing", "wall crack"],
    6: ["basement waterproofing", "waterproofing", "wet basement", "basement sealing", "water in basement"],
    7: ["crawl space", "crawl space repair", "crawl space encapsulation", "encapsulation"],
    8: ["house leveling", "home leveling", "floor leveling"],
    9: ["underpinning", "underpin"],
    10: ["drainage", "french drain", "yard drainage", "drainage system", "sump pump"],
    11: ["concrete lifting", "concrete leveling", "polyurethane", "polyjacking", "foam lifting"],
    12: ["seawall", "sea wall"],
    13: ["retaining wall"],
    14: ["foundation inspection", "free inspection", "structural inspection", "free estimate"],
    20: ["foundation leveling", "leveling"],
    25: ["helical pier", "helical piers", "screw pile"],
    27: ["slabjacking", "slab jacking", "mudjacking", "mud jacking"],
    29: ["push pier", "push piers", "resistance pier"],
}

enriched = 0
skipped = 0
errors = 0
api_calls = 0

for i, biz in enumerate(businesses):
    name = biz["name"]
    city = (biz.get("cities") or {}).get("name", "")
    state = (biz.get("states") or {}).get("abbreviation", "")
    biz_id = biz["id"]
    
    log(f"\n--- [{i+1}/{len(businesses)}] {name} ({city}, {state}) ---")
    
    # Step 1: Find place
    search_query = f"{name} {city} {state} foundation repair"
    find_url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={urllib.parse.quote(search_query)}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total,business_status&key={GOOGLE_KEY}"
    
    try:
        with urllib.request.urlopen(find_url, timeout=10) as resp:
            find_result = json.loads(resp.read())
        api_calls += 1
    except Exception as e:
        log(f"  ❌ Find failed: {e}")
        errors += 1
        continue
    
    if find_result.get("status") != "OK" or not find_result.get("candidates"):
        log(f"  ⚠️ No Google results found")
        skipped += 1
        continue
    
    candidate = find_result["candidates"][0]
    place_id = candidate["place_id"]
    g_rating = candidate.get("rating")
    g_reviews = candidate.get("user_ratings_total", 0)
    g_status = candidate.get("business_status", "UNKNOWN")
    
    log(f"  📍 Found: {candidate.get('name')} — {candidate.get('formatted_address', 'N/A')}")
    log(f"  ⭐ Rating: {g_rating} ({g_reviews} reviews) | Status: {g_status}")
    
    # Step 2: Get place details
    detail_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=editorial_summary,reviews,opening_hours,website,types&key={GOOGLE_KEY}"
    
    try:
        with urllib.request.urlopen(detail_url, timeout=10) as resp:
            detail_result = json.loads(resp.read())
        api_calls += 1
    except Exception as e:
        log(f"  ❌ Details failed: {e}")
        errors += 1
        continue
    
    details = detail_result.get("result", {})
    
    # Extract editorial summary
    editorial = details.get("editorial_summary", {}).get("overview", "")
    current_desc = biz.get("description") or ""
    new_desc = editorial if editorial and len(editorial) > len(current_desc) else None
    
    if new_desc:
        log(f"  📝 Description: {new_desc[:100]}...")
    
    # Extract services from reviews text
    reviews = details.get("reviews", [])
    all_review_text = " ".join([r.get("text", "").lower() for r in reviews])
    # Also check the business name and editorial summary
    match_text = f"{name} {editorial} {all_review_text}".lower()
    
    matched_services = []
    for svc_id, keywords in SERVICE_KEYWORDS.items():
        for kw in keywords:
            if kw in match_text:
                matched_services.append(svc_id)
                break
    
    log(f"  🔧 Matched services: {len(matched_services)} — IDs: {matched_services}")
    
    # Build update payload
    update = {}
    # google_place_id column doesn't exist yet - skip for now
    # if place_id:
    #     update["google_place_id"] = place_id
    if new_desc:
        update["description"] = new_desc
    if g_rating and (not biz.get("rating") or g_reviews > (biz.get("review_count") or 0)):
        update["rating"] = g_rating
        update["review_count"] = g_reviews
    
    if not update and not matched_services:
        log(f"  ⏭️ Nothing new")
        skipped += 1
        continue
    
    if DRY_RUN:
        log(f"  🏜️ DRY RUN — would update: {json.dumps(update)} + {len(matched_services)} services")
        enriched += 1
        continue
    
    # Update business record
    if update:
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/businesses?id=eq.{biz_id}",
                data=json.dumps(update).encode(),
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                method="PATCH"
            )
            urllib.request.urlopen(req, timeout=10)
            log(f"  ✅ Updated business: {list(update.keys())}")
        except Exception as e:
            log(f"  ❌ Business update failed: {e}")
            errors += 1
    
    # Upsert service relationships
    if matched_services:
        for svc_id in matched_services:
            try:
                payload = json.dumps({"business_id": biz_id, "service_id": svc_id}).encode()
                req = urllib.request.Request(
                    f"{SUPABASE_URL}/rest/v1/business_services",
                    data=payload,
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal,resolution=merge-duplicates"
                    },
                    method="POST"
                )
                urllib.request.urlopen(req, timeout=10)
            except Exception as e:
                # Likely duplicate, that's fine
                pass
        log(f"  ✅ Added {len(matched_services)} service links")
    
    enriched += 1
    
    # Rate limit: ~10 req/sec is safe for Google Places
    time.sleep(0.2)

log(f"\n{'='*50}")
log(f"📊 Results: {enriched} enriched, {skipped} skipped, {errors} errors out of {len(businesses)} total")
log(f"📡 Google API calls: {api_calls}")
log(f"💰 Estimated cost: ~${api_calls * 0.017:.2f} (Find: ${api_calls//2 * 0.017:.2f} + Details: ${api_calls//2 * 0.017:.2f})")

PYTHON_SCRIPT

echo ""
echo "📄 Full log: $LOG_FILE"
