import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import './Hero.css'
import Image from 'react-bootstrap/Image'

function Hero() {
  return (
    <div className='hero-section'>
        <Container> 
            <Row className='column-reverse-sm'>
                <Col lg={7} xs className='my-auto'>
                    <div className='hero-contents'>
                        <h3 className='hero-subheading'>E-Commerce Solution Points</h3>
                        <h1 className='hero-heading'>We build amazing <br /> E-commerce store in shopify</h1>
                        <div className='hero-content'>
                            <p>
                            We strengthen our expertise in developing eCommerce stores. We are the best e-commerce service provider in Bangladesh. To connect separate systems, to enable automated data exchange.
                            </p>    
                        </div>
                        <Link href={'/'} className='button hero-btn'>Get Started</Link>
                    </div>
                </Col>
                <Col lg={5} xs={12}>
                    <div className='hero-image'>
                        <Image src={"/assets/img/hero.png"} className='hero-img' />
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
    
  )
}

export default Hero
