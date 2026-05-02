"use client";
import { useState, useEffect } from 'react';
import './Clients.css';
import { clientsAPI } from '../../../../lib/api/clients';

interface Client {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  background_color?: string;
}

function ClientsGrid() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsAPI.getAll()
      .then(data => setClients(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Duplicate the list so the marquee loops seamlessly
  const track = [...clients, ...clients];

  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-head">
          <span className="clients-label">Trusted By</span>
          <h2 className="clients-heading">Brands That Trust Qualixe</h2>
          <p className="clients-sub">
            We've helped businesses across Bangladesh and beyond build stores that sell.
          </p>
        </div>
      </div>

      {/* Full-width marquee — outside container so it bleeds edge to edge */}
      <div className="clients-marquee-wrap">
        {/* Fade edges */}
        <div className="clients-fade clients-fade--left"  aria-hidden="true" />
        <div className="clients-fade clients-fade--right" aria-hidden="true" />

        {loading ? (
          /* Skeleton strip */
          <div className="clients-skeleton-row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="clients-skeleton-item" />
            ))}
          </div>
        ) : (
          <div className="clients-track" aria-label="Our clients">
            {track.map((c, i) => (
              <a
                key={`${c.id}-${i}`}
                href={c.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="clients-logo"
                aria-label={c.name}
                tabIndex={i >= clients.length ? -1 : 0}
                style={c.background_color ? { background: c.background_color, borderColor: c.background_color } : undefined}
              >
                <img
                  src={c.logo_url}
                  alt={c.name}
                  className="clients-logo__img"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientsGrid;
