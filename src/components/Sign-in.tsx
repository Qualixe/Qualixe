import { Button, Col, Container, Row } from "react-bootstrap";
import "./Sign-in.css";

const SignInForm = () => (

    <form>
        <div className="ezy__signin15_LP9IeSh6-form-card">
            <div className="d-flex w-100">
                <div className="w-50">
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Username"
                    />
                </div>
                <div className="w-50">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                    />
                </div>
            </div>

            <Button variant="" type="submit" className="ezy__signin15_LP9IeSh6-btn w-100">
                SIGN IN
            </Button>
        </div>

        <div className="text-center mt-4">
            <a href="#!">Forget Password ?</a>
        </div>
    </form>
);

const SignIn15_LP9IeSh6 = () => {
    return (
        <section className="ezy__signin15_LP9IeSh6 d-flex align-items-center justify-content-center">
            <Container>
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={6} lg={5}>
                        <div>
                            <h2 className="ezy__signin15_LP9IeSh6-heading mb-5">ACCOUNT LOGIN</h2>
                            <SignInForm />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default SignIn15_LP9IeSh6;