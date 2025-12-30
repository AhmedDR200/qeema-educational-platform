/**
 * Lesson Detail Page
 * Displays full details of a single lesson with rating functionality
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonsApi } from '../../api/endpoints/lessons';
import { favoritesApi } from '../../api/endpoints/favorites';
import { Card, Button, Badge, Spinner, Alert } from '../../components/ui';
import { LessonWithRating } from '../../types';

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonWithRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  // Rating state
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;

      setIsLoading(true);
      setError('');

      try {
        const response = await lessonsApi.getLessonById(id);
        setLesson(response.data);
        setIsFavorited(response.data.isFavorited || false);
        setUserRating(response.data.userRating || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (isToggling || !lesson) return;

    // Optimistic update
    setIsFavorited(!isFavorited);
    setIsToggling(true);

    try {
      if (!isFavorited) {
        await favoritesApi.addFavorite(lesson.id);
      } else {
        await favoritesApi.removeFavorite(lesson.id);
      }
    } catch {
      // Rollback on error
      setIsFavorited(isFavorited);
    } finally {
      setIsToggling(false);
    }
  };

  const handleRate = async (value: number) => {
    if (isRating || !lesson) return;

    setIsRating(true);
    setRatingSuccess('');

    try {
      const response = await lessonsApi.rateLesson(lesson.id, value);
      setUserRating(response.data.userRating);
      setLesson({
        ...lesson,
        rating: response.data.averageRating,
        totalRatings: response.data.totalRatings,
      });
      setRatingSuccess('Rating submitted!');
      setTimeout(() => setRatingSuccess(''), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsRating(false);
    }
  };

  // Format rating percentage
  const ratingPercentage = lesson ? (lesson.rating / 5) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <Alert variant="error" className="mb-6">
          {error || 'Lesson not found'}
        </Alert>
        <Button onClick={() => navigate('/lessons')}>Back to Lessons</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/lessons')}
        className="mb-6 text-secondary-600 hover:text-primary-600 font-medium transition-colors"
      >
        ← Back to Lessons
      </button>

      <Card padding="none" className="overflow-hidden">
        {/* Hero Image */}
        <div className="relative bg-secondary-100 overflow-hidden flex items-center justify-center" style={{ maxHeight: '400px' }}>
          {lesson.imageUrl ? (
            <img
              src={lesson.imageUrl}
              alt={lesson.title}
              className="w-full h-auto max-h-[400px] object-contain"
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-8xl font-bold text-primary-300">
                {lesson.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Favorite Badge */}
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`
              absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold
              transition-all duration-200 transform
              ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/90 text-secondary-600 hover:bg-rose-50 hover:text-rose-500'
              }
              ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            {lesson.title}
          </h1>

          {/* Rating Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-secondary-100">
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-500">
                  Average Rating
                </span>
                <span className="text-lg font-bold text-secondary-900">
                  {lesson.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="h-3 bg-secondary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${ratingPercentage}%` }}
                />
              </div>
              {lesson.totalRatings !== undefined && (
                <p className="text-xs text-secondary-400 mt-1">
                  {lesson.totalRatings} {lesson.totalRatings === 1 ? 'rating' : 'ratings'}
                </p>
              )}
            </div>
            <Badge
              variant={
                lesson.rating >= 4
                  ? 'success'
                  : lesson.rating >= 3
                  ? 'warning'
                  : 'default'
              }
            >
              {lesson.rating >= 4
                ? 'Excellent'
                : lesson.rating >= 3
                ? 'Good'
                : 'Basic'}
            </Badge>
          </div>

          {/* Rate This Lesson */}
          <div className="mb-6 pb-6 border-b border-secondary-100">
            <h2 className="text-lg font-semibold text-secondary-900 mb-3">
              Rate this Lesson
            </h2>
            <div className="flex items-center gap-4">
              <div 
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || userRating || 0) >= star;
                  return (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      disabled={isRating}
                      className={`
                        w-10 h-10 rounded-lg font-bold text-lg transition-all duration-200
                        ${isActive
                          ? 'bg-amber-400 text-white shadow-md'
                          : 'bg-secondary-100 text-secondary-400 hover:bg-amber-100 hover:text-amber-500'
                        }
                        ${isRating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                      `}
                    >
                      {star}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                {userRating && (
                  <span className="text-sm text-secondary-600">
                    Your rating: <span className="font-semibold text-amber-600">{userRating}/5</span>
                  </span>
                )}
                {ratingSuccess && (
                  <span className="text-sm text-green-600 font-medium animate-fade-in">
                    {ratingSuccess}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-secondary-900 mb-3">
              About this Lesson
            </h2>
            <p className="text-secondary-600 leading-relaxed whitespace-pre-wrap">
              {lesson.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-secondary-500 pt-6 border-t border-secondary-100">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(lesson.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{' '}
              {new Date(lesson.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
