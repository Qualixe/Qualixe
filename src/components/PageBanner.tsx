import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './PageBanner.css'

function PageBanner(props:{heading: string}) {
    const {heading} = props
  return (
    <div className='pagebanner-section'>
        <Container> 
            <Row>
                <Col>
                    <div className='pagebanner-content'>
                        <h1 className='pagebanner-heading heading text-center'>{heading}</h1>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default PageBanner
