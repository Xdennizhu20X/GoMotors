import * as React from "react";
import { StarIcon } from "./icons";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, className = "" }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-4 h-4 me-1 ${index < roundedRating ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"}`}
        />
      ))}
      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{rating.toFixed(2)}</p>
    </div>
  );
};
