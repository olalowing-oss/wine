import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showLabel = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const displayRating = hoverRating || rating

  const handleClick = (value: number) => {
    if (!readonly) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating
          const isHalf = !isFilled && value - 0.5 <= displayRating

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`transition-all ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                    ? 'fill-yellow-200 text-yellow-400'
                    : 'fill-none text-gray-300'
                } transition-colors`}
              />
            </button>
          )
        })}
      </div>
      {showLabel && rating > 0 && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
      {!readonly && hoverRating > 0 && (
        <span className="text-sm text-gray-500">
          {hoverRating}/5
        </span>
      )}
    </div>
  )
}
