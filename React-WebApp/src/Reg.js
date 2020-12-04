import React, { Component } from 'react';

import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';

import { Link } from 'react-router-dom';
class Reg extends Component {

  constructor() {

    super();


    this.state = {

      EmployeeName: '',

      City: '',

      Email: '',

      Password: '',

      Department: ''

    }

    this.Email = this.Email.bind(this);

    this.Password = this.Password.bind(this);

    this.EmployeeName = this.EmployeeName.bind(this);

    this.Password = this.Password.bind(this);

    this.Department = this.Department.bind(this);

    this.City = this.City.bind(this);

    this.register = this.register.bind(this);

  }

  Email(event) {

    this.setState({ Email: event.target.value })

  }


  Department(event) {

    this.setState({ Department: event.target.value })

  }


  Password(event) {

    this.setState({ Password: event.target.value })

  }

  City(event) {

    this.setState({ City: event.target.value })

  }

  EmployeeName(event) {

    this.setState({ EmployeeName: event.target.value })

  }


  register(event) {


    fetch('http://localhost:51282/Api/login/InsertEmployee', {

      method: 'post',

      headers: {

        'Accept': 'application/json',

        'Content-Type': 'application/json'

      },

      body: JSON.stringify({



        EmployeeName: this.state.EmployeeName,

        Password: this.state.Password,

        Email: this.state.Email,

        City: this.state.City,

        Department: this.state.Department

      })

    }).then((Response) => Response.json())

      .then((Result) => {

        if (Result.Status === 'Success')

                this.props.history.push("/Dashboard");

        else

          alert('Sorrrrrry !!!! Un-authenticated User !!!!!')

      })

  }


  render() {


    return (

      <div className="app flex-row align-items-center">

        <Container>

          <Row className="justify-content-center">

            <Col md="9" lg="7" xl="6">

              <Card className="mx-4">

                <CardBody className="p-4">

                  <Form>

                    <div  className="sub-heading">

                      Sign Up
                    </div>

                    <InputGroup className="mb-3">

                      <Input type="text"  onChange={this.EmployeeName} placeholder="Enter Employee Name" />

                    </InputGroup>

                    <InputGroup className="mb-3">

                      <Input type="text"  onChange={this.Email} placeholder="Enter Email" />

                    </InputGroup>

                    <InputGroup className="mb-3">

                      <Input type="password"  onChange={this.Password} placeholder="Enter Password" />

                    </InputGroup>

                    <InputGroup className="mb-4">

                      <Input type="text"  onChange={this.City} placeholder="Enter City" />

                    </InputGroup>

                    <InputGroup className="mb-4">

                      <Input type="text"  onChange={this.Department} placeholder="Enter Department" />

                    </InputGroup>
                    
                    <Link onClick={this.register} to="/Login" className="actionBtn">Create Profile</Link>       
                  </Form>

                </CardBody>

              </Card>

            </Col>

          </Row>

        </Container>

      </div>

    );

  }

}


export default Reg;