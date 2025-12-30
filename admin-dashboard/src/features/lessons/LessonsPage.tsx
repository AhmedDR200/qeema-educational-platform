/**
 * Lessons Management Page
 * CRUD operations for lessons
 */

import { useState, useEffect, useCallback } from 'react';
import { lessonsApi } from '../../api/endpoints/lessons';
import { useDebounce } from '../../hooks/useDebounce';
import {
  Button,
  Input,
  Table,
  Pagination,
  Alert,
  Modal,
  ConfirmModal,
  Badge,
} from '../../components/ui';
import { Lesson, LessonFormData } from '../../types';
import LessonForm from './LessonForm';

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
  const [success, setSuccess] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await lessonsApi.getLessons({
        page: currentPage,
        limit: 10,
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

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleCreate = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
      await lessonsApi.createLesson(data);
      setSuccess('Lesson created successfully');
      setIsCreateModalOpen(false);
      fetchLessons();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: Partial<LessonFormData>) => {
    if (!selectedLesson) return;
    setIsSubmitting(true);
    try {
      await lessonsApi.updateLesson(selectedLesson.id, data);
      setSuccess('Lesson updated successfully');
      setIsEditModalOpen(false);
      setSelectedLesson(null);
      fetchLessons();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLesson) return;
    setIsSubmitting(true);
    try {
      await lessonsApi.deleteLesson(selectedLesson.id);
      setSuccess('Lesson deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedLesson(null);
      fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <Badge variant="success">{rating.toFixed(1)}</Badge>;
    if (rating >= 3) return <Badge variant="warning">{rating.toFixed(1)}</Badge>;
    return <Badge variant="default">{rating.toFixed(1)}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      header: 'Lesson',
      render: (lesson: Lesson) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {lesson.imageUrl ? (
              <img
                src={lesson.imageUrl}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-primary-600">
                {lesson.title.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-secondary-900 truncate">
              {lesson.title}
            </p>
            <p className="text-xs text-secondary-500 truncate max-w-[300px]">
              {lesson.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (lesson: Lesson) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
              style={{ width: `${(lesson.rating / 5) * 100}%` }}
            />
          </div>
          {getRatingBadge(lesson.rating)}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (lesson: Lesson) => (
        <span className="text-secondary-600">
          {new Date(lesson.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (lesson: Lesson) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(lesson);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(lesson);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Lessons</h1>
          <p className="text-secondary-500">Manage educational content</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Lesson
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error" className="mb-6" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-6" onDismiss={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          type="search"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={lessons}
        keyExtractor={(lesson) => lesson.id}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `No lessons match "${searchQuery}"`
            : 'No lessons found. Add your first lesson!'
        }
      />

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {meta && (
        <p className="text-center text-sm text-secondary-500 mt-4">
          Showing {lessons.length} of {meta.total} lessons
        </p>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Lesson"
        size="lg"
      >
        <LessonForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLesson(null);
        }}
        title="Edit Lesson"
        size="lg"
      >
        {selectedLesson && (
          <LessonForm
            initialData={selectedLesson}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedLesson(null);
            }}
            isLoading={isSubmitting}
            isEdit
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLesson(null);
        }}
        onConfirm={handleDelete}
        title="Delete Lesson"
        message={`Are you sure you want to delete "${selectedLesson?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}

