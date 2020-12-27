import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userSignUpAsync } from '../asyncActions/authAsyncActions';

function SignUp(props) {

 const authObj = useSelector(state => state.auth);
 const dispatch = useDispatch();

  const { signUpPosting, signUpError } = authObj;

  var employeeName = useFormInput('');
  var password = useFormInput('');
  var confirmPassword = useFormInput('');
  var email = useFormInput('');
  var pan = useFormInput('');

  const[ validEmployeeName, setValidEmp] = useState(true);
  const[ validEmail, setValidEmail] = useState(true);
  const[ validPassword, setValidPassword] = useState(true);
  const[ validConfirmPassword, setValidConfirmPassword] = useState(true);
  const[ validPAN, setValidPan] = useState(true);
  

  // handle button click of signup form
  const handleSignUp = () => {
    var user ={employeeName:employeeName.value, password:password.value, email:email.value, pan:pan.value} ;
    if(validForm(user)){
      dispatch(userSignUpAsync(user))
      .then((response)=>{
        props.history.push('/login');
      }); }
  }

  function validForm(user){   
    var isValid= true; 
    if(user.employeeName!=undefined && user.employeeName != "" && user.employeeName.match(/^[a-zA-Z ]*$/)){    
      setValidEmp(true);
    } 
    else{
        setValidEmp(false);
        isValid =false;
    }  
    if(user.email!=undefined && user.email != "" && user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
      setValidEmail(true);
    } 
    else{
        setValidEmail(false);
        isValid =false;
    }    
    if(user.password!=undefined && user.password != "" && user.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){                            
        setValidPassword(true);      
    } 
    else
    {
        setValidPassword(false);   
        isValid =false;   
    }    
    if(user.password!=user.confirmPassword){
      setValidConfirmPassword(false);
      isValid = false;
    }
    else{
      setValidConfirmPassword(true);
    }    
    if(user.pan!=undefined && user.pan != "" && user.pan.match(/^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/))
      setValidPan(true);  
    else{
        setValidPan(false);
        isValid =false;
    }         
    return isValid;
  }
  return (
    <div className="subHeading centerDiv centerText">
      Sign Up<br /><br />
      <div className="fields ">
        Employee Name<br />
        <input type="text" {...employeeName} /> <br/>
        <label className="warningMsg">{validEmployeeName?"":"Employee name is not valid."}</label> 
      </div>
      <div className="fields ">
        Email<br />
        <input type="text" {...email} /> <br/>
        <label className="warningMsg">{validEmail?"":"Email is not valid."}</label>       
      </div>
      <div className="fields ">
        Password<br />
        <input type="password" {...password} /> <br/>
        <label className="warningMsg">{validPassword?"":"Password is not valid."}</label>       
      </div>
      <div className="fields ">
        Confirm Password<br />
        <input type="password" {...confirmPassword} /> <br/>
        <label className="warningMsg">{validConfirmPassword?"":"Confirm password does not match."}</label>       
      </div>
      <div className="fields ">
        PAN<br />
        <input type="text" {...pan} /> <br/>
        <label className="warningMsg">{validPAN?"":"PAN is not valid."}</label>       
      </div>
      <input className="actionBtn"
        type="button"
        style={{ marginTop: 10 }}
        value={signUpPosting ? 'Signing up...' : 'Sign Up'}
        onClick={handleSignUp}
        disabled={signUpPosting} />
      {signUpError && <div style={{ color: 'red', marginTop: 10 }}>{signUpError}</div>}          
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


export default SignUp;