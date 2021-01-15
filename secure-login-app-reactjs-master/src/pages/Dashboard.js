import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { verifyTokenAsync, userLogoutAsync, profileUpdateAsync, userGetAsync } from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";

import { setAuthToken } from './../services/auth';
import { getUserListService } from './../services/user';

function Dashboard(props) {

  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { user, token, expiredAt, profileUpdating, profileUpdateError, userGetInProgress } = authObj;  

  var employeeName = useFormInput(user.EmployeeName);
  var password = useFormInput(user.Password);  
  var email = useFormInput(user.Email);
  var pan = useFormInput(user.PAN);
  
  const[ profilePic, setProfilePic] = useState('');
  const[ profilePicFile, setProfilePicFile] = useState('');
  const[ validEmployeeName, setValidEmp] = useState(true);
  const[ validEmail, setValidEmail] = useState(true);
  const[ validPassword, setValidPassword] = useState(true);  
  const[ validPAN, setValidPan] = useState(true);  
  
  // handle button click of update form
  const getCurrentUser = () => {        
    dispatch(userGetAsync(user.Email))
    .then((response)=>{
      if(user.isAdminUser){
        props.history.push('/admin');
      } 
      if(validForm(user)){
        employeeName = user.EmployeeName;
        email = user.Email;
        password = user.Password;
        pan = user.PAN;                   
      }      
    }); 
  }  

  // handle button click of update form
  const handleUpdate = () => {    
    var updateUser ={employeeName:employeeName.value, password:password.value, email:email.value, pan:pan.value, profilePic:profilePicFile} ;    
    if(validForm(updateUser)){
      dispatch(profileUpdateAsync(updateUser))
      .then((response)=>{
        props.history.push('/login');
      }); }
  }

  const redirectToAdmin = () => {
    if(user.isAdminUser){
      props.history.push('/admin');
    }
  }
  // handle click event of the logout button
  const handleLogout = () => {
    dispatch(userLogoutAsync());
  }

  const handleProfilePicChange = async (event) =>{
    if(event.target.files[0] !=null && event.target.files[0]!= undefined)
    {
      const file = event.target.files[0];
      setProfilePic(URL.createObjectURL(file));  
      const imgUpload = await convertBase64(file);    
      setProfilePicFile(imgUpload);
    } 
    else{
      setProfilePic(null);      
    }
  }  

  const convertBase64 = (file) => {
    return new Promise((resolve, rejecct) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) =>{
        rejecct(error);
      }
    } );
  }  

  function validForm(chkUser){   
    var isValid= true; 
    if(chkUser.EmployeeName!=undefined && chkUser.EmployeeName != "" && chkUser.EmployeeName.match(/^[a-zA-Z ]*$/)){    
      setValidEmp(true);
    } 
    else{
        setValidEmp(false);
        isValid =false;
    }  
    if(chkUser.Email!=undefined && chkUser.Email != "" && chkUser.Email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
      setValidEmail(true);
    } 
    else{
        setValidEmail(false);
        isValid =false;
    }    
    if(chkUser.Password!=undefined && chkUser.Password != "" && chkUser.Password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/)){                            
        setValidPassword(true);      
    } 
    else
    {
        setValidPassword(false);   
        isValid =false;   
    }        
    if(chkUser.PAN!=undefined && chkUser.PAN != "" && chkUser.PAN.match(/^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/))
      setValidPan(true);  
    else{
        setValidPan(false);
        isValid =false;
    }         
    return isValid;
  }
  
  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    }
  }, [expiredAt, token])

  // get user list on page load
  useEffect(() => {    
    getCurrentUser();    
  }, []); 
  
  return (
    <div className="subHeading centerDiv centerText">    
    Profile<br /><br /> 
      <div className="fields centerDiv centerText ">      
     <b> Welcome {user.EmployeeName}!</b><br /><br />
      <table>
        <tr>
          <td>
              <div className="alignTop centerText">
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
                  PAN<br />
                  <input type="text" {...pan} /> <br/>
                  <label className="warningMsg">{validPAN?"":"PAN is not valid."}</label>       
                </div>
                    
          </div>
          </td>
          <td>
              <div className="alignTop">
                <b>Profile Picture:</b><br/>
                <img className="ProfilePicture" src={profilePic}/><br/> 
                <label>{profilePic?"Available":"Not Available"}</label>                                     
              </div>
              <div className="fields centerText">                  
                  <input type="file" {...profilePic} name="profilePicture" onChange={handleProfilePicChange}/>        
              </div>
          </td>
        </tr>
        <tr>
          <td colSpan="2">
          <input className="actionBtn"
              type="button"
              style={{ marginTop: 10 }}
              value={profileUpdating ? 'Updating ...' : 'Update'}
              onClick={handleUpdate}
              disabled={profileUpdating} />
            {profileUpdateError && <div style={{ color: 'red', marginTop: 10 }}>{profileUpdateError}</div>}                
          </td>
        </tr>
      </table>  
      </div>                      
      <div className="centerDiv">
        <input className="actionBtn" type="button" onClick={handleLogout} value="Logout" /><br /><br />
      </div>
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

export default Dashboard;