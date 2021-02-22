import axios from "axios";

const API_URL = 'https://localhost:5001/api';


// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${API_URL}/user/GetEmployees`);
  } catch (err) {    
    return {
      error: true,
      response: err.response      
    };
  }
}

// get user API 
export const userGetService = async (email) => {
  try {
    return await axios.get(`${API_URL}/user/GetEmployee`, { params: {
        email: email
      }}  );
  } catch (err) {    
    if( err.response == null || err.response == undefined )
    {
      err.response={data:{message:"Get failed !! Please try again."}};
    }
    return {
      error: true,
      response: err.response
    };
  }  
}

// user login API to validate the credential
export const profileUpdateService = async (user) => {
  try {    
    return await axios.post(`${API_URL}/user/UpdateEmployee`, user );
  } catch (err) {      
    if( err.response == null || err.response == undefined )
    {
      err.response={data:{message:"Profile Update failed !! Please try again."}};
    }
    return {
      error: true,
      response: err.response
    };
  }
}