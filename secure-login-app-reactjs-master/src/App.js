import React, { useEffect } from 'react';
import { BrowserRouter, Switch, NavLink, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import { verifyTokenAsync } from './asyncActions/authAsyncActions';
import Admin from './pages/Admin';
import { Helmet } from 'react-helmet';
import {CSP_CONTENT} from './constants';

function App() {
  const csp_content = CSP_CONTENT+process.env.REACT_APP_API_URL;
  
  const authObj = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { authLoading, isAuthenticated } = authObj;

  // verify token on app load
  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, []);

  // checking authentication
  if (authLoading) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    
    <div className="App">
      <Helmet>     
      <meta http-equiv="Content-Security-Policy" content={csp_content} />
      </Helmet>
      <BrowserRouter>
        <div>
        <div className="header heading centerText">
            THE EMPLOYEE BOOK
          </div>
          <div className="header centerText">
            <NavLink activeClassName="active" to="/login">Login</NavLink>
            <NavLink activeClassName="active" to="/signUp">Sign Up</NavLink>
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
          </div>
          <div className="content">
            <Switch>
              <PublicRoute path="/login" component={Login} isAuthenticated={isAuthenticated} />
              <PublicRoute path="/signUp" component={SignUp} isAuthenticated={isAuthenticated} />
              <PrivateRoute path="/dashboard" component={Dashboard} isAuthenticated={isAuthenticated} />
              <PrivateRoute path="/admin" component={Admin} isAuthenticated={isAuthenticated} />
              <Redirect to={isAuthenticated ? '/dashboard' : '/login'} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
