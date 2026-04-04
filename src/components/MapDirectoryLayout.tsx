'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BusinessImage from '@/components/BusinessImage';
import DirectoryMap, { type MapBusinessLocation } from '@/components/DirectoryMap';

interface BusinessListing {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  website_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  rating?: number;
  review_count: number;
  is_verified: boolean;
  year_established?: number;
  bbb_data?: { rating?: string; is_accredited?: boolean };
  services: { name: string; slug: string }[];
  features: { name: string; slug: string; value?: string }[];
  images?: { url: string; alt_text?: string; source?: string }[];
}

interface CityChip {
  name: string;
  slug: string;
  business_count: number;
}

interface MapDirectoryLayoutProps {
  businesses: BusinessListing[];
  cities: CityChip[];
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  currentCitySlug?: string;
  currentCityName?: string;
  heading: string;
  description: string;
}

// Feature badge priority order and display config
const FEATURE_PRIORITY: string[] = [
  'lifetime-warranty',
  'free-inspection',
  'licensed-insured',
  'financing-available',
  'bbb-accredited',
  'family-owned',
  'veteran-owned',
  'emergency-service',
  '24-7-available',
  'free-estimates',
  'transferable-warranty',
  '25-year-warranty',
  'locally-owned',
  'senior-discount',
  'military-discount',
  'residential',
  'commercial',
  'accepts-insurance',
];

const FEATURE_BADGE_MAP: Record<string, { icon: string; classes: string }> = {
  'free-inspection': { icon: '🔍', classes: 'bg-green-50 text-green-700 border-green-200' },
  'lifetime-warranty': { icon: '🛡️', classes: 'bg-green-50 text-green-700 border-green-200' },
  'transferable-warranty': { icon: '🔄', classes: 'bg-green-50 text-green-700 border-green-200' },
  '25-year-warranty': { icon: '🛡️', classes: 'bg-green-50 text-green-700 border-green-200' },
  'licensed-insured': { icon: '📋', classes: 'bg-green-50 text-green-700 border-green-200' },
  'financing-available': { icon: '💰', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'emergency-service': { icon: '🚨', classes: 'bg-red-50 text-red-700 border-red-200' },
  'free-estimates': { icon: '📝', classes: 'bg-green-50 text-green-700 border-green-200' },
  'residential': { icon: '🏠', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'commercial': { icon: '🏢', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'bbb-accredited': { icon: '⭐', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'veteran-owned': { icon: '🎖️', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'family-owned': { icon: '👨‍👩‍👧', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  '24-7-available': { icon: '🕐', classes: 'bg-red-50 text-red-700 border-red-200' },
  'accepts-insurance': { icon: '📄', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'locally-owned': { icon: '📍', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  'senior-discount': { icon: '🎁', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  'military-discount': { icon: '🎗️', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function getTopFeatures(features: { name: string; slug: string }[], max = 4) {
  return [...features]
    .sort((a, b) => {
      const ai = FEATURE_PRIORITY.indexOf(a.slug);
      const bi = FEATURE_PRIORITY.indexOf(b.slug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })
    .slice(0, max);
}

// Filter chips available on the city page
const FILTER_OPTIONS = [
  { slug: 'free-inspection', label: 'Free Inspection' },
  { slug: 'lifetime-warranty', label: 'Lifetime Warranty' },
  { slug: 'financing-available', label: 'Financing' },
  { slug: 'emergency-service', label: 'Emergency Service' },
  { slug: 'licensed-insured', label: 'Licensed & Insured' },
  { slug: 'free-estimates', label: 'Free Estimates' },
];

export default function MapDirectoryLayout({
  businesses,
  cities,
  stateSlug,
  stateName,
  stateAbbr,
  currentCitySlug,
  currentCityName,
  heading,
  description,
}: MapDirectoryLayoutProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const listingsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Feature filtering from URL params
  const activeFilters = useMemo(() => {
    const param = searchParams.get('feature');
    return param ? param.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const filteredBusinesses = useMemo(() => {
    if (activeFilters.length === 0) return businesses;
    return businesses.filter((b) =>
      activeFilters.every((f) => b.features.some((bf) => bf.slug === f))
    );
  }, [businesses, activeFilters]);

  const toggleFilter = (slug: string) => {
    const next = activeFilters.includes(slug)
      ? activeFilters.filter((f) => f !== slug)
      : [...activeFilters, slug];
    const url = new URL(window.location.href);
    if (next.length > 0) {
      url.searchParams.set('feature', next.join(','));
    } else {
      url.searchParams.delete('feature');
    }
    window.history.pushState({}, '', url.toString());
    // Force re-render by dispatching popstate
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Map businesses for the DirectoryMap component
  const mapBusinesses: MapBusinessLocation[] = filteredBusinesses
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      name: b.name,
      latitude: b.latitude!,
      longitude: b.longitude!,
      address: b.address,
      phone: b.phone,
      slug: b.slug,
      citySlug: currentCitySlug,
    }));

  // Quick stats
  const totalBusinesses = filteredBusinesses.length;
  const avgRating = filteredBusinesses.filter((b) => b.rating).length > 0
    ? (filteredBusinesses.reduce((sum, b) => sum + (b.rating || 0), 0) / filteredBusinesses.filter((b) => b.rating).length).toFixed(1)
    : null;
  const totalReviews = filteredBusinesses.reduce((sum, b) => sum + b.review_count, 0);

  const visibleCities = showAllCities ? cities : cities.slice(0, 8);
  const hasMoreCities = cities.length > 8;

  const handleMarkerClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    // Scroll listing into view
    const el = document.getElementById(`listing-${businessId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Left Panel: Listings */}
      <div className="w-full lg:w-[55%] overflow-y-auto" ref={listingsRef}>
        <div className="px-6 lg:px-8 py-6">
          {/* Heading */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {heading}
          </h1>
          <p className="text-slate-500 text-sm mb-6">{description}</p>

          {/* Quick Stats */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-sm">
              <span className="material-symbols-outlined text-base text-amber-600">construction</span>
              <span className="font-semibold text-slate-800">{totalBusinesses}</span>
              <span className="text-slate-500">contractor{totalBusinesses !== 1 ? 's' : ''}</span>
            </div>
            {avgRating && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-sm">
                <span className="material-symbols-outlined text-base text-amber-500 fill-1">star</span>
                <span className="font-semibold text-slate-800">{avgRating}</span>
                <span className="text-slate-500">avg</span>
              </div>
            )}
            {totalReviews > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-sm">
                <span className="material-symbols-outlined text-base text-blue-500">rate_review</span>
                <span className="font-semibold text-slate-800">{totalReviews.toLocaleString()}</span>
                <span className="text-slate-500">reviews</span>
              </div>
            )}
          </div>

          {/* City Chips */}
          {cities.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${stateSlug}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    !currentCitySlug
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400 hover:text-amber-600'
                  }`}
                >
                  All {stateName}
                </Link>
                {visibleCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${stateSlug}/${city.slug}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      currentCitySlug === city.slug
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400 hover:text-amber-600'
                    }`}
                  >
                    {city.name}
                    <span className="ml-1 text-xs opacity-70">({city.business_count})</span>
                  </Link>
                ))}
                {hasMoreCities && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {showAllCities ? 'Show less' : `+${cities.length - 8} more`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feature Filter Chips */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filter by feature</p>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((opt) => {
                const active = activeFilters.includes(opt.slug);
                const badge = FEATURE_BADGE_MAP[opt.slug];
                return (
                  <button
                    key={opt.slug}
                    onClick={() => toggleFilter(opt.slug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400 hover:text-amber-600'
                    }`}
                  >
                    {badge && <span>{badge.icon}</span>}
                    {opt.label}
                    {active && <span className="ml-0.5">×</span>}
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('feature');
                    window.history.pushState({}, '', url.toString());
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
            {activeFilters.length > 0 && (
              <p className="text-xs text-slate-400 mt-2">
                Showing {filteredBusinesses.length} of {businesses.length} contractor{businesses.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Mobile Map (visible only on mobile) */}
          {mapBusinesses.length > 0 && (
            <div className="lg:hidden mb-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <DirectoryMap
                businesses={mapBusinesses}
                stateSlug={stateSlug}
                stateAbbr={stateAbbr}
                citySlug={currentCitySlug}
                selectedBusinessId={selectedBusinessId}
                onMarkerClick={handleMarkerClick}
                className="w-full h-[350px]"
              />
            </div>
          )}

          {/* Business Cards */}
          {filteredBusinesses.length > 0 ? (
            <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  id={`listing-${business.id}`}
                  onClick={() => handleCardClick(business.id)}
                  className={`bg-white border rounded-xl shadow-sm group flex flex-col sm:flex-row overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                    selectedBusinessId === business.id
                      ? 'border-amber-400 ring-2 ring-amber-200'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {/* Image */}
                  <Link
                    href={`/${stateSlug}/${currentCitySlug || ''}/${business.slug}`}
                    className="relative h-40 sm:h-auto sm:w-36 flex-shrink-0 overflow-hidden block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BusinessImage
                      businessId={business.id}
                      businessName={business.name}
                      latitude={business.latitude}
                      longitude={business.longitude}
                      photoReference={
                        business.images?.[0]?.source === 'google_places'
                          ? business.images[0].url
                          : undefined
                      }
                      alt={business.images?.[0]?.alt_text || `${business.name} photo`}
                      className="h-full w-full"
                      size="medium"
                    />
                    {business.is_verified && (
                      <div className="absolute top-2 right-2 rounded-full bg-green-100 backdrop-blur px-2 py-0.5 text-[10px] font-black uppercase text-green-700 border border-green-300">
                        Verified
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between mb-1">
                      <Link
                        href={`/${stateSlug}/${currentCitySlug || ''}/${business.slug}`}
                        className="block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {business.name}
                        </h3>
                      </Link>
                      {business.year_established && (
                        <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                          Est. {business.year_established}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 text-xs mb-1">
                      {business.address ? `${business.address}, ` : ''}
                      {currentCityName || ''} {stateAbbr}
                    </p>

                    {business.rating && business.review_count > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-xs ${
                                i < Math.round(business.rating!) ? 'fill-1' : ''
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-slate-500 text-xs">
                          {business.rating} ({business.review_count})
                        </span>
                      </div>
                    )}

                    {business.description && (
                      <p className="text-slate-600 text-xs leading-relaxed mb-2 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {business.services.slice(0, 2).map((s) => (
                        <span
                          key={s.slug}
                          className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] rounded-full border border-amber-200"
                        >
                          {s.name}
                        </span>
                      ))}
                      {business.bbb_data?.rating && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded-full border border-blue-200 font-semibold">
                          BBB {business.bbb_data.rating}
                        </span>
                      )}
                    </div>

                    {/* Feature Badges */}
                    {business.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getTopFeatures(business.features, 4).map((f) => {
                          const badge = FEATURE_BADGE_MAP[f.slug] || { icon: '✅', classes: 'bg-green-50 text-green-700 border-green-200' };
                          return (
                            <span
                              key={f.slug}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded border ${badge.classes}`}
                            >
                              <span className="text-[10px]">{badge.icon}</span>
                              {f.name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions */}
                    <div
                      className="mt-auto flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={`/${stateSlug}/${currentCitySlug || ''}/${business.slug}#get-estimate`}
                        className="flex-1 text-center rounded-lg bg-amber-500 py-2 px-4 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
                      >
                        Get Estimate
                      </a>
                      {business.phone && (
                        <a
                          href={`tel:${business.phone}`}
                          className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          title="Call"
                        >
                          <span className="material-symbols-outlined text-base">phone</span>
                        </a>
                      )}
                      <Link
                        href={`/${stateSlug}/${currentCitySlug || ''}/${business.slug}`}
                        className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-400 mb-4 block">search_off</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Contractors Found</h3>
              <p className="text-slate-500 text-sm mb-6">
                {currentCitySlug
                  ? `No foundation repair contractors listed in ${currentCityName} yet.`
                  : `No foundation repair contractors listed in ${stateName} yet.`}
              </p>
              <Link
                href="/states"
                className="rounded-lg bg-amber-500 py-3 px-6 text-white font-bold hover:bg-amber-600 transition-colors"
              >
                Browse All States
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map (desktop only) */}
      {mapBusinesses.length > 0 && (
        <div className="hidden lg:block lg:w-[45%] lg:fixed lg:right-0 lg:top-[64px] lg:bottom-0">
          <DirectoryMap
            businesses={mapBusinesses}
            stateSlug={stateSlug}
            stateAbbr={stateAbbr}
            citySlug={currentCitySlug}
            selectedBusinessId={selectedBusinessId}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
