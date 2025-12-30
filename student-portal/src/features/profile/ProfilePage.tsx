/**
 * Profile Page
 * Displays and allows editing of student profile
 */

import { useEffect, useState } from 'react';
import { studentsApi } from '../../api/endpoints/students';
import { Alert, Button, Card, ImageUpload, Input, Spinner } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { ProfileFormData, Student } from '../../types';

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    className: '',
    academicYear: '',
    phoneNumber: '',
    profileImageUrl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await studentsApi.getMyProfile();
        setStudent(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          className: response.data.className || '',
          academicYear: response.data.academicYear || '',
          phoneNumber: response.data.phoneNumber || '',
          profileImageUrl: response.data.profileImageUrl || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (formData.phoneNumber && !/^[+]?[\d\s-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!validateForm() || !student) return;

    setIsSaving(true);

    try {
      const response = await studentsApi.updateProfile(student.id, formData);
      setStudent(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully');

      // Update auth context with new info
      if (user) {
        updateUser({
          ...user,
          student: {
            id: response.data.id,
            fullName: response.data.fullName,
            profileImageUrl: response.data.profileImageUrl,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        className: student.className || '',
        academicYear: student.academicYear || '',
        phoneNumber: student.phoneNumber || '',
        profileImageUrl: student.profileImageUrl || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Profile</h1>
        <p className="text-secondary-500">Manage your personal information</p>
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

      <Card>
        {/* Profile Image Preview */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-secondary-100">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {formData.profileImageUrl ? (
              <img
                src={formData.profileImageUrl}
                alt={formData.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-3xl font-bold text-primary-400">
                {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              {student?.fullName || 'Student'}
            </h2>
            <p className="text-secondary-500">{user?.email}</p>
            {student?.className && (
              <p className="text-sm text-secondary-400 mt-1">
                {student.className}
                {student.academicYear && ` · ${student.academicYear}`}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {isEditing && (
            <ImageUpload
              label="Profile Photo"
              value={formData.profileImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, profileImageUrl: url }))}
              placeholder="Upload your profile photo"
            />
          )}

          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
            disabled={!isEditing}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Class"
              value={formData.className}
              onChange={handleChange('className')}
              placeholder="e.g., Grade 10-A"
              disabled={!isEditing}
            />

            <Input
              label="Academic Year"
              value={formData.academicYear}
              onChange={handleChange('academicYear')}
              placeholder="e.g., 2025-2026"
              disabled={!isEditing}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            error={errors.phoneNumber}
            placeholder="+20 123 456 7890"
            disabled={!isEditing}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-secondary-100">
          {isEditing ? (
            <>
              <Button onClick={handleSubmit} isLoading={isSaving}>
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Account Info */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-secondary-50">
            <span className="text-secondary-500">Email</span>
            <span className="text-secondary-900 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-secondary-50">
            <span className="text-secondary-500">Account Type</span>
            <span className="text-secondary-900 font-medium">Student</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-secondary-500">Member Since</span>
            <span className="text-secondary-900 font-medium">
              {student?.createdAt
                ? new Date(student.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                : 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

