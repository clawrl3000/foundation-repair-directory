'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

export interface MapBusinessLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  slug: string;
  citySlug?: string;
}

interface DirectoryMapProps {
  businesses: MapBusinessLocation[];
  stateSlug: string;
  stateAbbr: string;
  citySlug?: string;
  selectedBusinessId?: string | null;
  onMarkerClick?: (businessId: string) => void;
  zoom?: number;
  className?: string;
}

export default function DirectoryMap({
  businesses,
  stateSlug,
  stateAbbr,
  citySlug,
  selectedBusinessId,
  onMarkerClick,
  zoom,
  className = 'w-full h-full',
}: DirectoryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const validBusinesses = useMemo(() => {
    const geoValid = businesses.filter(
      (b) => b.latitude && b.longitude && !isNaN(b.latitude) && !isNaN(b.longitude)
    );
    if (geoValid.length <= 1) return geoValid;
    const lats = geoValid.map((b) => b.latitude).sort((a, b) => a - b);
    const lngs = geoValid.map((b) => b.longitude).sort((a, b) => a - b);
    const medLat = lats[Math.floor(lats.length / 2)];
    const medLng = lngs[Math.floor(lngs.length / 2)];
    const filtered = geoValid.filter(
      (b) => Math.abs(b.latitude - medLat) < 5 && Math.abs(b.longitude - medLng) < 5
    );
    return filtered.length > 0 ? filtered : geoValid;
  }, [businesses]);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps?.LatLngBounds) {
      setIsLoaded(true);
      return;
    }
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      const check = () => {
        if (window.google?.maps?.LatLngBounds) setIsLoaded(true);
        else setTimeout(check, 100);
      };
      check();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const check = () => {
        if (window.google?.maps?.LatLngBounds) setIsLoaded(true);
        else setTimeout(check, 100);
      };
      check();
    };
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || validBusinesses.length === 0 || initializedRef.current) return;
    initializedRef.current = true;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      validBusinesses.forEach((b) => bounds.extend({ lat: b.latitude, lng: b.longitude }));

      const center = bounds.getCenter();
      const defaultZoom = zoom ?? (citySlug ? 12 : 7);

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: defaultZoom,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        styles: [{ featureType: 'poi.business', stylers: [{ visibility: 'off' }] }],
      });

      const sharedInfoWindow = new window.google.maps.InfoWindow();
      infoWindowRef.current = sharedInfoWindow;

      if (validBusinesses.length > 1) {
        mapInstance.fitBounds(bounds);
        const maxZoom = citySlug ? 15 : 10;
        const listener = window.google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          if (mapInstance.getZoom()! > maxZoom) mapInstance.setZoom(maxZoom);
          window.google.maps.event.removeListener(listener);
        });
      }

      // Create markers
      validBusinesses.forEach((business) => {
        const marker = new window.google.maps.Marker({
          position: { lat: business.latitude, lng: business.longitude },
          map: mapInstance,
          title: business.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        markersRef.current.set(business.id, marker);

        const bCitySlug = business.citySlug || citySlug || '';
        const detailUrl = `/${stateSlug}/${bCitySlug}/${business.slug}`;

        marker.addListener('click', () => {
          sharedInfoWindow.setContent(`
            <div style="padding: 8px; max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${business.name}</h3>
              ${business.address ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">📍 ${business.address}</p>` : ''}
              ${business.phone ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">📞 <a href="tel:${business.phone}" style="color: #2563eb; text-decoration: none;">${business.phone}</a></p>` : ''}
              <a href="${detailUrl}"
                 style="display: inline-block; background: #f59e0b; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">
                View Details
              </a>
            </div>
          `);
          sharedInfoWindow.open(mapInstance, marker);
          onMarkerClick?.(business.id);
        });
      });

      mapInstanceRef.current = mapInstance;
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [isLoaded, validBusinesses, citySlug, stateSlug, stateAbbr, zoom, onMarkerClick]);

  // Pan to selected business
  const panToBusiness = useCallback(
    (businessId: string) => {
      const map = mapInstanceRef.current;
      const marker = markersRef.current.get(businessId);
      if (!map || !marker) return;
      const pos = marker.getPosition();
      if (!pos) return;
      map.panTo(pos);
      map.setZoom(15);
      const business = validBusinesses.find((b) => b.id === businessId);
      if (business && infoWindowRef.current) {
        const bCitySlug = business.citySlug || citySlug || '';
        infoWindowRef.current.setContent(`
          <div style="padding: 8px; max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${business.name}</h3>
            ${business.address ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">📍 ${business.address}</p>` : ''}
            ${business.phone ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">📞 <a href="tel:${business.phone}" style="color: #2563eb; text-decoration: none;">${business.phone}</a></p>` : ''}
            <a href="/${stateSlug}/${bCitySlug}/${business.slug}"
               style="display: inline-block; background: #f59e0b; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">
              View Details
            </a>
          </div>
        `);
        infoWindowRef.current.open(map, marker);
      }
    },
    [validBusinesses, citySlug, stateSlug]
  );

  // Expose panToBusiness on the DOM element for parent components
  useEffect(() => {
    if (mapRef.current) {
      (mapRef.current as any).panToBusiness = panToBusiness;
    }
  }, [panToBusiness]);

  // Handle selectedBusinessId changes
  useEffect(() => {
    if (selectedBusinessId) {
      panToBusiness(selectedBusinessId);
    }
  }, [selectedBusinessId, panToBusiness]);

  if (validBusinesses.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100`}>
        <div className="text-center text-slate-500">
          <span className="material-symbols-outlined text-4xl mb-2 block">map</span>
          <p className="text-sm">No locations to display</p>
        </div>
      </div>
    );
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

  return <div ref={mapRef} className={`${className} bg-slate-100`} />;
}
