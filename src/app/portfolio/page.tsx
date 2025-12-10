"use client"
import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import './portfolio.css';
import { FaEye } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import SkeletonCard from "./Skeleton";
import ClientsGrid from "../home/Clients";

interface PortfolioItem {
  id: number;
  name: string;
  image: string;
  url: string;
}

const portfolios: PortfolioItem[] = [
  { id: 1, name: "Jotey", image: "/assets/img/portfolio-jotery.jpg", url: "https://www.jotey.com.bd" },
  { id: 2, name: "Zuqo", image: "/assets/img/portfolio-zuqo.jpg", url: "https://zuqo.shop" },
  { id: 3, name: "Mara-Lab", image: "/assets/img/portfolio-maralab.jpg", url: "https://mara-labs.com" },
  { id: 4, name: "HT-bazar", image: "/assets/img/portfolio-htbazar.jpg", url: "https://htbazar.com/" },
  { id: 5, name: "Spirulinabecagli", image: "/assets/img/portfolio-spiru.jpg", url: "https://spirulinabecagli.it/" },
  { id: 6, name: "Nilima", image: "/assets/img/portfolio-nilima.jpg", url: "https://nilima.com.bd" },
  { id: 7, name: "Flemingoo", image: "/assets/img/portfolio-flemi.jpg", url: "https://flemingoo.com/" },
  { id: 8, name: "South Asian Strong", image: "/assets/img/portfolio-southasia.jpg", url: "https://transform.southasianstrong.com/" },
  { id: 9, name: "Moiasun", image: "/assets/img/portfolio-ahaneon.jpg", url: "https://www.ahaneon.com" }
];

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div className="page-portfolio">
      <PageBanner heading="Our Latest Creative Endeavors" />
      <div className="page-portfolio-content">
        <div className='portfolio-section'>
          <Container>
            <Row>
              {loading
                ? Array.from({ length: portfolios.length }).map((_, index) => (
                    <Col key={index} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                      <SkeletonCard />
                    </Col>
                  ))
                : portfolios.map((item) => (
                    <Col key={item.id} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                      <a href={item.url} target='_blank' rel="noopener noreferrer" className='portfolio-item-link'>
                        <Image src={item.image} alt={item.name} className='portfolio-img' width={400} height={500}/>
                        <span className='portfolio-btn'>
                          <FaEye />
                          <span>View Live</span>
                        </span>
                        <span className='portfolio-item-overly'></span>
                      </a>
                    </Col>
                  ))}
            </Row>
          </Container>
        </div>
      </div>
    </div>
    <ClientsGrid />
    </>
  );
}

export default Page;