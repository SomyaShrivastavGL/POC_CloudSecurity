import axios from "axios";



const apiUrl =  process.env.REACT_APP_API_URL;
// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${apiUrl}/user/GetEmployees`);
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
    return await axios.get(`${apiUrl}/user/GetEmployee`, { params: {
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
    return await axios.post(`${apiUrl}/user/UpdateEmployee`, user );
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