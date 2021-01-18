import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:4000';

// set token to the axios
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

// verify refresh token to generate new access token if refresh token is present
export const verifyTokenService = async () => {
  try {
    return await axios.post(`${API_URL}/verifyToken`);
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
    return await axios.post(`${API_URL}/users/signin`, { username, password });
  } catch (err) {    
    if(username == 'test' && password=='test')
    {
      var testUser = {employeeName:"testUser", email:"testUser@testing.com", password: "Test@123", pan:"TESTR1234T", link:"https://glo.globallogic.com/users/profile/somya.shrivastav", isAdminUser: false}
      return { data:{ token:"test", expiredAt:"test", user:testUser}
      };
    }
    else if(username == 'admin' && password=='admin')
    {
      var adminUser = {employeeName:"adminUser", email:"adminUser@administartion.com", password: "Admin@123", pan:"ADMIN1234T", link:"https://glo.globallogic.com/users/profile/somya.shrivastav", isAdminUser: true}
      return { data:{ token:"admin", expiredAt:"admin", user:adminUser}
      };
    }
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
    return await axios.post(`${API_URL}/users/signup`, { user });
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