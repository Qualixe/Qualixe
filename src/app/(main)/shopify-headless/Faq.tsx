'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Do I need to migrate my existing product data?',
    a: 'No — we connect directly to your existing Shopify backend, so your products, inventory, and orders stay exactly where they are.',
  },
  {
    q: 'Will my SEO rankings be affected?',
    a: 'We plan URL structure and redirects carefully during migration specifically to protect your existing rankings.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most clients see measurable speed improvements immediately at launch, with conversion impact visible within the first few weeks.',
  },
  {
    q: "What's included after launch?",
    a: '30 days of post-launch support is included with every project to handle bug fixes and adjustments.',
  },
  {
    q: 'Do you work with my current Shopify plan?',
    a: "Yes — headless works with Shopify Basic through Plus, we'll confirm compatibility during the discovery call.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="sh-faq-list">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className="sh-faq-item" key={item.q}>
            <button
              type="button"
              className={`sh-faq-question ${isOpen ? 'open' : ''}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`sh-faq-answer-${i}`}
              id={`sh-faq-question-${i}`}
            >
              <span>{item.q}</span>
              <i className="bi bi-chevron-down" aria-hidden="true" />
            </button>
            <div
              className={`sh-faq-answer ${isOpen ? 'open' : ''}`}
              id={`sh-faq-answer-${i}`}
              role="region"
              aria-labelledby={`sh-faq-question-${i}`}
            >
              <div className="sh-faq-answer-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
