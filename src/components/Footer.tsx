import Image from "next/image";
import Link from "next/link";
import { Mail, Headphones, MapPin, Facebook, Linkedin } from "lucide-react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Footer.css";
export default function Footer() {

  return (
         <div className='footer-section'>
            <Container>
                <Row>
                    <Col lg={3} md={3} sm={12}> 
                        <Image src={'/assets/img/logo.png'} alt='img' className='footer__logo' width={100} height={50} />
                        <p className='footer-text'>
                            We are best e-commerce solution company in bangladesh on shopify CMS platform. We have amazing and experience team members. so let&apos;s contact with us.
                        </p>
                    </Col> 
                    <Col lg={3} md={3} sm={12} className='ps-lg-5'> 
                        <h3 className='footer-heading'>Quick links</h3>
                        <ul className='footer-nav'>
                            <li><Link href={'/'}>Home</Link></li>
                            <li><Link href={'/about'}>About</Link></li>
                            <li><Link href={'/services'}>Services</Link></li>
                            <li><Link href={'/portfolio'}>Portfolio</Link></li>
                        </ul>
                    </Col> 
                    <Col lg={3} md={3} sm={12}> 
                        <h3 className='footer-heading'>Contact Us</h3>
                        <ul className='footer-contact'>
                            <li><Link href={'mailhref:qualixe.info@gmail.com'}><Mail size={24} /> <span>qualixe.info@gmail.com</span></Link></li>
                            <li><Link href={'tel:+8801318552266'}><Headphones size={24} /> <span>+88 01318 55 22 66</span></Link></li>
                            <li><Link href={'#'}><MapPin  size={24} /> <span>House-06, Road-3, Mirpur-11, Dhaka, Bangladesh</span> </Link></li>
                        </ul>
                    </Col> 
                    <Col lg={3} md={3} sm={12}> 
                        <h3 className='footer-heading'>Follow Us</h3>
                        <ul className='footer-social'>
                            <li><Link href={'https://www.facebook.com/qualixe'} target='_blank'><Facebook size={35} /></Link></li>
                            <li><Link href={'https://www.linkedin.com/company/qualixe'} target='_blank'><Linkedin size={35}/></Link></li>
                        </ul>
                    </Col> 
                </Row>
            </Container>
            <div className='footer-copyright'>
                <Row>
                    <Col className='text-center'>
                        <p className='copy-right'> 
                        ©{ new Date().getFullYear()} All Rights Reserved. With Design by <Link href={'/'} target='_blank'>Habib Rayan</Link>
                        </p>
                    </Col>
                </Row>
            </div>
      </div>
  );
}
