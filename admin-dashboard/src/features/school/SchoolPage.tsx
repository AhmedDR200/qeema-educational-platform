/**
 * School Profile Page
 * View and edit school information
 */

import { useState, useEffect, FormEvent } from 'react';
import { schoolApi } from '../../api/endpoints/school';
import { Card, Input, Button, Alert, Spinner, ImageUpload } from '../../components/ui';
import { School, SchoolFormData } from '../../types';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
}

export default function SchoolPage() {
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    logoUrl: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchSchool = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await schoolApi.getSchool();
        setSchool(response.data);
        setFormData({
          name: response.data.name || '',
          logoUrl: response.data.logoUrl || '',
          phoneNumber: response.data.phoneNumber || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load school profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'School name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'School name must be at least 2 characters';
    }

    if (formData.phoneNumber && !/^[+]?[\d\s-]*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const response = await schoolApi.updateSchool(formData);
      setSchool(response.data);
      setIsEditing(false);
      setSuccess('School profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update school profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (school) {
      setFormData({
        name: school.name || '',
        logoUrl: school.logoUrl || '',
        phoneNumber: school.phoneNumber || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field: keyof SchoolFormData) => (
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
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">School Profile</h1>
        <p className="text-secondary-500">Manage your school's information</p>
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

      {/* View Mode */}
      {!isEditing && school && (
        <Card>
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-secondary-100">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {school.logoUrl ? (
                <img
                  src={school.logoUrl}
                  alt={school.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary-400">
                  {school.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                {school.name}
              </h2>
              {school.phoneNumber && (
                <p className="text-secondary-500">{school.phoneNumber}</p>
              )}
              <p className="text-sm text-secondary-400 mt-2">
                Last updated:{' '}
                {new Date(school.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-secondary-50">
              <span className="text-secondary-500">School Name</span>
              <span className="text-secondary-900 font-medium">{school.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-secondary-50">
              <span className="text-secondary-500">Phone Number</span>
              <span className="text-secondary-900 font-medium">
                {school.phoneNumber || '—'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-secondary-500">Logo URL</span>
              <span className="text-secondary-900 font-medium truncate max-w-[200px]">
                {school.logoUrl || '—'}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-100">
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <ImageUpload
                label="School Logo"
                value={formData.logoUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
                placeholder="Upload school logo"
              />

              <Input
                label="School Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={errors.name}
                placeholder="e.g., Qeema Academy"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                error={errors.phoneNumber}
                placeholder="+20 123 456 7890"
              />
            </div>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-secondary-100">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

