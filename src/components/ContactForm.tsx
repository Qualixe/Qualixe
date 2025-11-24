"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { supabase } from "../../lib/supabaseClient";
import "./ContactForm.css";

const ContactFormSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" })
    .regex(/[a-zA-Z]/, { message: "Full name must contain at least one letter" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(/^[0-9+-\s()]*$/, { message: "Invalid phone number" }).optional(),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip_code: z.string().regex(/^[0-9]*$/, { message: "Zip code must be a number" }),
  company_name: z.string().optional(),
  note: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = ContactFormSchema.safeParse(form);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
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
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="form-control"
              value={form.country}
              onChange={handleChange}
            />
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
