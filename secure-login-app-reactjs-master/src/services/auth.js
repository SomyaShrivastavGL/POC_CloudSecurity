import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = 'https://localhost:5001/api';

  
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = `http://localhost:3000`; 
// set token to the axios
export const setAuthToken = token => {
  if (token) {
    //axios.defaults.headers.common['Authorization'] = `Basic aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw`; 
    axios.defaults.headers.common['Authorization'] = `${token}`;
  }
  else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

// verify refresh token to generate new access token if refresh token is present
export const verifyTokenService = async () => {
  try {
    //eturn await axios.get(`${API_URL}/AntiForgery/VerifyTokens` );
    return {
      error: true
    }

  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

// user login API to validate the credential
export const userLoginService = async (username, password) => {
  try {
   var user={
      Email:username,
      Password:password
    }
    return await axios.post(`${API_URL}/AuthToken`, user);
  } catch (err) {        
    if( err.response == null || err.response == undefined )
    {
      err.response={data:{message:"Login failed !! Please try again."}};
    }
    return {
      error: true,
      response: err.response
    };
  }  
}

// user login API to validate the credential
export const userSignUpService = async (user) => {
  try {
    user.ProfilePicture =null;
    return await axios.post(`${API_URL}/user/AddEmployee`,  user);
  } catch (err) {      
    if( err.response == null || err.response == undefined )
    {
      err.response={data:{message:"SignUp failed !! Please try again."}};
    }
    return {
      error: true,
      response: err.response
    };
  }
}

// manage user logout
export const userLogoutService = async () => {
  try {
    return await axios.post(`${API_URL}/users/logout`);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}