/**
 * Lesson Card Component
 * Displays a lesson in card format with favorite toggle
 * NO ICONS - Uses text and styling for favorite indicator
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { Lesson } from '../../types';

interface LessonCardProps {
  lesson: Lesson;
  onToggleFavorite: (lessonId: string, isFavorited: boolean) => Promise<void>;
}

export default function LessonCard({ lesson, onToggleFavorite }: LessonCardProps) {
  const [isFavorited, setIsFavorited] = useState(lesson.isFavorited || false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;

    // Optimistic update
    setIsFavorited(!isFavorited);
    setIsToggling(true);

    try {
      await onToggleFavorite(lesson.id, !isFavorited);
    } catch {
      // Rollback on error
      setIsFavorited(isFavorited);
    } finally {
      setIsToggling(false);
    }
  };

  // Format rating as visual bar
  const ratingPercentage = (lesson.rating / 5) * 100;

  return (
    <Link to={`/lessons/${lesson.id}`} className="block">
      <Card padding="none" hover className="overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-video bg-secondary-100 overflow-hidden">
          {lesson.imageUrl ? (
            <img
              src={lesson.imageUrl}
              alt={lesson.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-4xl font-bold text-primary-300">
                {lesson.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Favorite button overlay */}
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`
              absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold
              transition-all duration-200 transform
              ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/90 text-secondary-600 hover:bg-rose-50 hover:text-rose-500'
              }
              ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-1">
            {lesson.title}
          </h3>

          <p className="text-sm text-secondary-500 mb-4 line-clamp-2">
            {lesson.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-secondary-500">Rating</span>
                <span className="text-xs font-semibold text-secondary-700">
                  {lesson.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${ratingPercentage}%` }}
                />
              </div>
            </div>
            <Badge variant={lesson.rating >= 4 ? 'success' : lesson.rating >= 3 ? 'warning' : 'default'}>
              {lesson.rating >= 4 ? 'Excellent' : lesson.rating >= 3 ? 'Good' : 'Basic'}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}

