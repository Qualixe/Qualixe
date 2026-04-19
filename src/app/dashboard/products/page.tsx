'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import ImageUploadField from '@/components/ImageUploadField';
import { supabase } from '../../../../lib/supabaseClient';
import { toast } from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  badge?: string;
  badge_color?: string;
  preview_url?: string;
  demo_url?: string;
  features: string[];
  file_path: string;
  file_name: string;
  file_size: number;
  active: boolean;
  sales_count: number;
  created_at: string;
}

const EMPTY: Omit<Product, 'id' | 'created_at' | 'sales_count'> = {
  name: '', tagline: '', description: '',
  price: 9.99, badge: '', badge_color: '#0d6efd',
  preview_url: '', demo_url: '', features: [''],
  file_path: '', file_name: '', file_size: 0, active: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load products');
    else setProducts(data ?? []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, features: [''] });
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, tagline: p.tagline, description: p.description,
      price: p.price, badge: p.badge ?? '', badge_color: p.badge_color ?? '#0d6efd',
      preview_url: p.preview_url ?? '', demo_url: p.demo_url ?? '',
      features: p.features?.length ? p.features : [''],
      file_path: p.file_path, file_name: p.file_name, file_size: p.file_size,
      active: p.active,
    });
    setShowModal(true);
  }

  // Feature list helpers
  const setFeature = (i: number, val: string) =>
    setForm(f => { const arr = [...f.features]; arr[i] = val; return { ...f, features: arr }; });
  const addFeature = () =>
    setForm(f => ({ ...f, features: [...f.features, ''] }));
  const removeFeature = (i: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) { toast.error('Only .zip files are allowed'); e.target.value = ''; return; }
    if (file.size > 100 * 1024 * 1024) { toast.error('File too large (max 100MB)'); e.target.value = ''; return; }

    setUploading(true);
    setUploadProgress(30);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload-product', { method: 'POST', body: fd });
      setUploadProgress(90);
      const data = await res.json();
      if (!res.ok) toast.error('Upload failed: ' + data.error);
      else {
        setForm(f => ({ ...f, file_path: data.filePath, file_name: data.fileName, file_size: data.fileSize }));
        toast.success('File uploaded');
      }
    } catch { toast.error('Upload failed: network error'); }
    finally { setUploading(false); setUploadProgress(0); e.target.value = ''; }
  }

  async function handleSave(e: React.FormEvent) {    e.preventDefault();
    if (!form.file_path) { toast.error('Please upload a ZIP file first'); return; }
    setSaving(true);

    const payload = {
      name: form.name, tagline: form.tagline, description: form.description,
      price: Number(form.price),
      badge: form.badge || null, badge_color: form.badge_color,
      preview_url: form.preview_url || null,
      demo_url: form.demo_url || null,
      features: form.features.filter(f => f.trim()),
      file_path: form.file_path, file_name: form.file_name, file_size: form.file_size,
      active: form.active,
    };

    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert({ ...payload, sales_count: 0 });

    if (error) toast.error(error.message);
    else { toast.success(editing ? 'Product updated' : 'Product created'); setShowModal(false); fetchProducts(); }
    setSaving(false);
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) toast.error(error.message);
    else { toast.success('Deleted'); fetchProducts(); }
  }

  async function toggleActive(p: Product) {
    const { error } = await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    if (error) toast.error(error.message);
    else fetchProducts();
  }

  function formatSize(bytes: number) {
    if (!bytes) return '—';
    return bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  const totalRevenue = products.reduce((s, p) => s + p.price * p.sales_count, 0);
  const totalSales = products.reduce((s, p) => s + p.sales_count, 0);

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />
      <div className="main-content">

        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-box-seam me-2"></i>Products <span>/</span> Digital Store</h5>
          <div className="top-bar-right"><NotificationDropdown /><UserAvatar /></div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-4">
          {[
            { icon: 'bi-box-seam', label: 'Total Products', value: products.length },
            { icon: 'bi-check-circle', label: 'Active', value: products.filter(p => p.active).length },
            { icon: 'bi-bag-check', label: 'Total Sales', value: totalSales },
            { icon: 'bi-currency-dollar', label: 'Revenue', value: `$${totalRevenue.toFixed(2)}` },
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
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted small">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <i className="bi bi-plus-lg me-1"></i>Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card p-4">
          {loading ? (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Preview</th><th>File</th><th>Sales</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e8edf5', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 12, background: '#e8edf5', borderRadius: 4, marginBottom: 6, width: '70%' }} />
                            <div style={{ height: 10, background: '#f0f4f8', borderRadius: 4, width: '50%' }} />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div style={{ height: 12, background: '#e8edf5', borderRadius: 4 }} /></td>
                      ))}
                      <td><div style={{ height: 28, background: '#e8edf5', borderRadius: 6, width: 60 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-box-seam display-1 d-block mb-3"></i>
              <p>No products yet</p>
              <button className="btn btn-primary mt-2" onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>Add First Product</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Product</th><th>Price</th><th>Preview</th>
                    <th>Demo</th><th>File</th><th>Sales</th><th>Status</th><th>Created</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {p.preview_url ? (
                            <img src={p.preview_url} alt={p.name}
                              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                              loading="lazy" />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d6efd', flexShrink: 0 }}>
                              <i className="bi bi-file-zip fs-5"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold" style={{ fontSize: 14 }}>{p.name}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>{p.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">${p.price.toFixed(2)}</td>
                      <td>
                        {p.preview_url ? (
                          <button className="btn btn-sm btn-outline-info" onClick={() => setPreviewProduct(p)} title="Preview">
                            <i className="bi bi-eye"></i>
                          </button>
                        ) : <span className="text-muted small">—</span>}
                      </td>
                      <td>
                        {p.demo_url ? (
                          <a href={p.demo_url} target="_blank" rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary" title="Open demo">
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        ) : <span className="text-muted small">—</span>}
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>
                          <div className="text-truncate" style={{ maxWidth: 140 }}>{p.file_name || '—'}</div>
                          <div className="text-muted">{formatSize(p.file_size)}</div>
                        </div>
                      </td>
                      <td><span className="badge bg-primary rounded-pill">{p.sales_count}</span></td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input className="form-check-input" type="checkbox" checked={p.active}
                            onChange={() => toggleActive(p)} style={{ cursor: 'pointer' }} />
                          <label className="form-check-label small text-muted">{p.active ? 'Active' : 'Hidden'}</label>
                        </div>
                      </td>
                      <td className="text-muted small">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <form onSubmit={handleSave} style={{ display: 'contents' }}>
              <div className="modal-content" style={{ borderRadius: 20 }}>
                <div className="modal-header border-0 pb-0" style={{ flexShrink: 0 }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-box-seam me-2 text-primary"></i>
                    {editing ? 'Edit Product' : 'Add New Product'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                {/* Scrollable body */}
                <div className="modal-body pt-3">
                  <div className="row g-3">

                    {/* Name + Price */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Product Name *</label>
                      <input className="form-control" placeholder="e.g. Premium HTML Template"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Price (USD) *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control" min="0" step="0.01"
                          value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} required />
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Tagline</label>
                      <input className="form-control" placeholder="e.g. Bootstrap 5 · Fully Responsive"
                        value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea className="form-control" rows={3} placeholder="Describe what's included..."
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>

                    {/* Preview Image — uses shared media library */}
                    <div className="col-12">
                      <ImageUploadField
                        label="Preview Image"
                        currentImageUrl={form.preview_url}
                        onImageChange={url => setForm(f => ({ ...f, preview_url: url }))}
                        folder="products"
                      />
                    </div>

                    {/* Demo URL */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Demo URL</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-globe2"></i></span>
                        <input
                          className="form-control"
                          placeholder="https://demo.yoursite.com/template"
                          value={form.demo_url}
                          onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
                          type="url"
                        />
                      </div>
                      <small className="text-muted">Share a live preview link with buyers</small>
                    </div>

                    {/* Features */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Features</label>
                      <div className="d-flex flex-column gap-2">
                        {form.features.map((feat, i) => (
                          <div key={i} className="input-group">
                            <input className="form-control" placeholder={`Feature ${i + 1}`}
                              value={feat} onChange={e => setFeature(i, e.target.value)} />
                            {form.features.length > 1 && (
                              <button type="button" className="btn btn-outline-danger" onClick={() => removeFeature(i)}>
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" className="btn btn-outline-secondary btn-sm align-self-start" onClick={addFeature}>
                          <i className="bi bi-plus me-1"></i>Add Feature
                        </button>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Badge Label</label>
                      <input className="form-control" placeholder="e.g. Best Seller"
                        value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Badge Color</label>
                      <div className="d-flex gap-2 align-items-center">
                        <input type="color" className="form-control form-control-color"
                          value={form.badge_color} onChange={e => setForm(f => ({ ...f, badge_color: e.target.value }))}
                          style={{ width: 48, height: 38, padding: 2 }} />
                        <input className="form-control" value={form.badge_color}
                          onChange={e => setForm(f => ({ ...f, badge_color: e.target.value }))} />
                      </div>
                    </div>

                    {/* ZIP Upload */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">ZIP File *</label>
                      <div className="products-upload-zone" onClick={() => fileRef.current?.click()}>
                        {form.file_name ? (
                          <div className="products-upload-zone__filled">
                            <i className="bi bi-file-zip text-primary fs-2"></i>
                            <div>
                              <div className="fw-semibold">{form.file_name}</div>
                              <div className="text-muted small">{formatSize(form.file_size)}</div>
                            </div>
                            <span className="badge bg-success">Uploaded</span>
                          </div>
                        ) : (
                          <div className="products-upload-zone__empty">
                            <i className="bi bi-cloud-upload fs-1 text-muted"></i>
                            <p className="mb-1 fw-semibold">Click to upload ZIP file</p>
                            <p className="text-muted small mb-0">Max 100MB · .zip only</p>
                          </div>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept=".zip" className="d-none"
                        onChange={handleFileUpload} disabled={uploading} />
                      {uploading && (
                        <div className="progress mt-2" style={{ height: 6 }}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Active */}
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="activeToggle"
                          checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                        <label className="form-check-label fw-semibold" htmlFor="activeToggle">Visible on shop page</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky footer — always visible */}
                <div className="modal-footer border-top" style={{ flexShrink: 0 }}>
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving || uploading}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                      : <><i className="bi bi-check-lg me-1"></i>{editing ? 'Update' : 'Create'} Product</>}
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── Preview Modal ── */}
      {previewProduct && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setPreviewProduct(null)} />
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 20, overflow: 'hidden' }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-eye me-2 text-primary"></i>
                    Preview — {previewProduct.name}
                  </h5>
                  <button className="btn-close" onClick={() => setPreviewProduct(null)} />
                </div>
                <div className="modal-body p-0">
                  <img src={previewProduct.preview_url} alt={previewProduct.name}
                    style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#f8f9fc' }} />
                </div>
                <div className="modal-footer border-0 justify-content-between">
                  <div>
                    <span className="fw-bold me-2">{previewProduct.name}</span>
                    <span className="text-muted small">{previewProduct.tagline}</span>
                  </div>
                  <button className="btn btn-light" onClick={() => setPreviewProduct(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
