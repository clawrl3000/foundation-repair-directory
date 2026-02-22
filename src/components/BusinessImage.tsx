'use client'

import { useState } from 'react'

interface BusinessImageProps {
  businessId: string
  businessName: string
  latitude?: number | null
  longitude?: number | null
  photoReference?: string
  alt?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  isPlaceholder?: boolean
}

const sizeMap = {
  small: 200,
  medium: 400,
  large: 600,
}

export default function BusinessImage({
  businessId,
  businessName,
  latitude,
  longitude,
  photoReference,
  alt,
  className = '',
  size = 'medium',
  isPlaceholder = false
}: BusinessImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isGoogleImage, setIsGoogleImage] = useState(!!photoReference)
  
  // If we have a photo reference, use Google Places photo
  if (photoReference && !imageError) {
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${sizeMap[size]}&photoreference=${photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    
    return (
      <div className={`relative ${className}`}>
        <img
          src={googlePhotoUrl}
          alt={alt || `${businessName} photo`}
          className="w-full h-full object-cover"
          onError={() => {
            setImageError(true)
            setIsGoogleImage(false)
          }}
          loading="lazy"
        />
        <GoogleAttribution />
      </div>
    )
  }
  
  // If we have coordinates but no photo, try Street View
  if (latitude && longitude && !isPlaceholder && !imageError) {
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=${sizeMap[size]}x${Math.floor(sizeMap[size] * 0.75)}&location=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    
    return (
      <div className={`relative ${className}`}>
        <img
          src={streetViewUrl}
          alt={alt || `Street view of ${businessName} location`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <GoogleAttribution />
      </div>
    )
  }
  
  // Fallback to placeholder
  return (
    <div className={`${className} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
      <span className="material-symbols-outlined text-4xl text-slate-400" role="img" aria-label="Foundation repair company">foundation</span>
    </div>
  )
}

// Google attribution component (required for Google imagery)
function GoogleAttribution() {
  return (
    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded text-slate-600">
      Powered by Google
    </div>
  )
}

// Server-side component for getting business images
export async function getBusinessImages(businessId: string) {
  // This would be called on the server to get business images from Supabase
  // For now, return empty array as this will be implemented in the page components
  return []
}