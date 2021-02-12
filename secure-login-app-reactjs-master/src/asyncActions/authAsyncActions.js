import {
  verifyTokenStarted, verifyUserSuccess, verifyTokenEnd,
  userLoginStarted, userLoginFailure, userLogout, 
  userSignUpStarted, userSignUpFailure, verifySignUpSuccess, 
  profileUpdateStarted, verifyProfileUpdateSuccess, profileUpdateFailure, 
  userGetStarted, userGetFailure, verifyGetUserSuccess
} from "../actions/authActions";
import { verifyTokenService, userLoginService, userLogoutService, userSignUpService } from '../services/auth';
import { userGetService, profileUpdateService } from '../services/user';

// handle verify token
export const verifyTokenAsync = (silentAuth = false) => async dispatch => {
  dispatch(verifyTokenStarted(silentAuth));

  const result = await verifyTokenService();

  if (result.error) {
    dispatch(verifyTokenEnd());
    if (result.response && [401, 403].includes(result.response.status))
      dispatch(userLogout());
    return;
  }

  if (result.status === 204)
    dispatch(verifyTokenEnd());
  else
    dispatch(verifyUserSuccess(result.data));
}

// handle user login
export const userLoginAsync = (username, password) => async dispatch => {
  dispatch(userLoginStarted());

  const result = await userLoginService(username, password);
  
  if (result.error) {
    dispatch(userLoginFailure(result.response.data.message));
    return;
  }

if(result.data!=null && result.data.isSuccessStatusCode)
{
  const userInfo = await userGetService(username);
  if(userInfo.data!=null)
  {
    var user={
      EmployeeName: userInfo.data.employeeName,
      Email:userInfo.data.email,
      PAN: userInfo.data.pan,
      Password: userInfo.data.password,
      ProfilePicture: userInfo.data.profilePicture,
      ProfileLink: userInfo.data.profileLink,
      IsAdmin: userInfo.data.isAdmin
    }
    var data={ token:result.data.requestMessage.headers[1].Value[0], expiredAt:null, user:user}
  dispatch(verifyUserSuccess(data));
}
}
  
}

// handle user get
export const userGetAsync = (email) => async dispatch => {
  dispatch(userGetStarted());

  const result = await userGetService(email);
  
  if (result.error) {
    dispatch(userGetFailure(result.response.data.message));
    return;
  }

  dispatch(verifyGetUserSuccess(result.data));
}

// handle user signUp
export const userSignUpAsync = (user) => async dispatch => {
  dispatch(userSignUpStarted());

  const result = await userSignUpService(user);
  
  if (result.error) {    
    dispatch(userSignUpFailure(result.response.data.message));    
  }
  else{
    dispatch(verifySignUpSuccess(result.data));
  }
  return;
}

// handle user update
export const profileUpdateAsync = (user) => async dispatch => {
  dispatch(profileUpdateStarted());

  const result = await profileUpdateService(user);
  
  if (result.error) {    
    dispatch(profileUpdateFailure(result.response.data.message));    
  }
  else{
    dispatch(verifyProfileUpdateSuccess(result.data));
  }
  return;
}

// handle user logout
export const userLogoutAsync = () => dispatch => {
  dispatch(userLogout());
  userLogoutService();
}