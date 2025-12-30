/**
 * Lessons Page
 * Displays paginated list of lessons with search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { lessonsApi } from '../../api/endpoints/lessons';
import { favoritesApi } from '../../api/endpoints/favorites';
import { useDebounce } from '../../hooks/useDebounce';
import { Input, Spinner, EmptyState, Pagination, Alert } from '../../components/ui';
import LessonCard from './LessonCard';
import { Lesson } from '../../types';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await lessonsApi.getLessons({
        page: currentPage,
        limit: 9,
        search: debouncedSearch || undefined,
      });

      setLessons(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  // Fetch lessons when page or search changes
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleToggleFavorite = async (lessonId: string, shouldFavorite: boolean) => {
    if (shouldFavorite) {
      await favoritesApi.addFavorite(lessonId);
    } else {
      await favoritesApi.removeFavorite(lessonId);
    }

    // Update local state
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, isFavorited: shouldFavorite }
          : lesson
      )
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Lessons</h1>
        <p className="text-secondary-500">
          Explore our collection of educational content
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <Input
          type="search"
          placeholder="Search lessons by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white"
        />
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
      ) : lessons.length === 0 ? (
        /* Empty State */
        <EmptyState
          title={searchQuery ? 'No lessons found' : 'No lessons available'}
          description={
            searchQuery
              ? `No lessons match "${searchQuery}". Try a different search term.`
              : 'Check back later for new educational content.'
          }
          action={
            searchQuery
              ? { label: 'Clear Search', onClick: () => setSearchQuery('') }
              : undefined
          }
        />
      ) : (
        /* Lessons Grid */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <LessonCard
                  lesson={lesson}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Results summary */}
          {meta && (
            <p className="text-center text-sm text-secondary-500 mt-4">
              Showing {lessons.length} of {meta.total} lessons
            </p>
          )}
        </>
      )}
    </div>
  );
}

