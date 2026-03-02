'use client';

import { useEffect, useState } from 'react';
import { mediaAPI, MediaFile } from '../../lib/api/media';
import { toast } from 'react-hot-toast';

interface ImageLibraryProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
  currentFolder?: string;
}

export default function ImageLibrary({ onSelect, onClose, currentFolder }: ImageLibraryProps) {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [filteredImages, setFilteredImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>(currentFolder || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');

  const folders = ['all', 'portfolio', 'brands', 'clients', 'themes', 'blog'];

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, selectedFolder, searchQuery]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await mediaAPI.getAllImages();
      setImages(data);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...images];

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter((img) => img.folder === selectedFolder);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((img) =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    } else {
      toast.error('Please select an image');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-images me-2"></i>Image Library
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                  >
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder === 'all' ? 'All Folders' : folder.charAt(0).toUpperCase() + folder.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="alert alert-info mb-4">
                <i className="bi bi-info-circle me-2"></i>
                Showing {filteredImages.length} of {images.length} images
                {selectedFolder !== 'all' && ` in ${selectedFolder}`}
              </div>

              {/* Image Grid */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-image display-1 d-block mb-3"></i>
                  <p>No images found</p>
                </div>
              ) : (
                <div className="row g-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {filteredImages.map((image, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
                      <div
                        className={`card h-100 cursor-pointer ${
                          selectedImage === image.url ? 'border-primary border-3' : ''
                        }`}
                        onClick={() => setSelectedImage(image.url)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="card-img-top"
                          style={{
                            height: '150px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                        <div className="card-body p-2">
                          <p
                            className="card-text small mb-1 text-truncate"
                            title={image.name}
                            style={{ fontSize: '11px' }}
                          >
                            {image.name}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-secondary" style={{ fontSize: '9px' }}>
                              {image.folder}
                            </span>
                            <small className="text-muted" style={{ fontSize: '9px' }}>
                              {formatFileSize(image.size)}
                            </small>
                          </div>
                          {selectedImage === image.url && (
                            <div className="text-center mt-2">
                              <i className="bi bi-check-circle-fill text-primary"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSelect}
                disabled={!selectedImage}
              >
                <i className="bi bi-check-lg me-2"></i>
                Select Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
