#!/usr/bin/env python3
"""Fetch Google Place IDs for all businesses and store in Supabase."""
import json, time, urllib.parse, urllib.request, sys

GOOGLE_KEY = "AIzaSyBYKhmKGml71Ihdj9no6ZYvd8kTgwqCmg0"
SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"
BASE = "https://zvfobtpgucmitsaeltig.supabase.co"

def api_get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())

def supabase_get(path):
    req = urllib.request.Request(f"{BASE}/rest/v1/{path}")
    req.add_header("apikey", SKEY)
    req.add_header("Authorization", f"Bearer {SKEY}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())

def supabase_patch(table, id_val, data):
    url = f"{BASE}/rest/v1/{table}?id=eq.{id_val}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="PATCH")
    req.add_header("apikey", SKEY)
    req.add_header("Authorization", f"Bearer {SKEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Prefer", "return=minimal")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status

# Get all businesses without place_id
businesses = supabase_get("businesses?select=id,name,address,city_id&google_place_id=is.null&order=id&limit=600")
print(f"Found {len(businesses)} businesses without google_place_id", flush=True)

# Get city names for search queries
cities = supabase_get("cities?select=id,name")
city_map = {c["id"]: c["name"] for c in cities}

found = 0
skipped = 0
errors = 0

for i, biz in enumerate(businesses):
    city_name = city_map.get(biz.get("city_id"), "")
    search = f"{biz['name']} {city_name} foundation repair"
    
    try:
        url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={urllib.parse.quote(search)}&inputtype=textquery&fields=place_id&key={GOOGLE_KEY}"
        result = api_get(url)
        
        if result.get("candidates"):
            place_id = result["candidates"][0]["place_id"]
            status = supabase_patch("businesses", biz["id"], {"google_place_id": place_id})
            found += 1
            if (i + 1) % 50 == 0:
                print(f"  [{i+1}/{len(businesses)}] Found: {found}, Skipped: {skipped}, Errors: {errors}", flush=True)
        else:
            skipped += 1
    except Exception as e:
        errors += 1
        if errors <= 3:
            print(f"  Error on {biz['name']}: {e}")
    
    time.sleep(0.1)  # Rate limit

print(f"\nDone! Found: {found}, Skipped: {skipped}, Errors: {errors}", flush=True)
