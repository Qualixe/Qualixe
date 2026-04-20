'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'react-hot-toast';

interface ZipFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

function formatSize(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function FilesPage() {
  const [files, setFiles] = useState<ZipFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchFiles(); }, []);

  async function fetchFiles() {
    setLoading(true);
    try {
      const res = await fetch('/api/list-files');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFiles(data.files ?? []);
    } catch (err: any) {
      toast.error('Failed to load files: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(fileName: string) {
    if (!confirm(`Delete "${fileName}"?`)) return;
    setDeleting(fileName);
    try {
      const res = await fetch(`/api/file-action?action=delete&name=${encodeURIComponent(fileName)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('File deleted');
      setFiles(prev => prev.filter(f => f.name !== fileName));
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDownload(fileName: string) {
    try {
      const res = await fetch(`/api/file-action?action=sign&name=${encodeURIComponent(fileName)}&expires=60`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.open(data.url, '_blank');
    } catch (err: any) {
      toast.error('Download failed: ' + err.message);
    }
  }

  async function handleCopyLink(fileName: string) {
    try {
      const res = await fetch(`/api/file-action?action=sign&name=${encodeURIComponent(fileName)}&expires=86400`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await navigator.clipboard.writeText(data.url);
      toast.success('Link copied (valid 24h)');
    } catch (err: any) {
      toast.error('Failed to copy link: ' + err.message);
    }
  }

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = files.reduce((sum, f) => sum + (f.metadata?.size ?? 0), 0);

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />
      <div className="main-content">

        {/* Top bar */}
        <div className="top-bar">
          <h5 className="page-title">
            <i className="bi bi-file-zip me-2"></i>Files <span>/</span> ZIP Storage
          </h5>
          <div className="top-bar-right">
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-4">
          {[
            { icon: 'bi-file-zip', label: 'Total Files', value: files.length },
            { icon: 'bi-hdd', label: 'Total Size', value: formatSize(totalSize) },
          ].map(s => (
            <div key={s.label} className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle"><i className={`bi ${s.icon}`}></i></div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">{s.label}</span>
                    <h2 className="fw-bold mt-1 mb-0">{s.value}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="card p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className="input-group" style={{ maxWidth: 340 }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search files..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={fetchFiles}>
              <i className="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
        </div>

        {/* File list */}
        <div className="card p-4">
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border text-primary mb-3" />
              <p>Loading files...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-file-zip display-1 d-block mb-3"></i>
              <p>{search ? 'No files match your search.' : 'No ZIP files uploaded yet.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(file => (
                    <tr key={file.id ?? file.name}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: '#e8f0fe', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#0d6efd', flexShrink: 0,
                          }}>
                            <i className="bi bi-file-zip fs-5"></i>
                          </div>
                          <span className="fw-semibold" style={{ fontSize: 14 }}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted small">{formatSize(file.metadata?.size)}</td>
                      <td className="text-muted small">{formatDate(file.created_at)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleDownload(file.name)}
                            title="Download"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleCopyLink(file.name)}
                            title="Copy signed link (24h)"
                          >
                            <i className="bi bi-link-45deg"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(file.name)}
                            disabled={deleting === file.name}
                            title="Delete"
                          >
                            {deleting === file.name
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="bi bi-trash"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
