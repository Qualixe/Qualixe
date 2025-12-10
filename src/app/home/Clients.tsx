// ClientsGrid.jsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import './Clients.css';

const clients = [
    {   "id":"jotey",
        "name" : "Jotey",
        "image" : "assets/img/jotey.svg",
        "url" : "https://www.jotey.com.bd",
        "color":"default"
    },
    {   "id":"nilima",
        "name" : "Nilima",
        "image" : "assets/img/nilima.svg",
        "url" : "https://nilima.com.bd",
        "color":"default"
    },
    {   "id":"zuqo",  
        "name" : "Zuqo",
        "image" : "assets/img/zuqo.webp",
        "url" : "https://zuqo.shop",
        "color":"default"
    },
    {   "id":"maralab",
        "name" : "Mara-Lab",
        "image" : "assets/img/maralab.webp",
        "url" : "https://mara-labs.com",
        "color":"default"
    },
    {   "id":"htbazar",
        "name" : "HT-bazar",
        "image" : "assets/img/htbazar.avif",
        "url" : "https://htbazar.com/",
        "color":"default"
    },
    {   "id":"flemingoo",
        "name" : "Flemingoo",
        "image" : "assets/img/flemingoo.avif",
        "url" : "hhttps://flemingoo.com/",
        "color":"default"
    },
    {   "id":"bosphorus",
        "name" : "Bosphorus Fashion",
        "image" : "assets/img/bosphorus.avif",
        "url" : "https://bosphorusfashion.com/",
        "color":"default"
    },
    {   "id":"moiasun",
        "name" : "Moiasun",
        "image" : "assets/img/moiasun.avif",
        "url" : "https://moiasun.com/",
        "color":"default"
    },
    {   "id":"crimsoncup",
        "name" : "Crimsoncup",
        "image" : "assets/img/crimsonCup1.png",
        "url" : "https://crimsoncupbangladesh.com/",
        "color":"default"
    },{
      "id":"diagram",
      "name" : "DiaGram",
      "image" : "assets/img/diagram.png",
      "url" : "https://diagram.com/",
      "color":"white"
    },{
      "id":"flamingo",
      "name":"Flamingo",
      "image":"assets/img/Flamingo's1.jpg",
      "url":"https://pre-flamingosbd.com/",
      "color":"default"
    },{
      "id":"glenari",
      "name":"Glenari",
      "image":"assets/img/glenari.png",
      "url":"https://www.glenari.com/",
      "color":"default"
    },{
      "id":"nalinideslights",
      "name":"nalinideslights",
      "image":"assets/img/nalinideslights1.png",
      "url":"https://nalinidelights.com/",
      "color":"default"
    },{
      "id":"novonordisk",
      "name":"Novo Nordisk",
      "image":"assets/img/novo nordisk1.avif",
      "url":"https://www.diabeteslifebd.com/",
      "color":"whtie"
    },{
      "id":"solar",
      "name":"Solar",
      "image":"assets/img/solar.png",
      "url":"https://solarlifestylebd.com/",
      "color":"whtie"
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
            <div key={i} id={c.id} className={c.color === "default" ? "client-item" : "client-item white"}>
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