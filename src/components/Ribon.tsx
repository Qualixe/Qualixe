import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'
import './Ribon.css'
import { TfiHeadphoneAlt } from "react-icons/tfi";

function Ribon() {
  return (
    <div className='ribon-section'>
      <Container>
        <Row>
            <Col lg={7} sm={12} className='my-auto'>
                <h3 className='ribon-heading'>Let&apos;s contact with us</h3>
            </Col>
            <Col lg={5} sm={12} className='text-end'>
                <Link href={'tel:+8801318552266'} className='button ribon-btn'>
                    <span className='ribon-icon'><TfiHeadphoneAlt size={60} /></span>
                   <span> +88 01318 55 22 66</span>
                </Link>
            </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Ribon
