"use client";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import Link from 'next/link';
import './portfolio.css';

const limit = 6;

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

const Portfolio: React.FC = () => {
  const randomView = (arr: PortfolioItem[]): PortfolioItem[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const displayedPortfolios = randomView(portfolios).slice(0, limit);

  return (
    <div className='portfolio-section'>
      <Container>
        <Row>
          <Col>
            <h2 className='portfolio-heading heading text-center'>Latest Creative Work</h2>
          </Col>
        </Row>

        <Row>
          {displayedPortfolios.map((item) => (
            <Col key={item.id} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
              <a href={item.url} target='_blank' rel="noopener noreferrer" className='portfolio-item-link'>
                <Image src={item.image} alt={item.name}  className='portfolio-img' width={400} height={500}/>
                <span className='portfolio-btn'>
                  <FaEye />
                  <span>View Live</span>
                </span>
                <span className='portfolio-item-overly'></span>
              </a>
            </Col>
          ))}
          <Col className='text-center portfolio-button mt-5'>
            <Link href="/portfolio" className='button portfolios-btn'>
              View All
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Portfolio;
