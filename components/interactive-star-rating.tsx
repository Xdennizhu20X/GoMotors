'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveStarRatingProps {
  onRatingChange: (rating: number) => void;
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InteractiveStarRating = ({
  onRatingChange,
  initialRating = 0,
  size = 'md',
  className = ''
}: InteractiveStarRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoveredRating || selectedRating);
        return (
          <motion.button
            key={star}
            type="button"
            className={`${sizeClasses[size]} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1341ee] focus:ring-offset-2 rounded`}
            onMouseEnter={() => handleStarHover(star)}
            onClick={() => handleStarClick(star)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className={`w-full h-full transition-colors duration-200 ${
                isFilled
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              } ${hoveredRating >= star ? 'drop-shadow-sm' : ''}`}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
};