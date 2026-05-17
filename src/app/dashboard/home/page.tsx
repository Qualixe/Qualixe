'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { getHomePage, upsertHomeSection, type HomePage, type HomeService } from '../../../../lib/api/home-page';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FALLBACK } from '../../(main)/home/fallback';

function Field({ label, value, onChange, textarea = false, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; hint?: string;
}) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      {textarea
        ? <textarea className="form-control" rows={3} value={value} onChange={e => onChange(e.target.value)} />
        : <input type="text" className="form-control" value={value} onChange={e => onChange(e.target.value)} />}
      {hint && <small className="text-muted d-block mt-1">{hint}</small>}
    </div>
  );
}

function SectionCard({ title, icon, children, onSave, saving }: {
  title: string; icon: string; children: React.ReactNode;
  onSave: () => void; saving: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer', background: '#f8f9fc' }} onClick={() => setOpen(o => !o)}>
        <span className="fw-semibold">
          <i className={`bi ${icon} me-2 text-primary`}></i>{title}
        </span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'} text-muted`}></i>
      </div>
      {open && (
        <div className="card-body">
          {children}
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary btn-sm px-4" onClick={onSave} disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                : <><i className="bi bi-check-lg me-1" />Save Section</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeEditor() {
  const [page, setPage] = useState<HomePage>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getHomePage()
      .then(data => { if (data) setPage(data); })
      .catch(() => toast.error('Failed to load page content'))
      .finally(() => setLoading(false));
  }, []);

  async function save(section: string, content: object) {
    setSaving(section);
    try {
      await upsertHomeSection(section, content);
      toast.success(`${section} section saved`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  }

  const { hero, about, services } = page;

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />
      <div className="main-content">
        <DashboardHeader icon="bi-house" title="Home Page" subtitle="editor" />

        {loading ? (
          <div className="text-center py-5 text-muted">
            <span className="spinner-border spinner-border-sm me-2" />Loading content…
          </div>
        ) : (
          <>
            <div className="alert alert-info d-flex align-items-center gap-2 mb-4 py-2">
              <i className="bi bi-info-circle-fill"></i>
              <span>Changes are saved per section and go live immediately.</span>
            </div>

            {/* ── Hero ── */}
            <SectionCard title="Hero Section" icon="bi-stars" onSave={() => save('hero', hero)} saving={saving === 'hero'}>
              <Field label="Badge text" value={hero.badge}
                onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, badge: v } }))}
                hint="e.g. 🚀 Shopify & E-Commerce Experts" />
              <div className="row g-3">
                <div className="col-md-6">
                  <Field label="Heading line 1" value={hero.heading_line1}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, heading_line1: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="Heading line 2 (accent)" value={hero.heading_line2}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, heading_line2: v } }))} />
                </div>
              </div>
              <Field label="Description" value={hero.description} textarea
                onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, description: v } }))} />
              <div className="row g-3">
                <div className="col-md-6">
                  <Field label="Primary CTA text" value={hero.cta_primary_text}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, cta_primary_text: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="Primary CTA URL" value={hero.cta_primary_url}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, cta_primary_url: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="Secondary CTA text" value={hero.cta_secondary_text}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, cta_secondary_text: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="Secondary CTA URL" value={hero.cta_secondary_url}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, cta_secondary_url: v } }))} />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Field label="Floating badge top" value={hero.float_top}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, float_top: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="Floating badge bottom" value={hero.float_bottom}
                    onChange={v => setPage(p => ({ ...p, hero: { ...p.hero, float_bottom: v } }))} />
                </div>
              </div>
              <hr />
              <label className="form-label fw-semibold">Social Proof Stats</label>
              {hero.proof.map((p, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-md-4">
                    <input className="form-control" placeholder="Value (e.g. 50+)" value={p.value}
                      onChange={e => setPage(pg => ({ ...pg, hero: { ...pg.hero, proof: pg.hero.proof.map((x, j) => j === i ? { ...x, value: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Label (e.g. Stores Built)" value={p.label}
                      onChange={e => setPage(pg => ({ ...pg, hero: { ...pg.hero, proof: pg.hero.proof.map((x, j) => j === i ? { ...x, label: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-danger w-100" onClick={() =>
                      setPage(pg => ({ ...pg, hero: { ...pg.hero, proof: pg.hero.proof.filter((_, j) => j !== i) } }))}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm" onClick={() =>
                setPage(p => ({ ...p, hero: { ...p.hero, proof: [...p.hero.proof, { value: '', label: '' }] } }))}>
                <i className="bi bi-plus me-1"></i>Add Stat
              </button>
            </SectionCard>

            {/* ── About ── */}
            <SectionCard title="About Section" icon="bi-info-circle" onSave={() => save('about', about)} saving={saving === 'about'}>
              <Field label="Label badge" value={about.label}
                onChange={v => setPage(p => ({ ...p, about: { ...p.about, label: v } }))} />
              <Field label="Heading (use \\n for line break)" value={about.heading} textarea
                onChange={v => setPage(p => ({ ...p, about: { ...p.about, heading: v } }))} />
              <Field label="Description" value={about.description} textarea
                onChange={v => setPage(p => ({ ...p, about: { ...p.about, description: v } }))} />
              <div className="row g-3">
                <div className="col-md-6">
                  <Field label="CTA text" value={about.cta_text}
                    onChange={v => setPage(p => ({ ...p, about: { ...p.about, cta_text: v } }))} />
                </div>
                <div className="col-md-6">
                  <Field label="CTA URL" value={about.cta_url}
                    onChange={v => setPage(p => ({ ...p, about: { ...p.about, cta_url: v } }))} />
                </div>
              </div>
              <hr />
              <label className="form-label fw-semibold">Stats</label>
              {about.stats.map((s, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-md-4">
                    <input className="form-control" placeholder="Value" value={s.value}
                      onChange={e => setPage(p => ({ ...p, about: { ...p.about, stats: p.about.stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Label" value={s.label}
                      onChange={e => setPage(p => ({ ...p, about: { ...p.about, stats: p.about.stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-danger w-100" onClick={() =>
                      setPage(p => ({ ...p, about: { ...p.about, stats: p.about.stats.filter((_, j) => j !== i) } }))}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm mb-3" onClick={() =>
                setPage(p => ({ ...p, about: { ...p.about, stats: [...p.about.stats, { value: '', label: '' }] } }))}>
                <i className="bi bi-plus me-1"></i>Add Stat
              </button>
              <hr />
              <label className="form-label fw-semibold">Reasons / Bullet Points</label>
              {about.reasons.map((r, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Icon" value={r.icon}
                      onChange={e => setPage(p => ({ ...p, about: { ...p.about, reasons: p.about.reasons.map((x, j) => j === i ? { ...x, icon: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-8">
                    <input className="form-control" placeholder="Text" value={r.text}
                      onChange={e => setPage(p => ({ ...p, about: { ...p.about, reasons: p.about.reasons.map((x, j) => j === i ? { ...x, text: e.target.value } : x) } }))} />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-danger w-100" onClick={() =>
                      setPage(p => ({ ...p, about: { ...p.about, reasons: p.about.reasons.filter((_, j) => j !== i) } }))}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm" onClick={() =>
                setPage(p => ({ ...p, about: { ...p.about, reasons: [...p.about.reasons, { icon: '✅', text: '' }] } }))}>
                <i className="bi bi-plus me-1"></i>Add Reason
              </button>
            </SectionCard>

            {/* ── Services ── */}
            <SectionCard title="Services Section" icon="bi-grid" onSave={() => save('services', services)} saving={saving === 'services'}>
              <Field label="Label badge" value={services.label}
                onChange={v => setPage(p => ({ ...p, services: { ...p.services, label: v } }))} />
              <Field label="Heading" value={services.heading}
                onChange={v => setPage(p => ({ ...p, services: { ...p.services, heading: v } }))} />
              <Field label="Subheading" value={services.subheading}
                onChange={v => setPage(p => ({ ...p, services: { ...p.services, subheading: v } }))} />
              <hr />
              {services.items.map((item, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-muted small">Service Card {i + 1}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() =>
                      setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.filter((_, j) => j !== i) } }))}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="row g-2">
                    <div className="col-md-2">
                      <Field label="Icon (emoji)" value={item.icon}
                        onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, icon: v } : x) } }))} />
                    </div>
                    <div className="col-md-5">
                      <Field label="Heading" value={item.heading}
                        onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, heading: v } : x) } }))} />
                    </div>
                    <div className="col-md-5">
                      <Field label="Link URL" value={item.href}
                        onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, href: v } : x) } }))} />
                    </div>
                  </div>
                  <Field label="Content" value={item.content} textarea
                    onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, content: v } : x) } }))} />
                  <div className="row g-2">
                    <div className="col-md-6">
                      <Field label="Background color" value={item.color} hint="e.g. #eef2ff"
                        onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, color: v } : x) } }))} />
                    </div>
                    <div className="col-md-6">
                      <Field label="Accent color" value={item.accent} hint="e.g. #0c3cc3"
                        onChange={v => setPage(p => ({ ...p, services: { ...p.services, items: p.services.items.map((x, j) => j === i ? { ...x, accent: v } : x) } }))} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm" onClick={() =>
                setPage(p => ({ ...p, services: { ...p.services, items: [...p.services.items, { icon: '🌟', heading: '', content: '', href: '/', color: '#f8f9fc', accent: '#0c3cc3' } as HomeService] } }))}>
                <i className="bi bi-plus me-1"></i>Add Service Card
              </button>
            </SectionCard>

            <div className="text-center py-3">
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-box-arrow-up-right me-1"></i>Preview live page
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
