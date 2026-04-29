'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  getShopifyServicePage,
  upsertSection,
  ShopifyServicePage,
  ServiceItem,
  ProcessItem,
  WhyUsItem,
  FaqItem,
} from '../../../../../lib/api/shopify-service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── Reusable helpers ──────────────────────────────────────

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
      {hint && <small className="text-muted">{hint}</small>}
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
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer', background: '#f8f9fc' }}
        onClick={() => setOpen(o => !o)}
      >
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

// ── Main page ─────────────────────────────────────────────

export default function ShopifyServiceEditor() {
  const [page, setPage] = useState<ShopifyServicePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getShopifyServicePage()
      .then(data => setPage(data))
      .catch(() => toast.error('Failed to load page content'))
      .finally(() => setLoading(false));
  }, []);

  async function save(section: string, content: object) {
    setSaving(section);
    try {
      await upsertSection(section, content);
      toast.success(`${section.replace('_', ' ')} section saved`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  }

  // ── Item list helpers ─────────────────────────────────

  function updateItem<T>(arr: T[], index: number, key: keyof T, value: string): T[] {
    return arr.map((item, i) => i === index ? { ...item, [key]: value } : item);
  }
  function addItem<T>(arr: T[], blank: T): T[] { return [...arr, blank]; }
  function removeItem<T>(arr: T[], index: number): T[] { return arr.filter((_, i) => i !== index); }

  if (loading || !page) {
    return (
      <div className="dashboard-wrapper">
        <DashboardSidebar />
        <div className="main-content">
          <DashboardHeader icon="bi-shop" title="Shopify Service Page" subtitle="editor" />
          <div className="text-center py-5 text-muted">
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Loading content…</> : 'Failed to load content.'}
          </div>
        </div>
      </div>
    );
  }

  const { hero, services, process, why_us, faq, cta } = page;

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />
      <div className="main-content">
        <DashboardHeader icon="bi-shop" title="Shopify Service Page" subtitle="editor" />

        <div className="alert alert-info d-flex align-items-center gap-2 mb-4 py-2">
          <i className="bi bi-info-circle-fill"></i>
          <span>Changes are saved per section and go live immediately on the public page.</span>
        </div>

        {/* ── Hero ── */}
        <SectionCard title="Hero Section" icon="bi-megaphone" onSave={() => save('hero', hero)} saving={saving === 'hero'}>
          <Field label="Badge text" value={hero.badge} onChange={v => setPage(p => p && ({ ...p, hero: { ...p.hero, badge: v } }))} />
          <Field label="Heading (H1)" value={hero.heading} onChange={v => setPage(p => p && ({ ...p, hero: { ...p.hero, heading: v } }))} textarea />
          <Field label="Subheading paragraph" value={hero.subheading} onChange={v => setPage(p => p && ({ ...p, hero: { ...p.hero, subheading: v } }))} textarea />
          <div className="row g-3">
            <div className="col-md-6">
              <Field label="CTA button text" value={hero.cta_text} onChange={v => setPage(p => p && ({ ...p, hero: { ...p.hero, cta_text: v } }))} />
            </div>
            <div className="col-md-6">
              <Field label="CTA button URL" value={hero.cta_url} onChange={v => setPage(p => p && ({ ...p, hero: { ...p.hero, cta_url: v } }))} />
            </div>
          </div>
        </SectionCard>

        {/* ── Services ── */}
        <SectionCard title="Services Cards" icon="bi-grid" onSave={() => save('services', services)} saving={saving === 'services'}>
          <Field label="Section heading" value={services.heading} onChange={v => setPage(p => p && ({ ...p, services: { ...p.services, heading: v } }))} />
          <Field label="Section subheading" value={services.subheading} onChange={v => setPage(p => p && ({ ...p, services: { ...p.services, subheading: v } }))} />
          <hr />
          {services.items.map((item, i) => (
            <div key={i} className="border rounded p-3 mb-3 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-muted small">Card {i + 1}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() =>
                  setPage(p => p && ({ ...p, services: { ...p.services, items: removeItem(p.services.items, i) } }))}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="row g-2">
                <div className="col-md-4">
                  <Field label="Bootstrap icon class" value={item.icon}
                    onChange={v => setPage(p => p && ({ ...p, services: { ...p.services, items: updateItem<ServiceItem>(p.services.items, i, 'icon', v) } }))}
                    hint="e.g. bi-shop" />
                </div>
                <div className="col-md-8">
                  <Field label="Title" value={item.title}
                    onChange={v => setPage(p => p && ({ ...p, services: { ...p.services, items: updateItem<ServiceItem>(p.services.items, i, 'title', v) } }))} />
                </div>
              </div>
              <Field label="Description" value={item.desc} textarea
                onChange={v => setPage(p => p && ({ ...p, services: { ...p.services, items: updateItem<ServiceItem>(p.services.items, i, 'desc', v) } }))} />
            </div>
          ))}
          <button className="btn btn-outline-primary btn-sm" onClick={() =>
            setPage(p => p && ({ ...p, services: { ...p.services, items: addItem<ServiceItem>(p.services.items, { icon: 'bi-star', title: '', desc: '' }) } }))}>
            <i className="bi bi-plus me-1"></i>Add Card
          </button>
        </SectionCard>

        {/* ── Process ── */}
        <SectionCard title="Development Process" icon="bi-list-ol" onSave={() => save('process', process)} saving={saving === 'process'}>
          <Field label="Section heading" value={process.heading} onChange={v => setPage(p => p && ({ ...p, process: { ...p.process, heading: v } }))} />
          <Field label="Section subheading" value={process.subheading} onChange={v => setPage(p => p && ({ ...p, process: { ...p.process, subheading: v } }))} />
          <hr />
          {process.items.map((item, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-muted small">Step {i + 1}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() =>
                  setPage(p => p && ({ ...p, process: { ...p.process, items: removeItem(p.process.items, i) } }))}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <Field label="Step title" value={item.title}
                onChange={v => setPage(p => p && ({ ...p, process: { ...p.process, items: updateItem<ProcessItem>(p.process.items, i, 'title', v) } }))} />
              <Field label="Step description" value={item.desc} textarea
                onChange={v => setPage(p => p && ({ ...p, process: { ...p.process, items: updateItem<ProcessItem>(p.process.items, i, 'desc', v) } }))} />
            </div>
          ))}
          <button className="btn btn-outline-primary btn-sm" onClick={() =>
            setPage(p => p && ({ ...p, process: { ...p.process, items: addItem<ProcessItem>(p.process.items, { title: '', desc: '' }) } }))}>
            <i className="bi bi-plus me-1"></i>Add Step
          </button>
        </SectionCard>

        {/* ── Why Us ── */}
        <SectionCard title="Why Choose Us" icon="bi-patch-check" onSave={() => save('why_us', why_us)} saving={saving === 'why_us'}>
          <Field label="Section heading" value={why_us.heading} onChange={v => setPage(p => p && ({ ...p, why_us: { ...p.why_us, heading: v } }))} />
          <Field label="Section subheading" value={why_us.subheading} onChange={v => setPage(p => p && ({ ...p, why_us: { ...p.why_us, subheading: v } }))} />
          <hr />
          {why_us.items.map((item, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-muted small">Item {i + 1}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() =>
                  setPage(p => p && ({ ...p, why_us: { ...p.why_us, items: removeItem(p.why_us.items, i) } }))}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="row g-2">
                <div className="col-md-4">
                  <Field label="Icon class" value={item.icon}
                    onChange={v => setPage(p => p && ({ ...p, why_us: { ...p.why_us, items: updateItem<WhyUsItem>(p.why_us.items, i, 'icon', v) } }))}
                    hint="e.g. bi-award" />
                </div>
                <div className="col-md-8">
                  <Field label="Title" value={item.title}
                    onChange={v => setPage(p => p && ({ ...p, why_us: { ...p.why_us, items: updateItem<WhyUsItem>(p.why_us.items, i, 'title', v) } }))} />
                </div>
              </div>
              <Field label="Description" value={item.desc} textarea
                onChange={v => setPage(p => p && ({ ...p, why_us: { ...p.why_us, items: updateItem<WhyUsItem>(p.why_us.items, i, 'desc', v) } }))} />
            </div>
          ))}
          <button className="btn btn-outline-primary btn-sm" onClick={() =>
            setPage(p => p && ({ ...p, why_us: { ...p.why_us, items: addItem<WhyUsItem>(p.why_us.items, { icon: 'bi-star', title: '', desc: '' }) } }))}>
            <i className="bi bi-plus me-1"></i>Add Item
          </button>
        </SectionCard>

        {/* ── FAQ ── */}
        <SectionCard title="FAQ" icon="bi-question-circle" onSave={() => save('faq', faq)} saving={saving === 'faq'}>
          <Field label="Section heading" value={faq.heading} onChange={v => setPage(p => p && ({ ...p, faq: { ...p.faq, heading: v } }))} />
          <Field label="Section subheading" value={faq.subheading} onChange={v => setPage(p => p && ({ ...p, faq: { ...p.faq, subheading: v } }))} />
          <hr />
          {faq.items.map((item, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-muted small">Q&A {i + 1}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() =>
                  setPage(p => p && ({ ...p, faq: { ...p.faq, items: removeItem(p.faq.items, i) } }))}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <Field label="Question" value={item.q}
                onChange={v => setPage(p => p && ({ ...p, faq: { ...p.faq, items: updateItem<FaqItem>(p.faq.items, i, 'q', v) } }))} />
              <Field label="Answer" value={item.a} textarea
                onChange={v => setPage(p => p && ({ ...p, faq: { ...p.faq, items: updateItem<FaqItem>(p.faq.items, i, 'a', v) } }))} />
            </div>
          ))}
          <button className="btn btn-outline-primary btn-sm" onClick={() =>
            setPage(p => p && ({ ...p, faq: { ...p.faq, items: addItem<FaqItem>(p.faq.items, { q: '', a: '' }) } }))}>
            <i className="bi bi-plus me-1"></i>Add Q&A
          </button>
        </SectionCard>

        {/* ── CTA ── */}
        <SectionCard title="CTA Banner" icon="bi-megaphone-fill" onSave={() => save('cta', cta)} saving={saving === 'cta'}>
          <Field label="Heading" value={cta.heading} onChange={v => setPage(p => p && ({ ...p, cta: { ...p.cta, heading: v } }))} />
          <Field label="Subheading" value={cta.subheading} onChange={v => setPage(p => p && ({ ...p, cta: { ...p.cta, subheading: v } }))} textarea />
          <div className="row g-3">
            <div className="col-md-6">
              <Field label="Button text" value={cta.btn_text} onChange={v => setPage(p => p && ({ ...p, cta: { ...p.cta, btn_text: v } }))} />
            </div>
            <div className="col-md-6">
              <Field label="Button URL" value={cta.btn_url} onChange={v => setPage(p => p && ({ ...p, cta: { ...p.cta, btn_url: v } }))} />
            </div>
          </div>
        </SectionCard>

        {/* Preview link */}
        <div className="text-center py-3">
          <a href="/services/shopify-development" target="_blank" rel="noopener noreferrer"
            className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-box-arrow-up-right me-1"></i>Preview live page
          </a>
        </div>

      </div>
    </div>
  );
}
