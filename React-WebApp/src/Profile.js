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

      Department: '',

      ProfilePic: null,

      Resume: null

    }

    this.Email = this.Email.bind(this);

    this.Password = this.Password.bind(this);

    this.EmployeeName = this.EmployeeName.bind(this);

    this.Password = this.Password.bind(this);

    this.Department = this.Department.bind(this);

    this.City = this.City.bind(this);

    this.update = this.update.bind(this);

    this.handleProfilePicChange = this.handleProfilePicChange.bind(this);
    this.handleResumeChange = this.handleResumeChange.bind(this);
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

  ProfilePic(event){
    this.setState({ProfilePic: event.target.ProfilePic})
  }

  Resume(event){
    this.setState({Resume: event.target.Resume})
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
                this.ProfilePic = Result.City.bind(this);
                this.Resume = Result.Resume.bind(this);
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

        Department: this.state.Department,

        ProfilePic: this.state.ProfilePic,

        Resume: this.state.Resume
      })

    }).then((Response) => Response.json())

      .then((Result) => {

        if (Result.Status === 'Success')

                this.props.history.push("/Dashboard");

        else

          alert('Sorrrrrry !!!! Un-authenticated User !!!!!')

      })

  }
 
  handleProfilePicChange(event) {
    if(event.target.files[0] !=null && event.target.files[0]!= undefined)
    {
      this.setState({
        ProfilePic: URL.createObjectURL(event.target.files[0])
      })
    }
    else
    this.setState({
      ProfilePic: null
    })
    
  }

  handleResumeChange(event) {
    if(event.target.files[0] !=null && event.target.files[0]!= undefined)
    {
      this.setState({
        Resume: URL.createObjectURL(event.target.files[0])
      })
    }
    else
    this.setState({
      Resume: null
    })
  }

  render() {
    this.getEmployee();

    return (

        <Container>

          <Row className="justify-content-center">

            <Col>

              <Card className="CardProfile">

                <CardBody>

                  <Form>

                    <div  className="sub-heading">

                    Profile

                    </div>
                    <table>
                      
                      <tr>
                        <td>
                        Employee Name :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.EmployeeName} placeholder="Enter Employee Name" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Email :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.Email} placeholder="Enter Email" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Password :
                        </td>                        
                        <td>
                        <Input type="password"  onChange={this.Password} placeholder="Enter Password" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                        City :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.City} placeholder="Enter City" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Department :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.Department} placeholder="Enter Department" />
                        </td>
                      </tr>  
                      <tr>
                        <td>
                        Profile Picture :
                        </td>                        
                        <td>
                        <input type="file" onChange={this.handleProfilePicChange}/>
                        </td>
                      </tr> 
                      <tr>
                      <td>
                        Resume :
                        </td>                        
                        <td>
                        <input type="file" onChange={this.handleResumeChange}/> 
                        </td>
                      </tr>                   

                    </table>                                                                                                   
                    <Link onClick={this.update} to="/Login" className="actionBtn">Update Profile</Link>                                           
                  </Form>
                </CardBody>
              </Card>              
            </Col>
            <Card className="CardDocuments">                    
                <CardBody>
                    <div  className="sub-heading">

                    Documents

                    </div>
                    <div className="centerText">
                      Profile Picture:<br/>
                      <img className="ProfilePicture" src={this.state.ProfilePic}/><br/>
                      <br/><br/><br/><br/>
                      Resume: {this.state.Resume != null? 'Available':'Not Available'}                      
                    </div>                    
                </CardBody>
              </Card>
            <Col>
            </Col>

          </Row>

        </Container>  

    );

  }

}


export default Profile;