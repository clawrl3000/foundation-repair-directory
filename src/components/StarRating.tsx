interface StarRatingProps {
  rating: number
  reviewCount?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ rating, reviewCount, showCount = true, size = 'md' }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  const starSize = {
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-xl'
  }[size]
  
  const textSize = {
    'sm': 'text-xs',
    'md': 'text-sm',
    'lg': 'text-base'
  }[size]

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-accent">
        {/* Filled stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className={`material-symbols-outlined ${starSize} fill-1`}>
            star
          </span>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <span className={`material-symbols-outlined ${starSize}`}>
            star_half
          </span>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className={`material-symbols-outlined ${starSize}`}>
            star
          </span>
        ))}
      </div>
      
      {showCount && reviewCount !== undefined && (
        <span className={`font-semibold text-slate-400 ${textSize}`}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  )
}