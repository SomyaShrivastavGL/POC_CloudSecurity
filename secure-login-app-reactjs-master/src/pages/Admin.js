import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { verifyTokenAsync, userLogoutAsync} from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";

import { setAuthToken } from './../services/auth';
import { getUserListService } from './../services/user';

function Admin(props) {
  const URL = require('url-parse') 
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { user, token, expiredAt} = authObj;
  const [userList, setUserList] = useState([]);
  const[ listItems, setListItems] = useState([]); 

  // handle click event of the logout button
  const handleLogout = () => {
    dispatch(userLogoutAsync());
  }

  const handleUserDelete = (id) => {
    alert("Deleting User with user Id = "+id);
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
        <td key={d.Id}><img className="ProfilePictureThumbnail" src={d.profilePicFile}/></td>
        <td key={d.employeeName}>{d.employeeName}</td>
        <td key={d.email}>{d.email}</td>
        <td key={d.pan}>{d.pan}</td>
        <td key={d.link}> <a href={getSafeUrl(d.link)} target="_blank">Check out Profile</a></td>
        <td key={d.Id}>
          <input type="button" style={{ marginTop: 10 }} value="Delete" />
        </td>
      </tr>      
      ));
      setUserList(result.data);
      return;
    }    
    setUserList(result.data);
  }

  function getSafeUrl(url) {  
    var chkUrl = URL(url);
    if (chkUrl.protocol === 'javascript:') return ""
    if (chkUrl.protocol === '') return ""
    return chkUrl
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
    if(user.isAdminUser){
      getUserList();
    }
  }, []);
  
  return (
    <div className="subHeading centerDiv centerText">    
    Admin - Profile<br /><br />          
     <b> Welcome {user.employeeName}!</b><br /><br />           
      <div className="subHeading centerText">        
        User List<br/>
        {/* <pre>{userList.length>0?JSON.stringify(userList, null, 2):"No users to show"}</pre> */}
        <table className="fields userListTable">
          <tr>
            <th>Profile Picture</th>
            <th>Employee Name</th>
            <th>Email</th>
            <th>PAN</th>
            <th>Profile Link</th>
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

export default Admin;