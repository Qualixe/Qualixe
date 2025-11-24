import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './About.css'
import Image from 'react-bootstrap/Image'

function About() {
  return (
    <div className='about-section'>
        <Container>
            <Row>
                <Col lg={6} xs={12}>
                    <div className='about-image'>
                        <Image src={"./assets/img/about.jpeg"} className='about-img' />
                    </div>
                </Col>
                <Col lg={6} xs={12} className='my-auto ps-lg-5'>
                    <div className='about-contents'>
                        <h3 className='about-subheading sub-heading'>About Us</h3>
                        <h1 className='about-heading heading'>We are here to make your dream e-commerce store</h1>
                        <div className='about-content text'>
                            <p>
                            We strengthen our expertise in developing eCommerce stores. We are the best e-commerce service provider in Bangladesh. To connect separate systems, to enable automated data exchange.
                            </p>    
                        </div>
                        <h4 className='about-why-choose'>Why choose us?</h4>
                        <ul className='about-list'>
                            <li>✔ Client satisfaction is our goal.</li>
                            <li>✔ We have a very talented genius team.</li>
                            <li>✔ We provide the best solution for you. </li>
                        </ul>
                    </div>
                </Col>
            </Row>
           
        </Container>
    </div>
    
  )
}

export default About
