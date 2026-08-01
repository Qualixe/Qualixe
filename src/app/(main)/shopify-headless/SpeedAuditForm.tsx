'use client';

import { useState } from 'react';
import { z } from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpeedAuditFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  store_url: z.string().min(1, { message: 'Company / store URL is required' }),
  message: z.string().optional(),
});

type SpeedAuditFormData = z.infer<typeof SpeedAuditFormSchema>;
type FormErrors = { [key in keyof SpeedAuditFormData]?: string };

const initialForm: SpeedAuditFormData = {
  name: '',
  email: '',
  store_url: '',
  message: '',
};

export default function SpeedAuditForm() {
  const [form, setForm] = useState<SpeedAuditFormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const fieldSchema = SpeedAuditFormSchema.shape[name as keyof SpeedAuditFormData];
    const result = fieldSchema.safeParse(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (!result.success) {
        next[name as keyof SpeedAuditFormData] = result.error.issues[0].message;
      } else {
        delete next[name as keyof SpeedAuditFormData];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = SpeedAuditFormSchema.safeParse(form);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof SpeedAuditFormData] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/speed-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Submission failed');
      } else {
        setSubmitted(true);
        setForm(initialForm);
      }
    } catch {
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="sh-form-success" role="status">
        <i className="bi bi-check-circle-fill" aria-hidden="true" />
        <h3>Thanks — request received</h3>
        <p>We&apos;ll take a look at your store and get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="sh-lead-form" onSubmit={handleSubmit} noValidate>
      <ToastContainer position="top-right" />
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="sh-name" className="form-label">Name</label>
          <input
            id="sh-name"
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'sh-name-error' : undefined}
          />
          {errors.name && <p id="sh-name-error" className="text-danger">{errors.name}</p>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="sh-email" className="form-label">Email</label>
          <input
            id="sh-email"
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'sh-email-error' : undefined}
          />
          {errors.email && <p id="sh-email-error" className="text-danger">{errors.email}</p>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <label htmlFor="sh-store-url" className="form-label">Company / Store URL</label>
          <input
            id="sh-store-url"
            type="text"
            name="store_url"
            className="form-control"
            placeholder="yourstore.com"
            value={form.store_url}
            onChange={handleChange}
            aria-invalid={!!errors.store_url}
            aria-describedby={errors.store_url ? 'sh-store-url-error' : undefined}
          />
          {errors.store_url && <p id="sh-store-url-error" className="text-danger">{errors.store_url}</p>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <label htmlFor="sh-message" className="form-label">Message <span className="sh-optional">(optional)</span></label>
          <textarea
            id="sh-message"
            name="message"
            className="form-control"
            rows={4}
            value={form.message}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Submitting...' : 'Request Free Speed Audit'}
        </button>
      </div>
    </form>
  );
}
