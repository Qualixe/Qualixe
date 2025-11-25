// ClientsGrid.jsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import './Clients.css';

const clients = [
    {
        "name" : "Jotey",
        "image" : "assets/img/jotey.svg",
        "url" : "https://www.jotey.com.bd"
    },
    {
        "name" : "Nilima",
        "image" : "assets/img/nilima.svg",
        "url" : "https://nilima.com.bd"
    },
    {
        "name" : "Zuqo",
        "image" : "assets/img/zuqo.webp",
        "url" : "https://zuqo.shop"
    },
    {
        "name" : "Mara-Lab",
        "image" : "assets/img/maralab.webp",
        "url" : "https://mara-labs.com"
    },
    {
        "name" : "HT-bazar",
        "image" : "assets/img/htbazar.avif",
        "url" : "https://htbazar.com/"
    },
    {
        "name" : "Flemingoo",
        "image" : "assets/img/flemingoo.avif",
        "url" : "hhttps://flemingoo.com/"
    },
    {
        "name" : "Bosphorus Fashion",
        "image" : "assets/img/bosphorus.avif",
        "url" : "https://bosphorusfashion.com/"
    },
    {
        "name" : "Moiasun",
        "image" : "assets/img/moiasun.avif",
        "url" : "https://moiasun.com/"
    }
];


function ClientsGrid() {
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
          {clients.map((c, i) => (
            <div key={i} className="client-item">
              <Link href={c.url} target="_blank" rel="noopener noreferrer">
                <Image src={c.image} className="client-img" alt="client" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default ClientsGrid;