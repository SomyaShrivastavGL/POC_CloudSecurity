import React, { Component } from 'react';

import './App.css';

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
class Login extends Component {

    constructor() {

        super();


        this.state = {

            Email: '',

            Password: ''

        }


        this.Password = this.Password.bind(this);

        this.Email = this.Email.bind(this);

        this.login = this.login.bind(this);

    }


    Email(event) {

        this.setState({ Email: event.target.value })

    }

    Password(event) {
        this.setState({ Password: event.target.value })

    }

    login(event) {
        

        fetch('http://localhost:51282/Api/login/Login', {

            method: 'post',

            headers: {

                'Accept': 'application/json',

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                Email: this.state.Email,

                Password: this.state.Password

            })

        }).then((Response) => Response.json())

            .then((result) => {

                console.log(result);

                if (result.Status === 'Invalid')

                    alert('Invalid User');

                else
                  alert("yes");
                   this.props.history.push("/Dashboard");

            })

    }


    render() {


        return (

            <div className="app flex-row align-items-center">

                <Container>

                    <Row className="justify-content-center">

                        <Col md="9" lg="7" xl="6">


                            <CardGroup>

                                <Card className="p-2">

                                    <CardBody>

                                        <Form>

                                            <div  className="sub-heading">

                                                Login

                                            </div>

                                            <InputGroup className="mb-3">


                                                <Input type="text" placeholder="Enter Email" />

                                            </InputGroup>

                                            <InputGroup className="mb-4">


                                                <Input type="password" placeholder="Enter Password" />

                                            </InputGroup>

                                            {/* <Button  color="success" block onClick={this.login}>Login</Button>  */}
                                            <Link onClick={this.login} to="/Profile" className="actionBtn">Login</Link>                                           

                                        </Form>

                                    </CardBody>

                                </Card>

                            </CardGroup>

                        </Col>

                    </Row>

                </Container>

            </div>

        );

    }

}


export default Login;
