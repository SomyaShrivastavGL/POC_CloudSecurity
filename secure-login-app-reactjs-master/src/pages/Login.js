import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userLoginAsync } from './../asyncActions/authAsyncActions';

function Login() {

  const authObj = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { userLoginLoading, loginError } = authObj;

  const email = useFormInput('');
  const password = useFormInput('');

  const[ validEmail, setValidEmail] = useState(true);
  const[ validPassword, setValidPassword] = useState(true);
  // handle button click of login form
  const handleLogin = () => {    
    if(validForm(email.value,password.value)){
      dispatch(userLoginAsync(email.value, password.value));     
    } 
  }

  function validForm(email,password){   
    var isValid= true;     
    if(email!=undefined && email != "" && email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
      setValidEmail(true);
    } 
    else{
        setValidEmail(false);
        isValid =false;
    }    
    if(password!=undefined && password != "" && password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){                            
        setValidPassword(true);      
    } 
    else
    {
        setValidPassword(false);   
        isValid =false;   
    }          
    if((email=='test' && password=='test') || (email=='admin' && password=='admin')){
      setValidEmail(true);
      setValidPassword(true);
      return true;
    }      
    return isValid;
  }

  return (
    <div className="subHeading centerDiv centerText">
      Login<br /><br />
      <div className="fields ">
        Email Address<br />
        <input type="text" {...email} autoComplete="new-password" /> <br/>
        <label className="warningMsg">{validEmail?"":"Email is not valid."}</label>    
      </div>
      <div className="fields ">
        Password<br />
        <input type="password" {...password} autoComplete="new-password" /> <br/>
        <label className="warningMsg">{validPassword?"":"Password is not valid."}</label>  
      </div>
      <input className="actionBtn"
        type="button"
        style={{ marginTop: 10 }}
        value={userLoginLoading ? 'Loading...' : 'Login'}
        onClick={handleLogin}
        disabled={userLoginLoading} />
      {loginError && <div style={{ color: 'red', marginTop: 10 }}>{loginError}</div>}
    </div>
  );
}

// custom hook to manage the form input
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}


export default Login;