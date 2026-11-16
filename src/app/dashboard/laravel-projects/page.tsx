'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ImageUploadField from '@/components/ImageUploadField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { slugify } from '@/lib/slugify';
import {
  laravelProjectsAPI,
  type LaravelProject,
  type ProjectResult,
} from '../../../../lib/api/laravel-projects';

const EMPTY: LaravelProject = {
  title: '',
  slug: '',
  client_name: '',
  category: '',
  industry: '',
  short_description: '',
  description: '',
  challenge: '',
  solution: '',
  cover_image: '',
  gallery: [],
  tech_stack: [],
  features: [],
  results: [],
  live_url: '',
  year: String(new Date().getFullYear()),
  duration: '',
  featured: false,
  status: 'published',
};

/** Small reusable "type + Enter to add" tag input */
function TagInput({
  label,
  values,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    onChange([...values, ...parts.filter((p) => !values.includes(p))]);
    setInput('');
  };
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button type="button" className="btn btn-outline-primary" onClick={add}>
          <i className="bi bi-plus" /> Add
        </button>
      </div>
      {hint && <small className="text-muted d-block mb-2">{hint}</small>}
      <div className="d-flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={v + i} className="badge bg-primary d-flex align-items-center gap-1 py-2 px-3">
            {v}
            <i
              className="bi bi-x"
              style={{ cursor: 'pointer' }}
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LaravelProjectsDashboard() {
  const [projects, setProjects] = useState<LaravelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<LaravelProject | null>(null);
  const [form, setForm] = useState<LaravelProject>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const load = async () => {
    try {
      setProjects(await laravelProjectsAPI.getAll());
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects. Has lib/laravel-projects-schema.sql been run?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    featured: projects.filter((p) => p.featured).length,
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: projects.length });
    setSlugTouched(false);
    setShowModal(true);
  };

  const openEdit = (p: LaravelProject) => {
    setEditing(p);
    setForm({
      ...EMPTY,
      ...p,
      gallery: p.gallery ?? [],
      tech_stack: p.tech_stack ?? [],
      features: p.features ?? [],
      results: p.results ?? [],
    });
    setSlugTouched(true);
    setShowModal(true);
  };

  const set = <K extends keyof LaravelProject>(key: K, value: LaravelProject[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'title' && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const updateResult = (i: number, field: keyof ProjectResult, value: string) =>
    set('results', (form.results ?? []).map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(form.slug || form.title);
    if (!slug) { toast.error('Slug is required'); return; }

    const payload: LaravelProject = {
      ...form,
      slug,
      results: (form.results ?? []).filter((r) => r.value.trim() && r.label.trim()),
    };

    setSaving(true);
    try {
      if (editing?.id) {
        await laravelProjectsAPI.update(editing.id, payload);
        toast.success('Project updated');
      } else {
        await laravelProjectsAPI.create(payload);
        toast.success('Project created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      const e = err as { code?: string; message?: string } | null;
      const msg = e?.code === '23505' ? 'That slug is already used by another project' : e?.message;
      toast.error(msg || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: LaravelProject) => {
    if (!p.id || !confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await laravelProjectsAPI.delete(p.id);
      toast.success('Project deleted');
      load();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const toggleField = async (p: LaravelProject, field: 'featured' | 'status') => {
    if (!p.id) return;
    const value = field === 'featured' ? !p.featured : p.status === 'published' ? 'draft' : 'published';
    try {
      await laravelProjectsAPI.update(p.id, { [field]: value });
      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: value } : x)));
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === dropIndex) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(dropIndex, 0, moved);
    dragIndex.current = null;
    setProjects(reordered);
    try {
      await laravelProjectsAPI.updateOrder(reordered.map((p, i) => ({ id: p.id!, sort_order: i })));
      toast.success('Order saved');
    } catch {
      toast.error('Failed to save order');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-code-square" title="Laravel Projects" subtitle="showcase" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {[
                { icon: 'bi-code-square', label: 'total projects', value: stats.total },
                { icon: 'bi-eye', label: 'published', value: stats.published },
                { icon: 'bi-star-fill', label: 'featured', value: stats.featured },
              ].map((s) => (
                <div className="col-md-4" key={s.label}>
                  <div className="card p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                      <div className="stat-icon-circle"><i className={`bi ${s.icon}`} /></div>
                      <div>
                        <span className="text-secondary text-uppercase small fw-semibold">{s.label}</span>
                        <h2 className="fw-bold mt-1 mb-0">{s.value}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h4 className="mb-0">All Projects</h4>
                  <small className="text-muted">
                    <i className="bi bi-grip-vertical me-1" />Drag rows to reorder · The first featured project is spotlighted on{' '}
                    <a href="/laravel-projects" target="_blank" rel="noreferrer">/laravel-projects</a>
                  </small>
                </div>
                <button className="btn btn-primary btn-sm" onClick={openNew}>
                  <i className="bi bi-plus-circle me-2" />Add Project
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }} />
                      <th>Project</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr><td colSpan={7} className="text-center text-muted py-4">No projects yet — add your first one.</td></tr>
                    ) : projects.map((p, index) => (
                      <tr
                        key={p.id}
                        draggable
                        onDragStart={() => { dragIndex.current = index; }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        style={{ cursor: 'grab' }}
                      >
                        <td style={{ color: '#aaa' }}><i className="bi bi-grip-vertical fs-5" /></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {p.cover_image ? (
                              <img src={p.cover_image} alt="" style={{ width: 56, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                            ) : (
                              <div style={{ width: 56, height: 36, borderRadius: 6, background: '#eef2ff' }} />
                            )}
                            <div>
                              <div className="fw-semibold">{p.title}</div>
                              <small className="text-muted">/{p.slug}</small>
                            </div>
                          </div>
                        </td>
                        <td>{p.category || '—'}</td>
                        <td>{p.year || '—'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-link p-0"
                            onClick={() => toggleField(p, 'featured')}
                            title={p.featured ? 'Unfeature' : 'Feature'}
                          >
                            <i className={`bi ${p.featured ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} fs-5`} />
                          </button>
                        </td>
                        <td>
                          <button
                            className={`badge border-0 px-3 py-2 rounded-pill ${
                              p.status === 'published'
                                ? 'bg-success bg-opacity-25 text-success'
                                : 'bg-secondary bg-opacity-25 text-secondary'
                            }`}
                            onClick={() => toggleField(p, 'status')}
                            title="Toggle published / draft"
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="text-nowrap">
                          {p.status === 'published' && (
                            <a
                              href={`/laravel-projects/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-secondary me-2"
                              title="View"
                            >
                              <i className="bi bi-box-arrow-up-right" />
                            </a>
                          )}
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(p)} title="Edit">
                            <i className="bi bi-pencil" />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p)} title="Delete">
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Edit Project' : 'Add Laravel Project'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                  <h6 className="text-uppercase text-muted small fw-bold mb-3">Basics</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Project Title *</label>
                      <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Slug (URL) *</label>
                      <div className="input-group">
                        <span className="input-group-text">/laravel-projects/</span>
                        <input
                          className="form-control"
                          name="slug"
                          value={form.slug}
                          onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
                          onBlur={() => set('slug', slugify(form.slug))}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Client Name</label>
                      <input className="form-control" name="client_name" value={form.client_name || ''} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Category</label>
                      <input
                        className="form-control"
                        name="category"
                        value={form.category || ''}
                        onChange={handleChange}
                        placeholder="e.g. SaaS, ERP, CRM, Booking"
                        list="lp-categories"
                      />
                      <datalist id="lp-categories">
                        {Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).map((c) => (
                          <option key={c} value={c!} />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Industry</label>
                      <input className="form-control" name="industry" value={form.industry || ''} onChange={handleChange} placeholder="e.g. Healthcare" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Year</label>
                      <input className="form-control" name="year" value={form.year || ''} onChange={handleChange} placeholder="2025" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Timeline</label>
                      <input className="form-control" name="duration" value={form.duration || ''} onChange={handleChange} placeholder="e.g. 12 weeks" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Live URL</label>
                      <input type="url" className="form-control" name="live_url" value={form.live_url || ''} onChange={handleChange} placeholder="https://" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                        <option value="published">Published</option>
                        <option value="draft">Draft (hidden)</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="lp-featured"
                          checked={!!form.featured}
                          onChange={(e) => set('featured', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="lp-featured">Featured (spotlight on showcase page)</label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <h6 className="text-uppercase text-muted small fw-bold mb-3">Story</h6>
                  <div className="mb-3">
                    <label className="form-label">Short Description</label>
                    <input
                      className="form-control"
                      name="short_description"
                      value={form.short_description || ''}
                      onChange={handleChange}
                      maxLength={200}
                      placeholder="One sentence shown on cards and as the page subtitle"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Overview</label>
                    <textarea className="form-control" name="description" rows={5} value={form.description || ''} onChange={handleChange} />
                    <small className="text-muted">Leave a blank line between paragraphs.</small>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">The Challenge</label>
                      <textarea className="form-control" name="challenge" rows={4} value={form.challenge || ''} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Our Solution</label>
                      <textarea className="form-control" name="solution" rows={4} value={form.solution || ''} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Results / Key Numbers</label>
                    {(form.results ?? []).map((r, i) => (
                      <div className="input-group mb-2" key={i}>
                        <input
                          className="form-control"
                          style={{ maxWidth: 140 }}
                          placeholder="3x"
                          value={r.value}
                          onChange={(e) => updateResult(i, 'value', e.target.value)}
                        />
                        <input
                          className="form-control"
                          placeholder="Faster order processing"
                          value={r.label}
                          onChange={(e) => updateResult(i, 'label', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => set('results', (form.results ?? []).filter((_, idx) => idx !== i))}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => set('results', [...(form.results ?? []), { value: '', label: '' }])}
                    >
                      <i className="bi bi-plus" /> Add result
                    </button>
                  </div>

                  <hr />
                  <h6 className="text-uppercase text-muted small fw-bold mb-3">Details</h6>
                  <TagInput
                    label="Tech Stack"
                    values={form.tech_stack ?? []}
                    onChange={(v) => set('tech_stack', v)}
                    placeholder="Laravel 11, Livewire, MySQL…"
                    hint="Press Enter or separate with commas."
                  />
                  <TagInput
                    label="Key Features"
                    values={form.features ?? []}
                    onChange={(v) => set('features', v)}
                    placeholder="Role-based admin panel"
                  />

                  <hr />
                  <h6 className="text-uppercase text-muted small fw-bold mb-3">Media</h6>
                  <ImageUploadField
                    label="Cover Image (16:10 screenshot works best)"
                    currentImageUrl={form.cover_image}
                    onImageChange={(url) => set('cover_image', url)}
                    folder="laravel"
                  />

                  <div className="mb-3">
                    <label className="form-label">Gallery Screens</label>
                    {(form.gallery ?? []).length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {(form.gallery ?? []).map((src, i) => (
                          <div key={src + i} className="position-relative">
                            <img src={src} alt="" style={{ width: 120, height: 75, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1"
                              onClick={() => set('gallery', (form.gallery ?? []).filter((_, idx) => idx !== i))}
                              aria-label="Remove image"
                            >
                              <i className="bi bi-x" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <ImageUploadField
                      key={(form.gallery ?? []).length}
                      label="Add gallery image"
                      currentImageUrl=""
                      onImageChange={(url) => { if (url) set('gallery', [...(form.gallery ?? []), url]); }}
                      folder="laravel"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
