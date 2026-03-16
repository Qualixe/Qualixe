"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { supabase } from "../../lib/supabaseClient";
import { countries } from "../../lib/countries";
import "./ContactForm.css";

const ContactFormSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" })
    .regex(/^[a-zA-Z\s]*$/, { message: "Full name must contain only letters and spaces" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(1, { message: "Country is required" }),
  business_name: z.string().optional(),
  business_type: z.string().optional(),
  theme: z.string().optional(),
  budget: z.string().optional(),
  meeting_time: z.string().optional(),
  note: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
type FormErrors = { [key in keyof ContactFormData]?: string };

const BUSINESS_TYPES = [
  "E-commerce", "Fashion & Apparel", "Food & Beverage", "Health & Wellness",
  "Beauty & Cosmetics", "Home & Living", "Electronics", "Sports & Outdoors",
  "Jewelry & Accessories", "Books & Education", "Other",
];

const BUDGETS = [
  "Under $500", "$500 – $1,000", "$1,000 – $2,500",
  "$2,500 – $5,000", "$5,000 – $10,000", "$10,000+",
];

const MEETING_TIMES = [
  "Morning (9am – 12pm)", "Afternoon (12pm – 3pm)",
  "Late Afternoon (3pm – 6pm)", "Evening (6pm – 9pm)",
];

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    full_name: "", email: "", phone: "", address: "", country: "",
    business_name: "", business_type: "", theme: "", budget: "",
    meeting_time: "", note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const fieldSchema = ContactFormSchema.pick({ [name as keyof ContactFormData]: true } as any);
    const result = fieldSchema.safeParse({ [name]: value });
    if (!result.success) {
      setErrors({ ...errors, [name]: result.error.issues[0].message });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name as keyof ContactFormData];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = ContactFormSchema.safeParse(form);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof ContactFormData] = issue.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    setErrors({});
    try {
      const { error } = await supabase.from("contacts").insert([result.data]);
      if (error) {
        toast.error(error.message || "Submission failed");
      } else {
        toast.success("Message sent successfully!");
        setForm({
          full_name: "", email: "", phone: "", address: "", country: "",
          business_name: "", business_type: "", theme: "", budget: "",
          meeting_time: "", note: "",
        });
      }
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="contact-form">

        {/* Personal Info */}
        <p className="form-section-label">Personal Info</p>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" name="full_name" placeholder="Full Name *" className="form-control" value={form.full_name} onChange={handleChange} />
            {errors.full_name && <p className="text-danger">{errors.full_name}</p>}
          </div>
          <div className="col-md-6 mb-3">
            <input type="email" name="email" placeholder="Email *" className="form-control" value={form.email} onChange={handleChange} />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" name="phone" placeholder="Phone" className="form-control" value={form.phone} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <input type="text" name="address" placeholder="Address" className="form-control" value={form.address} onChange={handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-3">
            <select name="country" className="form-control" value={form.country} onChange={handleChange}>
              <option value="">Select Country *</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.country && <p className="text-danger">{errors.country}</p>}
          </div>
        </div>

        {/* Business Info */}
        <p className="form-section-label">Business Info</p>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" name="business_name" placeholder="Business Name" className="form-control" value={form.business_name} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <select name="business_type" className="form-control" value={form.business_type} onChange={handleChange}>
              <option value="">Business Type</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" name="theme" placeholder="Theme (e.g. EcoFusion, UrbanGear)" className="form-control" value={form.theme} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <select name="budget" className="form-control" value={form.budget} onChange={handleChange}>
              <option value="">Budget</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-3">
            <select name="meeting_time" className="form-control" value={form.meeting_time} onChange={handleChange}>
              <option value="">Preferred Meeting Time</option>
              {MEETING_TIMES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <textarea name="note" placeholder="Additional Notes" className="form-control" rows={4} value={form.note} onChange={handleChange} />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
