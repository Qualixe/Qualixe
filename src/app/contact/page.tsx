
import PageBanner from '../../components/PageBanner'
import './Contact.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaPhone } from "react-icons/fa6";
import Link from 'next/link';
import { IoIosMail } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import ContactForm from '../../components/ContactForm';


function Contact() {
  return (
    <div className='page-contact'>
       <PageBanner heading='Contact' />

       <div className='contact-section'>
          <Container>
              <Row>
                  <Col lg={4} md={4} sm={12} className='text-center'>
                      <div className='contact-content'>
                          <span className='contact-icon'><FaPhone size={28} /></span>
                          <h3 className='contact-heading'>Phone Number</h3>
                          <Link href={'tel:+88015-481618'} className='contact-link'>+88 01318 55 22 66</Link>
                      </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} className='text-center'>
                      <div className='contact-content'>
                          <span className='contact-icon'><IoIosMail size={28} /></span>
                          <h3 className='contact-heading'>Email Address</h3>
                          <Link href={'mailto:qualixe.info@gmail.com'} className='contact-link'>qualixe.info@gmail.com</Link>
                      </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} className='text-center'>
                      <div className='contact-content'>
                          <span className='contact-icon'><FaMapMarkerAlt size={28} /></span>
                          <h3 className='contact-heading'>Office Location</h3>
                          <Link href={'#'} className='contact-link'>House-06, Road-3, Mirpur-11, Dhaka, BD</Link>
                      </div>
                  </Col>
              </Row>
          </Container>
       </div>

        <div className='contact-form-section py-5'>
            <Container>
                <Row className='justify-content-center'>
                    <Col lg={8}>
                        <h2 className='text-center mb-4'>Get in Touch</h2>
                        <ContactForm />
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
  )
}

export default Contact
