/**
 * Students Management Page
 * CRUD operations for students
 */

import { useState, useEffect, useCallback } from 'react';
import { studentsApi } from '../../api/endpoints/students';
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
import { Student, StudentFormData } from '../../types';
import StudentForm from './StudentForm';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await studentsApi.getStudents({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
      });

      setStudents(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleCreate = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await studentsApi.createStudent(data);
      setSuccess('Student created successfully');
      setIsCreateModalOpen(false);
      fetchStudents();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: Partial<StudentFormData>) => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await studentsApi.updateStudent(selectedStudent.id, data);
      setSuccess('Student updated successfully');
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await studentsApi.deleteStudent(selectedStudent.id);
      setSuccess('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Name',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
            {student.profileImageUrl ? (
              <img
                src={student.profileImageUrl}
                alt={student.fullName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-sm font-semibold text-primary-600">
                {student.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-secondary-900">{student.fullName}</p>
            <p className="text-xs text-secondary-500">{student.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Class',
      render: (student: Student) => (
        <span className="text-secondary-600">
          {student.className || <span className="text-secondary-400">—</span>}
        </span>
      ),
    },
    {
      key: 'academicYear',
      header: 'Academic Year',
      render: (student: Student) => (
        student.academicYear ? (
          <Badge variant="primary">{student.academicYear}</Badge>
        ) : (
          <span className="text-secondary-400">—</span>
        )
      ),
    },
    {
      key: 'phoneNumber',
      header: 'Phone',
      render: (student: Student) => (
        <span className="text-secondary-600">
          {student.phoneNumber || <span className="text-secondary-400">—</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(student);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(student);
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
          <h1 className="text-2xl font-bold text-secondary-900">Students</h1>
          <p className="text-secondary-500">Manage student accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Student
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
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={students}
        keyExtractor={(student) => student.id}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `No students match "${searchQuery}"`
            : 'No students found. Add your first student!'
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
          Showing {students.length} of {meta.total} students
        </p>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Student"
        size="lg"
      >
        <StudentForm
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
          setSelectedStudent(null);
        }}
        title="Edit Student"
        size="lg"
      >
        {selectedStudent && (
          <StudentForm
            initialData={selectedStudent}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedStudent(null);
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
          setSelectedStudent(null);
        }}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedStudent?.fullName}"? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete"
        isLoading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}

