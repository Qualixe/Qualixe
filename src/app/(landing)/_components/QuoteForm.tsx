'use client';

import { useState } from 'react';

import WhatsAppIcon from './WhatsAppIcon';
import { BUDGET_OPTIONS, GOOGLE_SHEET_WEBHOOK_URL, THANK_YOU_PATH, whatsappUrl } from '../landing.config';
import { LEAD_FLAG_KEY } from '../tracking';

const BUSINESS_TYPES = [
  'Fashion / Clothing',
  'Beauty / Cosmetics',
  'Electronics / Gadget',
  'Food',
  'Home & Lifestyle',
  'অন্যান্য',
];

const MARKETING_ONLY = 'Digital Marketing';
const SERVICES_NEEDED = [
  'নতুন e-commerce website',
  'আগের website upgrade',
  MARKETING_ONLY,
  'Website + Marketing দুটোই',
];

const PLATFORMS = ['WordPress (WooCommerce)', 'Shopify', 'Custom', 'নিশ্চিত না, পরামর্শ চাই'];
const PRODUCT_COUNTS = ['১–৫০', '৫০–২০০', '২০০+'];
// Keep "শুধু জানতে চাই" in sync with COLD_TIMELINE in google-apps-script/leads.gs.
const TIMELINES = ['এই মাসেই', '১–৩ মাসের মধ্যে', 'শুধু জানতে চাই'];

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;
const SUBMIT_TIMEOUT_MS = 20000;

const REQUIRED_MSG = 'এই তথ্যটি দিন';
const CHOOSE_MSG = 'একটি বেছে নিন';

const initialValues = {
  name: '',
  whatsapp: '',
  business_name: '',
  business_link: '',
  business_type: '',
  service_needed: '',
  platform: '',
  product_count: '',
  budget: '', // holds the tier key; the label is sent alongside it
  timeline: '',
  message: '',
};

type Values = typeof initialValues;
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

// Order matters: the first key with an error is the one scrolled to.
const FIELD_ORDER: Field[] = [
  'name',
  'whatsapp',
  'business_name',
  'business_link',
  'business_type',
  'service_needed',
  'platform',
  'product_count',
  'budget',
  'timeline',
  'message',
];

const normalizePhone = (value: string) => value.replace(/[\s\-()]/g, '');

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = REQUIRED_MSG;

  if (!values.whatsapp.trim()) errors.whatsapp = REQUIRED_MSG;
  else if (!BD_PHONE.test(normalizePhone(values.whatsapp))) errors.whatsapp = 'সঠিক WhatsApp নম্বর দিন';

  if (!values.business_name.trim()) errors.business_name = REQUIRED_MSG;

  const link = values.business_link.trim();
  if (!link) errors.business_link = REQUIRED_MSG;
  else if (!link.includes('.') && !/^http/i.test(link)) errors.business_link = 'সঠিক link দিন';

  if (!values.business_type) errors.business_type = CHOOSE_MSG;
  if (!values.service_needed) errors.service_needed = CHOOSE_MSG;
  if (values.service_needed !== MARKETING_ONLY && !values.platform) errors.platform = CHOOSE_MSG;
  if (!values.budget) errors.budget = CHOOSE_MSG;
  if (!values.timeline) errors.timeline = CHOOSE_MSG;

  return errors;
}

export default function QuoteForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const showPlatform = values.service_needed !== MARKETING_ONLY;

  const setField = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Before the first submit attempt stay quiet; afterwards keep errors live.
    if (attempted) setErrors(validate(next));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setField(e.target.name as Field, e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const found = validate(values);
    setErrors(found);
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      const el = document.getElementById(`qf-${firstInvalid}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const budget = BUDGET_OPTIONS.find((option) => option.tier === values.budget);

    const payload = {
      name: values.name.trim(),
      whatsapp: normalizePhone(values.whatsapp),
      business_name: values.business_name.trim(),
      business_link: values.business_link.trim(),
      business_type: values.business_type,
      service_needed: values.service_needed,
      platform: showPlatform ? values.platform : '',
      product_count: values.product_count,
      budget: budget?.label ?? '',
      budget_tier: values.budget,
      timeline: values.timeline,
      message: values.message.trim(),
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content: params.get('utm_content') ?? '',
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    setLoading(true);
    setSubmitError(false);

    try {
      if (!GOOGLE_SHEET_WEBHOOK_URL) throw new Error('GOOGLE_SHEET_WEBHOOK_URL is not set');

      // text/plain keeps this a "simple" CORS request — Apps Script web apps
      // cannot answer the preflight that application/json would trigger.
      const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      });
      const data = await res.json();
      if (!res.ok || data.result !== 'success') throw new Error(data.message || 'Sheet write failed');

      try {
        sessionStorage.setItem(LEAD_FLAG_KEY, '1');
      } catch {
        // storage blocked (private mode) — the thank-you page just skips the conversion events
      }
      // Full page load (not router.push) so the pixel/gtag PageView fires normally.
      // `loading` stays true on purpose: the button remains disabled until we leave.
      window.location.assign(THANK_YOU_PATH);
    } catch (err) {
      console.error('Quote form submission failed:', err);
      setSubmitError(true);
      setLoading(false);
    }
  };

  // If the sheet is unreachable, hand the answers to WhatsApp so the lead is not lost.
  const fallbackUrl = whatsappUrl(
    [
      'আসসালামু আলাইকুম, আমি e-commerce website নিয়ে জানতে চাই।',
      values.name.trim() && `নাম: ${values.name.trim()}`,
      values.business_name.trim() && `Business: ${values.business_name.trim()}`,
      values.business_link.trim() && `Link: ${values.business_link.trim()}`,
      values.service_needed && `দরকার: ${values.service_needed}`,
    ]
      .filter(Boolean)
      .join('\n')
  );

  const errorProps = (field: Field) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `qf-${field}-error` : undefined,
  });

  const renderError = (field: Field) =>
    errors[field] ? (
      <p className="lp-field__error" id={`qf-${field}-error`} role="alert">
        {errors[field]}
      </p>
    ) : null;

  const renderRadios = (field: Field, legend: string, options: string[]) => (
    <fieldset
      className="lp-field lp-field--full"
      id={`qf-${field}`}
      tabIndex={-1}
      aria-describedby={errors[field] ? `qf-${field}-error` : undefined}
    >
      <legend>
        {legend} <span aria-hidden="true">*</span>
      </legend>
      <div className="lp-choices">
        {options.map((option) => (
          <label key={option} className="lp-choice">
            <input
              type="radio"
              name={field}
              value={option}
              checked={values[field] === option}
              onChange={handleChange}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {renderError(field)}
    </fieldset>
  );

  return (
    <form className="lp-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-field">
        <label htmlFor="qf-name">
          আপনার নাম <span aria-hidden="true">*</span>
        </label>
        <input
          id="qf-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          {...errorProps('name')}
        />
        {renderError('name')}
      </div>

      <div className="lp-field">
        <label htmlFor="qf-whatsapp">
          WhatsApp নম্বর <span aria-hidden="true">*</span>
        </label>
        <input
          id="qf-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          value={values.whatsapp}
          onChange={handleChange}
          {...errorProps('whatsapp')}
        />
        {renderError('whatsapp')}
      </div>

      <div className="lp-field">
        <label htmlFor="qf-business_name">
          Business-এর নাম <span aria-hidden="true">*</span>
        </label>
        <input
          id="qf-business_name"
          name="business_name"
          type="text"
          autoComplete="organization"
          value={values.business_name}
          onChange={handleChange}
          {...errorProps('business_name')}
        />
        {renderError('business_name')}
      </div>

      <div className="lp-field">
        <label htmlFor="qf-business_link">
          Facebook page বা website link <span aria-hidden="true">*</span>
        </label>
        <input
          id="qf-business_link"
          name="business_link"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="facebook.com/yourpage"
          value={values.business_link}
          onChange={handleChange}
          {...errorProps('business_link')}
        />
        {renderError('business_link')}
      </div>

      <div className="lp-field lp-field--full">
        <label htmlFor="qf-business_type">
          Business-এর ধরন <span aria-hidden="true">*</span>
        </label>
        <select
          id="qf-business_type"
          name="business_type"
          value={values.business_type}
          onChange={handleChange}
          {...errorProps('business_type')}
        >
          <option value="">বেছে নিন</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {renderError('business_type')}
      </div>

      {renderRadios('service_needed', 'আপনার কী দরকার?', SERVICES_NEEDED)}

      {showPlatform && renderRadios('platform', 'কোন platform-এ website চান?', PLATFORMS)}

      <div className="lp-field">
        <label htmlFor="qf-product_count">আনুমানিক কতগুলো product থাকবে?</label>
        <select
          id="qf-product_count"
          name="product_count"
          value={values.product_count}
          onChange={handleChange}
        >
          <option value="">বেছে নিন (ঐচ্ছিক)</option>
          {PRODUCT_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>

      <div className="lp-field">
        <label htmlFor="qf-budget">
          আপনার budget <span aria-hidden="true">*</span>
        </label>
        <select
          id="qf-budget"
          name="budget"
          value={values.budget}
          onChange={handleChange}
          {...errorProps('budget')}
        >
          <option value="">বেছে নিন</option>
          {BUDGET_OPTIONS.map((option) => (
            <option key={option.tier} value={option.tier}>
              {option.label}
            </option>
          ))}
        </select>
        {renderError('budget')}
      </div>

      {renderRadios('timeline', 'কবে শুরু করতে চান?', TIMELINES)}

      <div className="lp-field lp-field--full">
        <label htmlFor="qf-message">আর কিছু জানাতে চান?</label>
        <textarea
          id="qf-message"
          name="message"
          rows={4}
          placeholder="যেমন: আপনার পছন্দের কোনো website-এর link বা বিশেষ feature"
          value={values.message}
          onChange={handleChange}
        />
      </div>

      <div className="lp-form__footer">
        {submitError && (
          <div className="lp-form__alert" role="alert">
            <p>
              দুঃখিত, আপনার তথ্য পাঠানো যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা সরাসরি WhatsApp-এ
              message দিন।
            </p>
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa="form_error"
              className="lp-btn lp-btn--wa"
            >
              <WhatsAppIcon size={18} />
              WhatsApp করুন
            </a>
          </div>
        )}

        <button type="submit" className="lp-btn lp-btn--primary lp-form__submit" disabled={loading}>
          {loading && <span className="lp-spinner" aria-hidden="true" />}
          {loading ? 'পাঠানো হচ্ছে...' : 'Quote পাঠান'}
        </button>

        <p className="lp-form__note">
          আপনার তথ্য শুধু Qualixe team আপনার সাথে যোগাযোগ করতে ব্যবহার করবে।
        </p>
      </div>
    </form>
  );
}
