'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { mediaAPI, MediaFile } from '../../../../lib/api/media';
import { uploadImage } from '../../../../lib/uploadImage';
import { toast } from 'react-hot-toast';

export default function MediaPage() {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [filteredImages, setFilteredImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadFolder, setUploadFolder] = useState<string>('portfolio');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

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

    if (selectedFolder !== 'all') {
      filtered = filtered.filter((img) => img.folder === selectedFolder);
    }

    if (searchQuery) {
      filtered = filtered.filter((img) =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        errorCount++;
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        errorCount++;
        continue;
      }

      try {
        await uploadImage(file, uploadFolder);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    setUploading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully`);
      fetchImages();
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} image(s) failed to upload`);
    }

    setShowUploadModal(false);
    e.target.value = '';
  };

  const handleDelete = async (folder: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      await mediaAPI.deleteImage(folder, fileName);
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) {
      toast.error('No images selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) return;

    let successCount = 0;
    let errorCount = 0;

    for (const imageUrl of selectedImages) {
      const image = images.find((img) => img.url === imageUrl);
      if (!image) continue;

      try {
        await mediaAPI.deleteImage(image.folder, image.name);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} image(s) deleted`);
      fetchImages();
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} image(s) failed to delete`);
    }

    setSelectedImages(new Set());
  };

  const toggleImageSelection = (url: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedImages(newSelected);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalSize = () => {
    return filteredImages.reduce((acc, img) => acc + img.size, 0);
  };

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title">
            <i className="bi bi-images me-2"></i>Media <span>/</span> library
          </h5>
          <div className="top-bar-right">
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-images"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">total images</span>
                  <h2 className="fw-bold mt-1 mb-0">{images.length}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-filter"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">filtered</span>
                  <h2 className="fw-bold mt-1 mb-0">{filteredImages.length}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-hdd"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">storage used</span>
                  <h2 className="fw-bold mt-1 mb-0">{formatFileSize(getTotalSize())}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">selected</span>
                  <h2 className="fw-bold mt-1 mb-0">{selectedImages.size}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
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
            <div className="col-md-5 text-end">
              <div className="btn-group me-2">
                <button
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                </button>
                <button
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
              {selectedImages.size > 0 && (
                <button className="btn btn-sm btn-danger me-2" onClick={handleBulkDelete}>
                  <i className="bi bi-trash me-1"></i>Delete ({selectedImages.size})
                </button>
              )}
              <button className="btn btn-sm btn-primary" onClick={() => setShowUploadModal(true)}>
                <i className="bi bi-cloud-upload me-1"></i>Upload
              </button>
            </div>
          </div>
        </div>

        {/* Images Display */}
        <div className="card p-4">
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
              <button className="btn btn-primary mt-3" onClick={() => setShowUploadModal(true)}>
                <i className="bi bi-cloud-upload me-2"></i>Upload Images
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="row g-3">
              {filteredImages.map((image, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
                  <div className="card h-100">
                    <div className="position-relative">
                      <input
                        type="checkbox"
                        className="form-check-input position-absolute top-0 start-0 m-2"
                        style={{ zIndex: 10 }}
                        checked={selectedImages.has(image.url)}
                        onChange={() => toggleImageSelection(image.url)}
                      />
                      <div
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
                    </div>
                    <div className="card-body p-2">
                      <p className="card-text small mb-1 text-truncate" title={image.name} style={{ fontSize: '11px' }}>
                        {image.name}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary" style={{ fontSize: '9px' }}>
                          {image.folder}
                        </span>
                        <small className="text-muted" style={{ fontSize: '9px' }}>
                          {formatFileSize(image.size)}
                        </small>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            toast.success('URL copied!');
                          }}
                          title="Copy URL"
                        >
                          <i className="bi bi-clipboard"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(image.folder, image.name)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImages(new Set(filteredImages.map((img) => img.url)));
                          } else {
                            setSelectedImages(new Set());
                          }
                        }}
                      />
                    </th>
                    <th>Preview</th>
                    <th>Name</th>
                    <th>Folder</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImages.map((image, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedImages.has(image.url)}
                          onChange={() => toggleImageSelection(image.url)}
                        />
                      </td>
                      <td>
                        <img
                          src={image.url}
                          alt={image.name}
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }}>
                        {image.name}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{image.folder}</span>
                      </td>
                      <td>{formatFileSize(image.size)}</td>
                      <td>{formatDate(image.created_at)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            toast.success('URL copied!');
                          }}
                        >
                          <i className="bi bi-clipboard"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(image.folder, image.name)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-cloud-upload me-2"></i>Upload Images
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Folder</label>
                    <select
                      className="form-select"
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                    >
                      {folders.filter((f) => f !== 'all').map((folder) => (
                        <option key={folder} value={folder}>
                          {folder.charAt(0).toUpperCase() + folder.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Choose Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <small className="text-muted">You can select multiple images (max 5MB each)</small>
                  </div>
                  {uploading && (
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploading}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
