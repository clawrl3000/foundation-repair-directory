#!/bin/bash
# Add 11 DuPage County cities to Foundation Scout database
# State: Illinois (id=13)

API="https://zvfobtpgucmitsaeltig.supabase.co/rest/v1"
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"
STATE_ID=13

# Cities to add: name|slug|population
CITIES=(
  "Downers Grove|downers-grove|49714"
  "Wheaton|wheaton|53970"
  "Bolingbrook|bolingbrook|73922"
  "Lombard|lombard|44048"
  "Glen Ellyn|glen-ellyn|28846"
  "Lisle|lisle|23363"
  "Westmont|westmont|25322"
  "Hinsdale|hinsdale|17366"
  "Oak Brook|oak-brook|8163"
  "Darien|darien|22179"
  "Woodridge|woodridge|34148"
)

echo "Adding DuPage County cities to Foundation Scout..."

for city_data in "${CITIES[@]}"; do
  IFS='|' read -r name slug pop <<< "$city_data"
  
  echo -n "Adding $name ($slug)... "
  
  result=$(curl -s -w "\n%{http_code}" \
    "$API/cities" \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{\"name\": \"$name\", \"slug\": \"$slug\", \"state_id\": $STATE_ID}")
  
  http_code=$(echo "$result" | tail -1)
  body=$(echo "$result" | head -1)
  
  if [ "$http_code" = "201" ]; then
    city_id=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
    echo "OK (id=$city_id)"
  else
    echo "FAILED ($http_code): $body"
  fi
done

echo ""
echo "Done! Verifying..."
curl -s "$API/cities?state_id=eq.$STATE_ID&select=id,name,slug&order=name" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" | python3 -m json.tool
