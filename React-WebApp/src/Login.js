import React, { Component } from 'react';

import './App.css';

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
class Login extends Component {

    constructor() {

        super();
        sessionStorage.removeItem('currentUser');
        sessionStorage.setItem('currentUser',"");
        sessionStorage.removeItem('isUserLoggedIn');
        sessionStorage.setItem('isUserLoggedIn',false);
        
        this.state = {

            Email: '',

            Password: '',

            isValidEmail: true,

            isValidPassword: true

        }


        this.Password = this.Password.bind(this);

        this.Email = this.Email.bind(this);

        this.login = this.login.bind(this);
        
        this.handleLogin = this.handleLogin.bind(this);

    }


    Email(event) {        
        this.setState({ Email: event.target.value })

    }

    Password(event) {
        this.setState({ Password: event.target.value })

    }

    

    handleLogin(event) {       
        
        if(this.state.Email!=undefined && this.state.Email != "" && this.state.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
            this.state.isValidEmail= true;
        } 
        else if(this.state.Email == "test")
        {
            this.state.isValidEmail= true; // For Testing purposes
        }
        else{
            this.state.isValidEmail= false;
        }  
        if(this.state.Password!=undefined && this.state.Password != "" && this.state.Password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){                            
            this.state.isValidPassword= true;      
        } 
        else if(this.state.Password == "test")
        {
            this.state.isValidPassword= true; // For Testing purposes
        }
        else
        {
            this.state.isValidPassword= false;      
        }
        if(this.state.isValidEmail && this.state.isValidPassword){
           this.login();
        }
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
                {
                    sessionStorage.setItem('currentUser', this.state.Email);
                    sessionStorage.setItem('isUserLoggedIn',true);
                    alert("yes");
                   this.props.history.push("/Profile");
                }                  
            }, (error) => {
                sessionStorage.setItem('currentUser', this.state.Email);
                sessionStorage.setItem('isUserLoggedIn',true);
                this.props.history.push("/Profile");
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
                                            
                                            <Input type="text" placeholder="Enter Email" onChange={this.Email} />

                                            <label className="error">{this.state.isValidEmail?"":"Please enter a valid Email"}</label>  <br/>

                                            <Input type="password" placeholder="Enter Password" onChange={this.Password}/>

                                            <label className="error">{this.state.isValidPassword?"":"Please enter a valid Password"}</label> <br/>
                                            <Link onClick={this.handleLogin} className="actionBtn">Login</Link>                                                                                      
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
