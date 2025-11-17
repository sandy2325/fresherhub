'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui';

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  currentResume?: string;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

const ResumeUpload = ({
  onFileSelect,
  currentResume,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['.pdf', '.doc', '.docx']
}: ResumeUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload ${acceptedTypes.join(', ')} files only.`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit.`);
      return;
    }

    setError(null);
    simulateFileUpload(file);
  };

  const simulateFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      onFileSelect(file);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeCurrentResume = () => {
    // In real app, this would call API to delete the resume
    onFileSelect(null as any);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Upload</h3>
        <p className="text-sm text-gray-600">
          Upload your resume in PDF or DOCX format. This helps us match you with relevant jobs and pre-fill your profile.
        </p>
      </div>

      {/* Current Resume */}
      {currentResume && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Resume uploaded successfully</p>
                <p className="text-xs text-green-700">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={removeCurrentResume}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {/* Upload Content */}
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isUploading ? 'bg-blue-100' : 'bg-gray-200'
          }`}>
            {isUploading ? (
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
            ) : error ? (
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            ) : (
              <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {isUploading ? 'Uploading...' : error ? 'Upload Failed' : 'Drop your resume here'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {isUploading
                ? `Processing... ${uploadProgress}% complete`
                : error
                ? error
                : `or click to browse (Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB, ${acceptedTypes.join(', ')} files)`
              }
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {!isUploading && !error && (
          <Button
            onClick={openFileDialog}
            variant="outline"
            className="mt-4"
            disabled={isUploading}
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Choose File
          </Button>
        )}
      </div>

      {/* File Info */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Upload Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">File Requirements:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>File types: {acceptedTypes.join(', ')}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>Maximum size: {(maxSize / 1024 / 1024).toFixed(1)}MB</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>Files are processed automatically for profile completion</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;