#!/bin/bash
# Foundation Scout - Business Enrichment Script
# Crawls contractor websites and enriches Supabase data
# Usage: ./enrich-businesses.sh [--limit N] [--offset N] [--dry-run]

set -euo pipefail

SUPABASE_URL="https://zvfobtpgucmitsaeltig.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"
LIMIT=10
OFFSET=0
DRY_RUN=false
LOG_FILE="/tmp/enrich-$(date +%Y%m%d-%H%M%S).log"

while [[ $# -gt 0 ]]; do
  case $1 in
    --limit) LIMIT="$2"; shift 2;;
    --offset) OFFSET="$2"; shift 2;;
    --dry-run) DRY_RUN=true; shift;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "🔍 Foundation Scout Business Enrichment" | tee "$LOG_FILE"
echo "  Limit: $LIMIT | Offset: $OFFSET | Dry run: $DRY_RUN" | tee -a "$LOG_FILE"
echo "  Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Fetch businesses with websites that need enrichment
BUSINESSES=$(curl -s "${SUPABASE_URL}/rest/v1/businesses?select=id,name,slug,website_url,description&is_active=eq.true&website_url=not.is.null&order=review_count.desc&offset=${OFFSET}&limit=${LIMIT}" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

COUNT=$(echo "$BUSINESSES" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
echo "📋 Found $COUNT businesses to process" | tee -a "$LOG_FILE"

TMPFILE=$(mktemp)
echo "$BUSINESSES" > "$TMPFILE"
export ENRICH_DRY_RUN="$DRY_RUN"
export ENRICH_INPUT="$TMPFILE"
python3 << 'PYTHON_SCRIPT'
import json, sys, subprocess, re, time, os

with open(os.environ["ENRICH_INPUT"]) as f:
    businesses = json.load(f)
SUPABASE_URL = "https://zvfobtpgucmitsaeltig.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"

# Known services and their keywords
SERVICE_KEYWORDS = {
    1: ["foundation repair", "foundation fix"],
    2: ["pier and beam", "pier & beam", "pier beam"],
    3: ["slab foundation", "slab repair", "slab lifting"],
    4: ["wall anchor", "wall anchors"],
    5: ["foundation crack", "crack repair", "crack sealing"],
    6: ["basement waterproofing", "waterproofing", "basement sealing", "wet basement"],
    7: ["crawl space repair", "crawl space encapsulation", "crawl space"],
    8: ["house leveling", "home leveling", "floor leveling"],
    9: ["underpinning", "underpin"],
    10: ["drainage solution", "drainage system", "french drain", "yard drainage"],
    11: ["concrete lifting", "concrete leveling", "polyurethane foam", "polyjacking"],
    12: ["seawall", "sea wall"],
    13: ["retaining wall"],
    14: ["foundation inspection", "free inspection", "structural inspection"],
    20: ["foundation leveling", "leveling"],
    25: ["helical pier", "helical piers", "screw pile"],
    27: ["slabjacking", "slab jacking", "mudjacking", "mud jacking"],
    29: ["push pier", "push piers", "resistance pier"],
}

DRY_RUN = os.environ.get("ENRICH_DRY_RUN", "false") == "true"

enriched = 0
skipped = 0
errors = 0

for biz in businesses:
    name = biz["name"]
    url = biz["website_url"]
    biz_id = biz["id"]
    
    print(f"\n--- {name} ---")
    print(f"  URL: {url}")
    
    # Crawl website — strip to homepage first
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        homepage = f"{parsed.scheme}://{parsed.netloc}/"
        
        # Crawl homepage + /services page for max coverage
        all_html = ""
        for page_url in [homepage, homepage + "services", homepage + "our-services", homepage + "about"]:
            try:
                result = subprocess.run(
                    ["curl", "-sL", "--max-time", "10", "-o", "-",
                     "-H", "User-Agent: Mozilla/5.0 (compatible; FoundationScout/1.0)",
                     page_url],
                    capture_output=True, text=True, timeout=15
                )
                if result.stdout and len(result.stdout) > 500:
                    all_html += result.stdout.lower() + " "
            except:
                pass
        
        html = all_html
        
        if len(html) < 500:
            print(f"  ⚠️ Too little content ({len(html)} chars), skipping")
            skipped += 1
            continue
            
        # Strip HTML tags for text analysis
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'\s+', ' ', text).strip()
        
        print(f"  📄 Fetched {len(text)} chars of text from {homepage}")
        
    except Exception as e:
        print(f"  ❌ Fetch error: {e}")
        errors += 1
        continue
    
    # Match services
    matched_services = []
    for svc_id, keywords in SERVICE_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                matched_services.append(svc_id)
                break
    
    print(f"  🔧 Matched services: {len(matched_services)} — IDs: {matched_services}")
    
    # Extract description if current one is thin
    current_desc = biz.get("description") or ""
    new_desc = None
    
    # Try to find meta description
    meta_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)', html)
    if meta_match and len(meta_match.group(1)) > len(current_desc):
        new_desc = meta_match.group(1).strip()
        # Clean up HTML entities
        new_desc = new_desc.replace("&amp;", "&").replace("&#x27;", "'").replace("&quot;", '"')
        if len(new_desc) > 300:
            new_desc = new_desc[:297] + "..."
        print(f"  📝 New description: {new_desc[:80]}...")
    
    # Check for year established
    year_match = re.search(r'(?:since|established|founded|serving since)\s*(\d{4})', text)
    year_established = None
    if year_match:
        year = int(year_match.group(1))
        if 1950 <= year <= 2025:
            year_established = year
            print(f"  📅 Year established: {year}")
    
    if not matched_services and not new_desc and not year_established:
        print(f"  ⏭️ Nothing new to add, skipping")
        skipped += 1
        continue
    
    if DRY_RUN:
        print(f"  🏁 DRY RUN — would update {len(matched_services)} services, desc={'yes' if new_desc else 'no'}, year={year_established}")
        enriched += 1
        continue
    
    # Write services to Supabase
    for svc_id in matched_services:
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/business_services",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", f"Authorization: Bearer {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-H", "Prefer: resolution=merge-duplicates",
            "-d", json.dumps({"business_id": biz_id, "service_id": svc_id})
        ], capture_output=True)
    
    # Update description and year if found
    updates = {}
    if new_desc and len(new_desc) > len(current_desc):
        updates["description"] = new_desc
    if year_established:
        updates["year_established"] = year_established
    
    if updates:
        subprocess.run([
            "curl", "-s", "-X", "PATCH",
            f"{SUPABASE_URL}/rest/v1/businesses?id=eq.{biz_id}",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", f"Authorization: Bearer {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(updates)
        ], capture_output=True)
    
    enriched += 1
    print(f"  ✅ Enriched! Services: {len(matched_services)}, Desc: {'updated' if new_desc else 'kept'}, Year: {year_established or 'n/a'}")
    
    # Rate limit
    time.sleep(1)

print(f"\n{'='*50}")
print(f"📊 Results: {enriched} enriched, {skipped} skipped, {errors} errors out of {len(businesses)} total")
PYTHON_SCRIPT
