import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { verifyTokenAsync, userLogoutAsync, profileUpdateAsync, userGetAsync } from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";

import { setAuthToken } from './../services/auth';
import { getUserListService } from './../services/user';

function Dashboard(props) {
  const URLConvert = require('url-parse') 
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { user, token, expiredAt, profileUpdating, profileUpdateError, userGetInProgress } = authObj;  

  var employeeName = useFormInput(user.EmployeeName);
  var password = useFormInput(user.Password);  
  var email = useFormInput(user.Email);
  var pan = useFormInput(user.PAN);
  var profileLink = useFormInput(user.profileLink);
  var comment = useFormInput(""); 
  var profileLink = useFormInput("");
  
  const[ profilePic, setProfilePic] = useState('');
  const[ profilePicFile, setProfilePicFile] = useState('');
  const[ validEmployeeName, setValidEmp] = useState(true);
  const[ validEmail, setValidEmail] = useState(true);
  const[ validPassword, setValidPassword] = useState(true);  
  const[ validPAN, setValidPan] = useState(true);  
  const[ validComment, setValidComment] = useState(true);  
  const[ savedComment, setSavedComment] = useState("");  
  const[ validProfileLink, setValidProfileLink] = useState(true);  
  const[ updatedProfileLink, setSavedProfileLink] = useState("");  

  // handle button click of update form
  const getCurrentUser = () => {        
    employeeName = user.EmployeeName;
    email = user.Email;
    password = user.Password;
    pan = user.PAN;                   
    setSavedProfileLink(user.link);  
        password = user.password;
        pan = user.pan;  
        setSavedProfileLink(user.link);                   
      }      
    }); 
  }  

  // handle button click of update form
  const handleUpdate = () => {    
    debugger;
    var updateUser ={employeeName:employeeName.value, password:password.value, email:email.value, 
      pan:pan.value, profilePic:profilePicFile, profileLink: updatedProfileLink, lastUpdateComment: savedComment};    
    if(validForm(updateUser)){    
        dispatch(profileUpdateAsync(updateUser))
        .then((response)=>{
          props.history.push('/login');
        }); 
      }        
  }

  // handle button click of save profile link button
  const handleProfileLinkSave = () => {        
    if(profileLink.value != undefined && profileLink.value != ""){ //&& isSafe(profileLink.value)
      setValidProfileLink(true);
      setSavedProfileLink(profileLink.value); 
    }      
    else{
      setValidProfileLink(false);
    }      
  }

  function isSafe(url) {   
    var chkUrl = URLConvert(url);    
    if (chkUrl.protocol === 'javascript:') return false
    if (chkUrl.protocol === '') return false
    return true
  }

  // handle button click of save comment button
  const handleComment = () => {        
    if(comment.value != undefined && comment.value != ""){
      setValidComment(true);
      setSavedComment(htmlEncode(comment.value)); 
    }      
    else{
      setValidComment(false);
    }      
  }

  function htmlEncode(str){
    return String(str).replace(/[^\w. ]/gi, function(c){
       return '&#'+c.charCodeAt(0)+';';
    });
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
    if(chkUser.employeeName!=undefined && chkUser.employeeName != "" && chkUser.employeeName.match(/^[a-zA-Z ]*$/)){    
      setValidEmp(true);
    } 
    else{
        setValidEmp(false);
        isValid =false;
    }  
    if(chkUser.email!=undefined && chkUser.email != "" && chkUser.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)){    
      setValidEmail(true);
    } 
    else{
        setValidEmail(false);
        isValid =false;
    }    
    if(chkUser.password!=undefined && chkUser.password != "" && chkUser.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/)){                            
        setValidPassword(true);      
    } 
    else
    {
        setValidPassword(false);   
        isValid =false;   
    }        
    if(chkUser.pan!=undefined && chkUser.pan != "" && chkUser.pan.match(/^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/))
      setValidPan(true);  
    else{
        setValidPan(false);
        isValid =false;
    }
    if(profileLink!=undefined && profileLink != "")
      setValidProfileLink(true);  
    else{
      setValidProfileLink(false);
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
    <b> Welcome {user.employeeName}!</b><br />
      <div className="fields centerDiv centerText ">           
      <table>
        <tr>
          <td>
              <div className="alignTop centerText">
                <div className="fields ">
                  <b>Employee Name</b><br />
                  <input type="text" {...employeeName} /> <br/>                               
                  <label className="warningMsg">{validEmployeeName?"":"Employee name is not valid."}</label> 
                </div>
                <div className="fields ">
                  <b>Email</b><br />
                  <input type="text" {...email} /> <br/>
                  <label className="warningMsg">{validEmail?"":"Email is not valid."}</label>       
                </div>
                <div className="fields ">
                  <b>Password</b><br />
                  <input type="password" {...password} /> <br/>
                  <label className="warningMsg">{validPassword?"":"Password is not valid."}</label>       
                </div>      
                <div className="fields ">
                  <b>PAN</b><br />
                  <input type="text" {...pan} /> <br/>
                  <label className="warningMsg">{validPAN?"":"PAN is not valid."}</label>       
                </div>
                <div className="fields">
                <b>Profile Link</b> <br/>
                <a href={updatedProfileLink} target="_blank">Check out Profile</a><br/>
              </div>
          </div>
          </td>
          <td>
              <div className="alignTop">
                <b>Profile Picture:</b><br/>
                <img className="ProfilePicture" src={profilePic}/><br/> 
                <label>{profilePic?"Available":"Not Available"}</label>                                     
              </div>
              <div className="fields">                  
                  <input type="file" {...profilePic} name="profilePicture" onChange={handleProfilePicChange}/>        
              </div>
              
          </td>
        </tr>
        <tr className="userListTRow">
          <td colSpan="2">                        
            Update Profile Link : <label className="warningMsg">{validProfileLink?"":"Please enter a valid link."}</label><br/>
            <input type="textarea" className="fullWidth" {...profileLink} /> 
            <input className="actionBtn"
              type="button"
              style={{ marginTop: 10 }}
              value="Save Link"
              onClick={handleProfileLinkSave}
              disabled={profileUpdating} /> <br/>            
          </td>
        </tr>
        <tr className="userListTRow">
          <td colSpan="2" className="fields">
            Comment <label className="warningMsg">*</label> <label className="warningMsg">{validComment?"":"Please enter a comment."}</label><br/>
            <input type="textarea" className="fullWidth" {...comment} /> 
            <input className="actionBtn"
              type="button"
              style={{ marginTop: 10 }}
              value="Save Comment"
              onClick={handleComment}
              disabled={profileUpdating} />           
          </td>
        </tr>
        <tr>
          <td colSpan="2">          
          <b>Update Comment :</b> <br/>
          <div dangerouslySetInnerHTML={{"__html": savedComment}} /> <br/>          
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
        <input className="actionBtn" type="button" onClick={redirectToAdmin} value="Admin View" hidden={!user.isAdminUser}/> 
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