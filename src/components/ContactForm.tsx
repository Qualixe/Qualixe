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
  phone: z.string().regex(/^\d{11}$/, { message: "Invalid phone number" }).optional(),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }).regex(/^[a-zA-Z\s]*$/, { message: "State must contain only letters and spaces" }),
  zip_code: z.string().regex(/^[0-9]{4}$/, { message: "Zip code must be 4 digits" }),
  company_name: z.string().optional(),
  note: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
type FormErrors = { [key in keyof ContactFormData]?: string };

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    zip_code: "",
    company_name: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const fieldSchema = ContactFormSchema.pick({ [name as keyof ContactFormData]: true });
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
      const { error } = await supabase
        .from("contacts")
        .insert([result.data]);

      if (error) {
        toast.error(error.message || "Submission failed");
        console.log(error);
      } else {
        toast.success("Message sent successfully!");
        setForm({
          full_name: "",
          email: "",
          phone: "",
          country: "",
          state: "",
          zip_code: "",
          company_name: "",
          note: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              className="form-control"
              value={form.full_name}
              onChange={handleChange}
            />
            {errors.full_name && <p className="text-danger">{errors.full_name}</p>}
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-danger">{errors.phone}</p>}
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="country"
              className="form-control"
              value={form.country}
              onChange={handleChange}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-danger">{errors.country}</p>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="state"
              placeholder="State"
              className="form-control"
              value={form.state}
              onChange={handleChange}
            />
            {errors.state && <p className="text-danger">{errors.state}</p>}
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="number"
              name="zip_code"
              placeholder="Zip Code"
              className="form-control"
              value={form.zip_code}
              onChange={handleChange}
            />
            {errors.zip_code && <p className="text-danger">{errors.zip_code}</p>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              className="form-control"
              value={form.company_name}
              onChange={handleChange}
            />
            {errors.company_name && <p className="text-danger">{errors.company_name}</p>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <textarea
              name="note"
              placeholder="Note"
              className="form-control"
              value={form.note}
              onChange={handleChange}
            />
            {errors.note && <p className="text-danger">{errors.note}</p>}
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
