import React, { Component } from 'react';

import { Button, Card, CardBody, Col, Container, Form, Input, Label, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

class Profile extends Component {

  constructor() {

    super();
    this.getEmployee();
    
    this.state = {

      EmployeeName: '',

      Email: '',

      Password: '',

      PAN: '',

      ProfilePic: null,      

      isValidName: true,

      isValidEmail: true,

      isValidPassword: true,      

      isValidPAN: true,

      isValiProfilePic: true    

    }

    this.Email = this.Email.bind(this);

    this.Password = this.Password.bind(this);

    this.EmployeeName = this.EmployeeName.bind(this);

    this.Password = this.Password.bind(this);

    this.PAN = this.PAN.bind(this);    

    this.update = this.update.bind(this);

    this.handleProfilePicChange = this.handleProfilePicChange.bind(this);
        
    this.handleUpdate = this.handleUpdate.bind(this);
    this.getEmployee = this.getEmployee.bind(this);
  }
  
  Email(event) {

    this.setState({ Email: event.target.value });

  }


  PAN(event) {

    this.setState({ PAN: event.target.value });

  }


  Password(event) {

    this.setState({ Password: event.target.value });

  }  

  EmployeeName(event) {    
    this.setState({ EmployeeName: event.target.value });

  }

  ProfilePic(event){
    this.setState({ProfilePic: event.target.ProfilePic});
  }
 
  getEmployee(event) {    
    var currentUser = sessionStorage.getItem('currentUser');
    var isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn');
    if(isUserLoggedIn == "false")
    {
      alert("Please Login");
      this.props.history.push("/Login");
    }
    fetch('http://localhost:51282/Api/login/GetEmployee?email='+currentUser, {

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
                this.PAN = Result.PAN.bind(this);                           
                this.ProfilePic = Result.ProfilePic.bind(this);                                            
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

        PAN: this.state.PAN,

        ProfilePic: this.state.ProfilePic        
      })

    }).then((Response) => Response.json())

      .then((Result) => {

        if (Result.Status === 'Success')

          this.props.history.push("/Dashboard");

        else

          alert('Sorrrrrry !!!! Un-authenticated User !!!!!')

      },(error)=>{
        this.props.history.push("/Login");
      })

  }
 
  handleProfilePicChange(event) {
    if(event.target.files[0] !=null && event.target.files[0]!= undefined)
    {
      this.setState({
        ProfilePic: URL.createObjectURL(event.target.files[0])
      })
      this.isValiProfilePic = true;
    }
    else{
      this.setState({
        ProfilePic: null
      })
      this.isValiProfilePic = false;
    }
  }  

  handleUpdate(event) {              
    if(this.state.EmployeeName!=undefined && this.state.EmployeeName != "" && this.state.EmployeeName.match(/^[a-zA-Z ]*$/))
      this.state.isValidName= true;   
    else
      this.state.isValidName= false;

    if(this.state.Email!=undefined && this.state.Email != "" && this.state.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/))
      this.state.isValidEmail= true;    
    else
      this.state.isValidEmail= false; 

    if(this.state.Email!=undefined && this.state.Email != "" && this.state.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/))
      this.state.isValidEmail= true;    
    else
      this.state.isValidEmail= false;   

    if(this.state.Password!=undefined && this.state.Password != "" && this.state.Password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/))
      this.state.isValidPassword= true;          
    else
      this.state.isValidPassword= false;                   
    if(this.state.PAN!=undefined && this.state.PAN != "" && this.state.PAN.match(/^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/))
      this.state.isValidPAN= true;  
    else
      this.state.isValidPAN= false;    
    if(this.state.ProfilePic != undefined && this.state.ProfilePic != "")
      this.state.isValiProfilePic =true;    
    else
    this.state.isValiProfilePic = false;
    if(this.state.isValidName && this.state.isValidEmail && this.state.isValidPassword &&
      this.state.isValidPAN && this.state.isValiProfilePic){
       this.update();
    }    
  }
  
  render() {      
    
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
                        <Input type="text"  value={this.state.EmployeeName} onChange={this.EmployeeName} placeholder="Enter Employee Name"></Input>                      
                        <label className="error">{this.state.isValidName?"":"Please enter a valid Name"}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Email :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.Email} placeholder="Enter Email" />
                        <label className="error">{this.state.isValidEmail?"":"Please enter a valid Email"}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Password :
                        </td>                        
                        <td>
                        <Input type="password"  onChange={this.Password} placeholder="Enter Password" />
                        <label className="error">{this.state.isValidPassword?"":"Please enter a valid Password"}</label>
                        </td>
                      </tr>                      
                      <tr>
                        <td>
                        PAN :
                        </td>                        
                        <td>
                        <Input type="text"  onChange={this.PAN} placeholder="Enter PAN" />
                        <label className="error">{this.state.isValidPAN?"":"Please enter a valid PAN Name"}</label>
                        </td>
                      </tr>  
                      <tr>
                        <td>
                        Profile Picture :
                        </td>                        
                        <td>
                        <input type="file" onChange={this.handleProfilePicChange}/>
                        <label className="error">{this.state.isValiProfilePic?"":"Please enter a valid Profile Picture file"}</label>
                        </td>
                      </tr>                       
                    </table>                                                                                                   
                    <Link onClick={this.handleUpdate} className="actionBtn">Update Profile</Link>                                           
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