import axios from "axios";

const API_URL = 'http://localhost:4000';

// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${API_URL}/users/getList`);
  } catch (err) {
    var userList = [ 
      {employeeName:"Somya Shrivastav", email:"somya.shrivastav@testing.com", pan:"ABCD1234T", link:"https://glo.globallogic.com/users/profile/somya.shrivastav"},
      {employeeName:"Monika Gautam", email:"monika.gautam@testing.com", pan:"PQRS1234T", link:"https://glo.globallogic.com/users/profile/monika.gautam"},
      {employeeName:"Harjot Singh", email:"harjot.singh@testing.com", pan:"EFGH1234T", link:"https://glo.globallogic.com/users/profile/harjot.singh1"},
      {employeeName:"Akshit Bansal", email:"akshit.bansal@testing.com", pan:"WXYZ1234T", link:"https://glo.globallogic.com/users/profile/akshit.bansal"},
      {employeeName:"Manish Tomar", email:"manish.tomar@testing.com", pan:"KLMNO1234T", link:"https://glo.globallogic.com/users/profile/manish.tomar"},
      {employeeName:"Mohammad Faheem", email:"mohammad.faheem@testing.com", pan:"TUVWX1234T", link:"https://glo.globallogic.com/users/profile/mohammad.faheem"},
      {employeeName:"Amit Gupta", email:"amit.gupta@testing.com", pan:"UVWXY1234T", link:"https://glo.globallogic.com/users/profile/amit.gupt"},
      {employeeName:"XSS Attack", email:"xss.attack@testing.com", pan:"PQWRD1234T", link:"javascript:alert('Test');"}      
    ];    
    return {
      error: true,
      response: err.response,
      data: userList
    };
  }
}

// get user API 
export const userGetService = async (email) => {
  try {
    return await axios.post(`${API_URL}/users/get`, { email });
  } catch (err) {
    if(email == 'testUser@testing.com')
    {
      var testUser = {employeeName:"testUser", email:"testUser@testing.com", password: "Test@123", pan:"TESTR1234T", isAdminUser: false}
      return { data:{ token:"test", expiredAt:"test", user:testUser}
      };
    }
    else if(email == 'adminUser@administartion.com')
    {
      var adminUser = {employeeName:"adminUser", email:"adminUser@administartion.com", password: "Admin@123", pan:"ADMIN1234T", isAdminUser: true}
      return { data:{ token:"admin", expiredAt:"admin", user:adminUser}
      };
    }
    if( err.response == null || err.response == undefined )
    {
      err.response={data:{message:"Get failed !! Please try again."}};
    }
    return {
      error: true,
      response: err.response
    };
  }
  //var testUser = {employeeName:"testUser", email:"testUser@testing.com", password: "Test@123", pan:"TESTR1234T"}
}

// user login API to validate the credential
export const profileUpdateService = async (user) => {
  try {    
    return await axios.post(`${API_URL}/users/update`, { user });
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