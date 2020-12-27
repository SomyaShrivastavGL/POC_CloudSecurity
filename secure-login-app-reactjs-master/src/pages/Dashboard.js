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

  const { user, token, expiredAt, profileUpdating, profileUpdateError } = authObj;
  const [userList, setUserList] = useState([]);

  var employeeName = useFormInput(user.employeeName);
  var password = useFormInput(user.password);  
  var email = useFormInput(user.email);
  var pan = useFormInput(user.pan);
  
  const[ profilePic, setProfilePic] = useState('');
  const[ profilePicFile, setProfilePicFile] = useState('');
  const[ validEmployeeName, setValidEmp] = useState(true);
  const[ validEmail, setValidEmail] = useState(true);
  const[ validPassword, setValidPassword] = useState(true);  
  const[ validPAN, setValidPan] = useState(true);
  const[ listItems, setListItems] = useState([]);

  
  // handle button click of update form
  const getCurrentUser = () => {        
    dispatch(userGetAsync(user.email))
    .then((response)=>{
      employeeName = user.employeeName;
      email = user.email;
      password = user.password;
      pan = user.pan;      
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
  // get user list
  const getUserList = async () => {
    const result = await getUserListService();
    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      setListItems(result.data.map((d) => 
      <tr className="userListTRow">
        <td key={d.employeeName}>{d.employeeName}</td>
        <td key={d.email}>{d.email}</td>
        <td key={d.pan}>{d.pan}</td>
      </tr>      
      ));
      //setUserList(result.data);
      return;
    }
    debugger;
    setUserList(result.data);
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
    if(chkUser.password!=undefined && chkUser.password != "" && chkUser.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){                            
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
    return isValid;
  }

  function readFileDataAsBase64(e) {
    
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
    if(user.isAdminUser){
      getUserList();
    }
  }, []);
  
  return (
    <div className="subHeading centerDiv centerText">    
    Profile<br /><br /> 
      <div className="fields ">      
     <b> Welcome {user.employeeName}!</b><br /><br />
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
      <div className="subHeading centerText" hidden={!user.isAdminUser}>        
        User List<br/>
        {/* <pre>{userList.length>0?JSON.stringify(userList, null, 2):"No users to show"}</pre> */}
        <table className="fields userListTable">
          <tr>
            <th>Employee Name</th>
            <th>Email</th>
            <th>PAN</th>
          </tr>
          {listItems}
        </table>
        <input className="actionBtn" type="button" onClick={getUserList} value="Get Data" /><br /><br />
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