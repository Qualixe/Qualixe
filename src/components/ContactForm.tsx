"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { supabase } from "../../lib/supabaseClient";
import { countries } from "../../lib/countries";
import { themesAPI, Theme } from "../../lib/api/themes";
import "./ContactForm.css";

const ContactFormSchema = z.object({
  full_name: z.string().trim().min(1, { message: "Please enter your name" })
    // Letters from any language (e.g. Bangla), spaces, dots, apostrophes and hyphens
    .regex(/^[\p{L}\p{M}\s.'-]*$/u, { message: "Name can only contain letters and spaces" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(1, { message: "Please select your country" }),
  business_name: z.string().optional(),
  business_type: z.string().optional(),
  theme: z.string().optional(),
  budget: z.string().optional(),
  meeting_time: z.string().optional(),
  note: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
type FieldName = keyof ContactFormData;
type FormErrors = { [key in FieldName]?: string };

const BUSINESS_TYPES = [
  "Clothing", "Fashion & Apparel", "Food & Beverage", "Health & Wellness",
  "Beauty & Cosmetics", "Home & Living", "Electronics", "Sports & Outdoors",
  "Jewelry & Accessories", "Books & Education", "Other",
];

const BUDGETS = [
  "Under $500", "$500 – $1,000", "$1,000 – $2,500",
  "$2,500 – $5,000", "$5,000 – $10,000", "$10,000+",
];

const EMPTY: ContactFormData = {
  full_name: "", email: "", phone: "", address: "", country: "",
  business_name: "", business_type: "", theme: "", budget: "",
  meeting_time: "", note: "",
};

interface ContactFormProps {
  defaultTheme?: string;
}

/** Text/select field with label, leading icon and inline error */
function Field({
  id, label, icon, required, error, children, hint,
}: {
  id: string; label: string; icon: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className={`cf-field${error ? " has-error" : ""}`}>
      <label htmlFor={id} className="cf-label">
        {label} {required && <span className="cf-req" aria-hidden="true">*</span>}
      </label>
      <div className="cf-control">
        <i className={`bi ${icon} cf-icon`} aria-hidden="true" />
        {children}
      </div>
      {error ? (
        <p className="cf-error" id={`${id}-error`} role="alert">
          <i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p className="cf-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export default function ContactForm({ defaultTheme }: ContactFormProps = {}) {
  const [form, setForm] = useState<ContactFormData>({ ...EMPTY, theme: defaultTheme || "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [themes, setThemes] = useState<Theme[]>([]);

  // Keep the theme in sync when opened from a theme card
  const [lastTheme, setLastTheme] = useState(defaultTheme);
  if (defaultTheme !== lastTheme) {
    setLastTheme(defaultTheme);
    if (defaultTheme) setForm((prev) => ({ ...prev, theme: defaultTheme }));
  }

  useEffect(() => {
    themesAPI.getAll().then((t) => setThemes(t ?? [])).catch(() => {});
  }, []);

  const validateField = (name: FieldName, value: string) => {
    const shape = ContactFormSchema.shape[name];
    const result = shape.safeParse(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (result.success) delete next[name];
      else next[name] = result.error.issues[0].message;
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName;
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Only re-validate fields that already show an error — no nagging while typing
    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName;
    if (["full_name", "email", "country"].includes(name)) validateField(name, e.target.value);
  };

  const pickBudget = (b: string) => setForm((prev) => ({ ...prev, budget: prev.budget === b ? "" : b }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = ContactFormSchema.safeParse(form);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as FieldName] = issue.message;
      });
      setErrors(newErrors);
      const first = result.error.issues[0]?.path[0];
      if (first) document.getElementById(`cf-${String(first)}`)?.focus();
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert([result.data]);
      if (error) {
        toast.error(error.message || "Submission failed — please try again.");
      } else {
        setSent(true);
        setForm(EMPTY);
      }
    } catch {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const err = (name: FieldName) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `cf-${name}-error` } : {};

  if (sent) {
    return (
      <div className="cf-card cf-success" role="status">
        <div className="cf-success__icon" aria-hidden="true"><i className="bi bi-check2" /></div>
        <h3 className="cf-success__title">Thanks — your message is on its way!</h3>
        <p className="cf-success__text">
          We&apos;ve received your details and will get back to you shortly with next steps.
          Need a faster reply? Message us on WhatsApp.
        </p>
        <div className="cf-success__actions">
          <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn--wa">
            <i className="bi bi-whatsapp" aria-hidden="true" /> Chat on WhatsApp
          </a>
          <button type="button" className="cf-btn cf-btn--ghost" onClick={() => setSent(false)}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-card">
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="cf-form" noValidate>
        {/* ── 01 About you ── */}
        <fieldset className="cf-section">
          <legend className="cf-legend">
            <span className="cf-legend__num">01</span> About you
          </legend>
          <div className="cf-grid">
            <Field id="cf-full_name" label="Full name" icon="bi-person" required error={errors.full_name}>
              <input id="cf-full_name" type="text" name="full_name" autoComplete="name" placeholder="Jane Doe"
                className="cf-input" value={form.full_name} onChange={handleChange} onBlur={handleBlur} {...err("full_name")} />
            </Field>
            <Field id="cf-email" label="Email" icon="bi-envelope" required error={errors.email}>
              <input id="cf-email" type="email" name="email" autoComplete="email" placeholder="you@company.com"
                className="cf-input" value={form.email} onChange={handleChange} onBlur={handleBlur} {...err("email")} />
            </Field>
            <Field id="cf-phone" label="Phone / WhatsApp" icon="bi-telephone">
              <input id="cf-phone" type="tel" name="phone" autoComplete="tel" placeholder="+880 1XXX-XXXXXX"
                className="cf-input" value={form.phone} onChange={handleChange} />
            </Field>
            <Field id="cf-country" label="Country" icon="bi-globe2" required error={errors.country}>
              <select id="cf-country" name="country" autoComplete="country-name" className={`cf-input cf-select${form.country ? "" : " is-empty"}`}
                value={form.country} onChange={handleChange} onBlur={handleBlur} {...err("country")}>
                <option value="">Select your country</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="cf-span-2">
              <Field id="cf-address" label="Address" icon="bi-geo-alt">
                <input id="cf-address" type="text" name="address" autoComplete="street-address" placeholder="City, area or full address"
                  className="cf-input" value={form.address} onChange={handleChange} />
              </Field>
            </div>
          </div>
        </fieldset>

        {/* ── 02 Your project ── */}
        <fieldset className="cf-section">
          <legend className="cf-legend">
            <span className="cf-legend__num">02</span> Your project
          </legend>
          <div className="cf-grid">
            <Field id="cf-business_name" label="Business name" icon="bi-building">
              <input id="cf-business_name" type="text" name="business_name" autoComplete="organization" placeholder="Your brand or company"
                className="cf-input" value={form.business_name} onChange={handleChange} />
            </Field>
            <Field id="cf-business_type" label="Business type" icon="bi-tags">
              <select id="cf-business_type" name="business_type" className={`cf-input cf-select${form.business_type ? "" : " is-empty"}`} value={form.business_type} onChange={handleChange}>
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field id="cf-theme" label="Theme (optional)" icon="bi-palette">
              <select id="cf-theme" name="theme" className={`cf-input cf-select${form.theme ? "" : " is-empty"}`} value={form.theme} onChange={handleChange}>
                <option value="">No theme / not sure yet</option>
                {themes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </Field>
            <Field id="cf-meeting_time" label="Preferred meeting time" icon="bi-calendar-event">
              <input id="cf-meeting_time" type="datetime-local" name="meeting_time" className="cf-input"
                value={form.meeting_time} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} />
            </Field>
          </div>

          <div className="cf-field cf-budget">
            <span className="cf-label" id="cf-budget-label">Estimated budget</span>
            <div className="cf-chips" role="radiogroup" aria-labelledby="cf-budget-label">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={form.budget === b}
                  className={`cf-chip${form.budget === b ? " is-active" : ""}`}
                  onClick={() => pickBudget(b)}
                >
                  {form.budget === b && <i className="bi bi-check-lg" aria-hidden="true" />}
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="cf-field">
            <label htmlFor="cf-note" className="cf-label">Tell us about your project</label>
            <textarea id="cf-note" name="note" rows={5} className="cf-input cf-textarea"
              placeholder="What are you building, what's the timeline, and is there anything we should know?"
              value={form.note} onChange={handleChange} />
          </div>
        </fieldset>

        <div className="cf-submit">
          <button type="submit" className="cf-btn cf-btn--primary" disabled={loading}>
            {loading ? (
              <><span className="cf-spinner" aria-hidden="true" /> Sending…</>
            ) : (
              <>Send message <span className="cf-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span></>
            )}
          </button>
          <p className="cf-privacy">
            <i className="bi bi-shield-lock" aria-hidden="true" /> Your details are kept private and only used to reply to you.
          </p>
        </div>
      </form>
    </div>
  );
}
