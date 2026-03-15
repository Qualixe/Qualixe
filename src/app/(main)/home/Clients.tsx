// ClientsGrid.jsx
"use client";
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import './Clients.css';
import { clientsAPI } from '../../../../lib/api/clients';

interface Client {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  industry?: string;
  background_color?: string;
}

function ClientsGrid() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data || []);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="clients-section">
        <Container>
          <div className="text-center">
            <h2 className="cliens-heading heading">Our Valuable Clients</h2>
            <p>Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="clients-section">
      <Container>
        <div className="text-center">
            <h2 className="cliens-heading heading">
              Our Valuable Clients
            </h2>
        </div>

        {/* ----------  GRID  ---------- */}
        <div className="clients-grid">
          {clients.map((c) => (
            <div key={c.id} className="client-item" style={{ backgroundColor: c.background_color || '#f0f9ff' }}>
              <Link href={c.website_url || '#'} target="_blank" rel="noopener noreferrer">
                <div 
                  className="client-logo-bg"
                  
                >
                  <Image src={c.logo_url} className="client-img" alt={c.name} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default ClientsGrid;