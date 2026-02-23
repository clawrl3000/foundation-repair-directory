#!/bin/bash

# Foundation Scout - City Content Population Script
# Inserts city-specific geological and climate data

SUPABASE_URL="https://zvfobtpgucmitsaeltig.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc"

# Function to insert city content
insert_city_content() {
    local city_id=$1
    local soil_type=$2
    local climate_zone=$3
    local common_issues=$4
    local cost_min=$5
    local cost_max=$6
    local content_body=$7
    local tips=$8
    
    echo "Inserting content for city_id: $city_id"
    
    # Escape quotes and create JSON
    local json_data=$(cat <<EOF
{
  "city_id": $city_id,
  "soil_type": "$soil_type",
  "climate_zone": "$climate_zone", 
  "common_issues": $common_issues,
  "avg_repair_cost_min": $cost_min,
  "avg_repair_cost_max": $cost_max,
  "content_body": "$(echo "$content_body" | sed 's/"/\\"/g')",
  "tips": $tips
}
EOF
)
    
    # Make the INSERT request
    curl -X POST "$SUPABASE_URL/rest/v1/city_content" \
      -H "apikey: $SERVICE_KEY" \
      -H "Authorization: Bearer $SERVICE_KEY" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=minimal" \
      -d "$json_data"
      
    echo ""
}

echo "Starting city content population..."

# New York (198)
insert_city_content 198 \
    "Glacial till and bedrock" \
    "Humid continental" \
    '["Foundation settlement from freeze-thaw cycles", "Water infiltration", "Basement wall cracks", "Hydrostatic pressure"]' \
    6000 18000 \
    "New York City's foundation challenges stem from its diverse geological foundation of Manhattan schist, glacial deposits, and varying bedrock depths. The humid continental climate with freeze-thaw cycles can cause foundation movement and cracking. Many older buildings face issues with basement water infiltration due to high groundwater tables and aging waterproofing systems.\n\nFoundation repair in NYC often involves underpinning for settlement issues, waterproofing for moisture control, and crack injection for structural repairs. The dense urban environment and building codes require specialized techniques and certified professionals. Costs vary significantly based on building type, accessibility, and the extent of structural work required." \
    '["Schedule inspections before and after winter freeze cycles", "Monitor basement humidity levels", "Address water infiltration immediately", "Check for settlement near subway construction zones"]'

# Los Angeles (9) 
insert_city_content 9 \
    "Sandy alluvial and clay deposits" \
    "Mediterranean semi-arid" \
    '["Seismic foundation damage", "Hillside settlement", "Clay soil expansion", "Lateral foundation movement"]' \
    6000 18000 \
    "Los Angeles foundations face unique challenges from seismic activity, expansive clay soils, and steep terrain construction. The Mediterranean climate with wet winters and dry summers causes clay soil expansion and contraction cycles. Earthquake damage is a primary concern, with many foundations requiring retrofitting for seismic safety.\n\nFoundation repairs in LA commonly involve seismic retrofitting, hillside stabilization, and underpinning for settlement issues. The city's building codes require specific seismic standards, and many older homes need foundation bolting and cripple wall bracing. Professional assessment is crucial given the earthquake risk and varied soil conditions throughout the metro area." \
    '["Prioritize seismic retrofitting for older homes", "Monitor for settlement on hillside properties", "Address drainage issues to prevent clay soil problems", "Consider earthquake insurance after foundation work"]'

echo "City content population completed!"