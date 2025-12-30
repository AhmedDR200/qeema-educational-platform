/**
 * Student Form Component
 * Used for creating and editing students
 */

import { useState, FormEvent } from 'react';
import { Button, Input, Alert, ImageUpload } from '../../components/ui';
import { Student, StudentFormData } from '../../types';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormData | Partial<StudentFormData>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
}

export default function StudentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    email: initialData?.user?.email || '',
    password: '',
    fullName: initialData?.fullName || '',
    className: initialData?.className || '',
    academicYear: initialData?.academicYear || '',
    phoneNumber: initialData?.phoneNumber || '',
    profileImageUrl: initialData?.profileImageUrl || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isEdit) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (formData.phoneNumber && !/^[+]?[\d\s-]*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      if (isEdit) {
        // Only send fields that can be updated
        await onSubmit({
          fullName: formData.fullName,
          className: formData.className,
          academicYear: formData.academicYear,
          phoneNumber: formData.phoneNumber,
          profileImageUrl: formData.profileImageUrl,
        });
      } else {
        await onSubmit(formData);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChange = (field: keyof StudentFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <Alert variant="error" onDismiss={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <ImageUpload
        label="Profile Image"
        value={formData.profileImageUrl}
        onChange={handleImageChange}
        placeholder="Upload profile photo"
      />

      {!isEdit && (
        <>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="student@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            placeholder="Create a strong password"
            helperText="At least 8 characters with uppercase, lowercase, and number"
            required
          />
        </>
      )}

      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        error={errors.fullName}
        placeholder="John Doe"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Class"
          value={formData.className}
          onChange={handleChange('className')}
          placeholder="e.g., Grade 10-A"
        />

        <Input
          label="Academic Year"
          value={formData.academicYear}
          onChange={handleChange('academicYear')}
          placeholder="e.g., 2025-2026"
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange('phoneNumber')}
        error={errors.phoneNumber}
        placeholder="+20 123 456 7890"
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
          {isEdit ? 'Save Changes' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}
