import React from 'react'
import './Services.css'
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import { FaShopify } from "react-icons/fa";
import { BsMegaphone } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";


const services =[
    {
        "heading" : "E-Commerce Development",
        "icon" : "shopify",
        "content" : "Embark on a journey of online success with our cutting-edge E-commerce development services. Specializing in Shopify, we create seamless and visually appealing online storefronts that captivate your audience. From customizing themes to optimizing user experiences, we ensure that your E-commerce platform."
    },
    {
        "heading" : "Digital Marketing",
        "icon" : "digital", 
        "content" : "Crafting visually stunning and user-friendly interfaces is our forte. Our UI/UX design services are geared towards creating digital experiences that resonate with your audience. Whether it's a website, app, or software, our design experts employ the latest trends and technologies to ensure your brand stands out in the crowded digital "
    },
    {
        "heading" : "UI/UX Design",
        "icon" : "code",
        "content" : "In the vast and ever-evolving digital ecosystem, our digital marketing strategies are tailored to amplify your brand's reach and impact. From search engine optimization (SEO) to social media marketing and beyond, we develop and execute campaigns that drive engagement, generate leads, and ultimately boost your bottom line."
    }
]

function Services() {
  
  return (
    <div className='services-section'>
      <Container> 
        <Row>
            <Col>
             <h2 className='services-heading heading text-center'>Our Services</h2>
            </Col>
        </Row>
        <Row>    
          {services.map((service, index)=> (
            <Col key={index} lg={4} md={4} sm={12} className='service-item'>
              <div className='service-item-content'>
                  <span className='service-item-icon'>
                    {service.icon === 'shopify' ? <FaShopify size={70}/>  
                    : service.icon === 'digital' ? <BsMegaphone size={70} />
                    : service.icon === 'code' ? <FaLaptopCode size={70} /> : '' }
                  </span>
                  <h3 className='service-item-heading'>{service.heading}</h3>
                  <p className='service-item-text'>
                  {service.content}
                  </p>
               </div>
            </Col> 
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Services
