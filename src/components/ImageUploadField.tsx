'use client';

import { useState } from 'react';
import { uploadImage } from '../../lib/uploadImage';
import ImageLibrary from './ImageLibrary';
import { toast } from 'react-hot-toast';

interface ImageUploadFieldProps {
  label: string;
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  folder: string;
  required?: boolean;
  backgroundColor?: string;
}

type InputMode = 'upload' | 'url';

export default function ImageUploadField({
  label,
  currentImageUrl,
  onImageChange,
  folder,
  required = false,
  backgroundColor,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mode, setMode] = useState<InputMode>('upload');
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, folder);
      onImageChange(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\/.+/.test(trimmed)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }
    onImageChange(trimmed);
    setUrlInput('');
    toast.success('Image URL applied');
  };

  const handleLibrarySelect = (url: string) => {
    onImageChange(url);
    toast.success('Image selected from library');
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {/* Mode tabs */}
      <div className="d-flex gap-1 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setMode('upload')}
        >
          <i className="bi bi-upload me-1"></i>Upload
        </button>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'url' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setMode('url')}
        >
          <i className="bi bi-link-45deg me-1"></i>URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="d-flex gap-2 mb-2">
          <div className="flex-grow-1">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowLibrary(true)}
            disabled={uploading}
            title="Choose from library"
          >
            <i className="bi bi-images"></i>
          </button>
        </div>
      ) : (
        <div className="d-flex gap-2 mb-2">
          <input
            type="url"
            className="form-control"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlApply())}
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleUrlApply}
          >
            Apply
          </button>
        </div>
      )}

      {uploading && (
        <div className="mb-2">
          <div className="progress" style={{ height: '4px' }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
          </div>
          <small className="text-muted">Uploading...</small>
        </div>
      )}

      {currentImageUrl && (
        <div className="mt-2">
          <div className="d-flex align-items-start gap-2">
            <div
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor || '#f8f9fa',
                padding: '8px',
              }}
            >
              <img
                src={currentImageUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onImageChange('')}
              title="Remove image"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      )}

      <small className="text-muted d-block mt-1">
        Upload a file, paste a URL, or choose from existing library
      </small>

      {showLibrary && (
        <ImageLibrary
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
          currentFolder={folder}
        />
      )}
    </div>
  );
}
