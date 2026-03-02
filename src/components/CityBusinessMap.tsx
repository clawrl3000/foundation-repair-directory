'use client';

import { useEffect, useRef, useState } from 'react';

interface BusinessLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  slug: string;
}

interface CityBusinessMapProps {
  businesses: BusinessLocation[];
  cityName: string;
  stateAbbr: string;
  className?: string;
}

export default function CityBusinessMap({ 
  businesses, 
  cityName, 
  stateAbbr,
  className = "w-full h-96 rounded-lg border border-slate-200"
}: CityBusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter businesses with valid coordinates, then remove geographic outliers
  const geoValidBusinesses = businesses.filter(
    business => business.latitude && business.longitude && 
    !isNaN(business.latitude) && !isNaN(business.longitude)
  );

  // Remove outliers: if a business is >2 degrees (~140mi) from the median, drop it
  const validBusinesses = (() => {
    if (geoValidBusinesses.length <= 1) return geoValidBusinesses;
    const lats = geoValidBusinesses.map(b => b.latitude).sort((a, b) => a - b);
    const lngs = geoValidBusinesses.map(b => b.longitude).sort((a, b) => a - b);
    const medLat = lats[Math.floor(lats.length / 2)];
    const medLng = lngs[Math.floor(lngs.length / 2)];
    const filtered = geoValidBusinesses.filter(
      b => Math.abs(b.latitude - medLat) < 2 && Math.abs(b.longitude - medLng) < 2
    );
    return filtered.length > 0 ? filtered : geoValidBusinesses;
  })();

  useEffect(() => {
    // Load Google Maps API if not already loaded
    if (!window.google?.maps?.Map) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Poll until core classes are available (async loading can delay them)
        const check = () => {
          if (window.google?.maps?.LatLngBounds) {
            setIsLoaded(true);
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      };
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    // Catch Google Maps API errors (e.g. OverQuotaMapError) to prevent page freeze
    const handleGMapsError = (e: ErrorEvent) => {
      if (e.message && e.message.includes('Google Maps')) {
        setError('Map temporarily unavailable');
        e.preventDefault();
      }
    };
    window.addEventListener('error', handleGMapsError);
    return () => window.removeEventListener('error', handleGMapsError);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || validBusinesses.length === 0) return;

    try {
      // Calculate center point
      const centerLat = validBusinesses.reduce((sum, b) => sum + b.latitude, 0) / validBusinesses.length;
      const centerLng = validBusinesses.reduce((sum, b) => sum + b.longitude, 0) / validBusinesses.length;

      // Calculate bounds for appropriate zoom
      const bounds = new window.google.maps.LatLngBounds();
      validBusinesses.forEach(business => {
        bounds.extend({ lat: business.latitude, lng: business.longitude });
      });

      // Initialize map
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Fit map to bounds if multiple businesses
      if (validBusinesses.length > 1) {
        mapInstance.fitBounds(bounds);
        // Set maximum zoom to prevent over-zooming
        const listener = window.google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          if (mapInstance.getZoom()! > 15) {
            mapInstance.setZoom(15);
          }
          window.google.maps.event.removeListener(listener);
        });
      }

      // Add markers for each business
      validBusinesses.forEach((business) => {
        const marker = new window.google.maps.Marker({
          position: { lat: business.latitude, lng: business.longitude },
          map: mapInstance,
          title: business.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        // Info window content
        const infoWindowContent = `
          <div style="padding: 8px; max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">
              ${business.name}
            </h3>
            ${business.address ? `
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">
                📍 ${business.address}
              </p>
            ` : ''}
            ${business.phone ? `
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
                📞 <a href="tel:${business.phone}" style="color: #2563eb; text-decoration: none;">${business.phone}</a>
              </p>
            ` : ''}
            <a href="/${stateAbbr.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}/${business.slug}" 
               style="display: inline-block; background: #f59e0b; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">
              View Details
            </a>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });
      });

      setMap(mapInstance);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [isLoaded, validBusinesses, cityName, stateAbbr]);

  if (validBusinesses.length === 0) {
    return null; // Don't render map if no businesses have coordinates
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-50`}>
        <div className="text-center text-slate-500">
          <span className="material-symbols-outlined text-4xl mb-2 block">error</span>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-50`}>
        <div className="text-center text-slate-500">
          <span className="material-symbols-outlined text-4xl mb-2 block animate-spin">refresh</span>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
        {validBusinesses.length} location{validBusinesses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}