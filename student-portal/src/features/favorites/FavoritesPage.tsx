/**
 * Favorites Page
 * Displays student's favorited lessons
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../../api/endpoints/favorites';
import { Card, Spinner, EmptyState, Alert, Button, Badge } from '../../components/ui';
import { Favorite } from '../../types';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await favoritesApi.getFavorites();
      setFavorites(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (favoriteId: string, lessonId: string) => {
    // Optimistic removal
    setRemovingIds((prev) => new Set(prev).add(favoriteId));
    
    try {
      await favoritesApi.removeFavorite(lessonId);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch {
      // On error, keep the item and show error
      setError('Failed to remove from favorites');
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(favoriteId);
        return newSet;
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Favorites</h1>
        <p className="text-secondary-500">
          Lessons you've saved for quick access
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="error" className="mb-6" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No favorites yet"
          description="Start exploring lessons and save your favorites for easy access."
          action={{
            label: 'Browse Lessons',
            onClick: () => navigate('/lessons'),
          }}
        />
      ) : (
        /* Favorites List */
        <div className="space-y-4">
          {favorites.map((favorite, index) => {
            const lesson = favorite.lesson;
            const isRemoving = removingIds.has(favorite.id);
            const ratingPercentage = (lesson.rating / 5) * 100;

            return (
              <Card
                key={favorite.id}
                padding="none"
                className={`
                  overflow-hidden animate-slide-up
                  ${isRemoving ? 'opacity-50 pointer-events-none' : ''}
                `}
                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-32 sm:h-auto bg-secondary-100 flex-shrink-0">
                    {lesson.imageUrl ? (
                      <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <span className="text-3xl font-bold text-primary-300">
                          {lesson.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-secondary-500 line-clamp-2 mb-3">
                          {lesson.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[200px]">
                            <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                style={{ width: `${ratingPercentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-secondary-600">
                            {lesson.rating.toFixed(1)}
                          </span>
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
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.id, lesson.id)}
                        disabled={isRemoving}
                        className="text-secondary-400 hover:text-red-500 flex-shrink-0"
                      >
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {!isLoading && favorites.length > 0 && (
        <p className="text-center text-sm text-secondary-500 mt-8">
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
        </p>
      )}
    </div>
  );
}

