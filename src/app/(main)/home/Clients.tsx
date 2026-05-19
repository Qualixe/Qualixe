"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
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

        {loading ? (
          <div className="clients-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="clients-skeleton-item" />
            ))}
          </div>
        ) : (
          <div className="clients-grid">
            {clients.map((c) => (
              <a
                key={c.id}
                href={c.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="clients-logo"
                aria-label={c.name}
                style={c.background_color ? { background: c.background_color, borderColor: c.background_color } : undefined}
              >
                <div className="clients-logo-inner">
                  <Image
                    src={c.logo_url}
                    alt={c.name}
                    width={140}
                    height={60}
                    className="clients-logo__img"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientsGrid;
