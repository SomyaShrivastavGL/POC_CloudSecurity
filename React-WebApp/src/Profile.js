import React, { Component } from 'react';

import { Button, Card, CardBody, Col, Container, Form, Input, Label, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

class Profile extends Component {

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

    this.update = this.update.bind(this);

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

  getEmployee(event) {


    fetch('http://localhost:51282/Api/login/GetEmployee', {

      method: 'get',

      headers: {

        'Accept': 'application/json',

        'Content-Type': 'application/json'

      }     

    }).then((Response) => Response.json())

      .then((Result) => {

        if (Result.Status === 'Success')
        {
                this.Email = Result.Email.bind(this);
                this.Password = Result.Password.bind(this);            
                this.EmployeeName = Result.EmployeeName.bind(this);            
                this.Password = Result.Password.bind(this);            
                this.Department = Result.Department.bind(this);            
                this.City = Result.City.bind(this);
                this.props.history.push("/Dashboard");
        }
        else

          alert('Sorrrrrry !!!! Un-authenticated User !!!!!')

      })

  }

  update(event) {


    fetch('http://localhost:51282/Api/login/UpdateEmployee', {

      method: 'put',

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
    this.getEmployee();

    return (

      <div className="app flex-row align-items-center">

        <Container>

          <Row className="justify-content-center">

            <Col md="9" lg="7" xl="6">

              <Card className="mx-4">

                <CardBody className="p-4">

                  <Form>

                    <div  className="sub-heading">

                    Profile

                    </div>
                    <table>
                      <tr className="tRowProfile">
                        <td>
                        Employee Name :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.EmployeeName} placeholder="Enter Employee Name" />
                        </td>
                      </tr>
                      <tr className="tRowProfile">
                        <td>
                        Email :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.Email} placeholder="Enter Email" />
                        </td>
                      </tr>
                      <tr className="tRowProfile">
                        <td>
                        Password :
                        </td>                        
                        <td>
                        <Input type="password"  onChange={this.Password} placeholder="Enter Password" />
                        </td>
                      </tr>
                      <tr className="tRowProfile">
                        <td>
                        City :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.City} placeholder="Enter City" />
                        </td>
                      </tr>
                      <tr className="tRowProfile">
                        <td>
                        Department :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.Department} placeholder="Enter Department" />
                        </td>
                      </tr>
                    </table>                   
                    
                    <Link onClick={this.update} to="/Login" className="actionBtn">Update Profile</Link>                                           
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


export default Profile;