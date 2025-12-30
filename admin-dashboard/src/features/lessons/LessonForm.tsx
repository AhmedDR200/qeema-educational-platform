/**
 * Lesson Form Component
 * Used for creating and editing lessons
 */

import { useState, FormEvent } from 'react';
import { Button, Input, Textarea, Alert, ImageUpload } from '../../components/ui';
import { Lesson, LessonFormData } from '../../types';

interface LessonFormProps {
  initialData?: Lesson;
  onSubmit: (data: LessonFormData | Partial<LessonFormData>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export default function LessonForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: LessonFormProps) {
  const [formData, setFormData] = useState<Omit<LessonFormData, 'rating'>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChange = (field: keyof Omit<LessonFormData, 'rating'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <Alert variant="error" onDismiss={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <ImageUpload
        label="Lesson Image"
        value={formData.imageUrl}
        onChange={handleImageChange}
        placeholder="Upload lesson cover image"
      />

      <Input
        label="Title"
        value={formData.title}
        onChange={handleChange('title')}
        error={errors.title}
        placeholder="e.g., Introduction to Mathematics"
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={handleChange('description')}
        error={errors.description}
        placeholder="Describe what students will learn in this lesson..."
        rows={4}
        required
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Save Changes' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
}
