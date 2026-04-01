import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 14,
}: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-trillz-yellow text-trillz-yellow" />
      <span className="text-trillz-yellow font-semibold text-sm">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
