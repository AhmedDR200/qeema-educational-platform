/**
 * Image Upload Component
 * Handles file selection, upload, and preview
 */

import { useState, useRef, ChangeEvent } from 'react';
import { uploadApi } from '../../api/endpoints/upload';
import Spinner from './Spinner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Click to upload or drag and drop',
  error,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const url = await uploadApi.uploadImage(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || uploadError;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 hover:border-primary-400 hover:bg-secondary-50'
          }
          ${displayError ? 'border-red-300' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-3 text-sm text-secondary-500">Uploading...</p>
          </div>
        ) : value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-white text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-100 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-secondary-400">+</span>
            </div>
            <p className="text-sm font-medium text-secondary-700">{placeholder}</p>
            <p className="mt-1 text-xs text-secondary-500">
              JPEG, PNG, GIF, or WebP up to 5MB
            </p>
          </div>
        )}
      </div>

      {displayError && (
        <p className="mt-1.5 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}

