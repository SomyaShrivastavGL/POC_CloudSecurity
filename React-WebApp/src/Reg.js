import React, { Component } from 'react';

import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';

import { Link } from 'react-router-dom';
class Reg extends Component {

  constructor() {

    super();

    sessionStorage.removeItem('currentUser');
    sessionStorage.setItem('currentUser',"");

    this.state = {

      EmployeeName: '',

      Email: '',

      Password: '',

      PAN: '',
      
      isValidName: true,

      isValidEmail: true,

      isValidPassword: true,

      isValidPAN: true    

    }

    this.Email = this.Email.bind(this);

    this.Password = this.Password.bind(this);

    this.EmployeeName = this.EmployeeName.bind(this);

    this.Password = this.Password.bind(this);

    this.PAN = this.PAN.bind(this);

    this.register = this.register.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  Email(event) {

    this.setState({ Email: event.target.value })

  }


  PAN(event) {

    this.setState({ PAN: event.target.value })

  }


  Password(event) {

    this.setState({ Password: event.target.value })

  }

  EmployeeName(event) {

    this.setState({ EmployeeName: event.target.value })

  }

  handleSignUp(event) {       
       
    if(this.state.EmployeeName!=undefined && this.state.EmployeeName != "" && this.state.EmployeeName.match(/^[a-zA-Z ]*$/)){    
      this.state.isValidName= true;
    } 
    else{
        this.state.isValidName= false;
    }  
    if(this.state.Email!=undefined && this.state.Email != "" && this.state.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
      this.state.isValidEmail= true;
    } 
    else{
        this.state.isValidEmail= false;
    }  
    if(this.state.Email!=undefined && this.state.Email != "" && this.state.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
        this.state.isValidEmail= true;
    } 
    else{
        this.state.isValidEmail= false;
    }  
    if(this.state.Password!=undefined && this.state.Password != "" && this.state.Password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){                            
        this.state.isValidPassword= true;      
    } 
    else
    {
        this.state.isValidPassword= false;      
    }          
    if(this.state.PAN!=undefined && this.state.PAN != "" && this.state.PAN.match(/^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/))
      this.state.isValidPAN= true;  
    else{
        this.state.isValidPAN= false;
    } 
    if(this.state.isValidName && this.state.isValidEmail && this.state.isValidPassword &&
      this.state.isValidPAN){
       this.register();
    }    
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

        PAN: this.state.PAN

      })

    }).then((Response) => Response.json())

      .then((Result) => {

        if (Result.Status === 'Success')

                this.props.history.push("/Login");

        else

          alert('Sorrrrrry !!!! Un-authenticated User !!!!!')

      }, (error)=>{
        this.props.history.push("/Login");
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
                   
                      <Input type="text"  onChange={this.EmployeeName} placeholder="Enter Employee Name" />
                      <label className="error">{this.state.isValidName?"":"Please enter a valid Name"}</label>

                      <Input type="text"  onChange={this.Email} placeholder="Enter Email" />
                      <label className="error">{this.state.isValidEmail?"":"Please enter a valid Email"}</label>                   

                      <Input type="password"  onChange={this.Password} placeholder="Enter Password" />
                      <label className="error">{this.state.isValidPassword?"":"Please enter a valid Password"}</label>                    
                      
                      <Input type="text"  onChange={this.PAN} placeholder="Enter PAN" />        
                      <label className="error">{this.state.isValidPAN?"":"Please enter a valid PAN Name"}</label>         
                    
                    <Link onClick={this.handleSignUp} className="actionBtn">Create Profile</Link>       
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