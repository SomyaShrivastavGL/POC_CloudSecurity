import React from 'react';  
import './App.css';  

import Login from './Login';  

import Reg from './Reg';  

import Profile from './Profile';

import Dashboard from './Dashboard';  

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
function App() {  

  return (  

    <Router>    

      <div className="container">    

        <nav className="navbar navbar-expand-lg headingBar">    

          <div className="collapse navbar-collapse" >    
            
            <Link  to="/Login"><label className="heading">The Employee Book</label></Link> 
            
            <ul className="navbar-nav mr-auto">    
              
              <li className="nav-item">    

                <Link to={'/Login'} className="nav-link">Login</Link>    

              </li>    

              <li className="nav-item">    

                <Link to={'/Signup'} className="nav-link">Sign Up</Link>    

              </li>  

              {/* <li className="nav-item">                  
                <Link to={'/Profile'} className="nav-link">Profile</Link>                    

              </li>     */}


            </ul>    

          </div>    

        </nav> <br />    

        <Switch>    

          <Route exact path='/Login' component={Login} />    

          <Route path='/Signup' component={Reg} />    

          <Route path='/Profile' component={Profile} />  

        </Switch>    

        <Switch>  

        <Route path='/Dashboard' component={Dashboard} />    

        </Switch>  

      </div>    

    </Router>   

  );  

}  


export default App;

