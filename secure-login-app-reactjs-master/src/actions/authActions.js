import {
  VERIFY_TOKEN_STARTED, VERIFY_USER_SUCCESS, VERIFY_TOKEN_END,
  USER_LOGIN_STARTED, USER_LOGIN_FAILURE, USER_LOGOUT,
  USER_SIGNUP_STARTED, VERIFY_SIGNUP_SUCCESS, USER_SIGNUP_FAILURE,
  PROFILE_UPDATE_STARTED, VERIFY_PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE, 
  USER_GET_STARTED, USER_GET_FAILURE, VERIFY_GET_USER_SUCCESS
} from "./actionTypes";
import { setAuthToken } from "../services/auth";

// verify token - start
export const verifyTokenStarted = (silentAuth = false) => {
  return {
    type: VERIFY_TOKEN_STARTED,
    payload: {
      silentAuth
    }
  }
}

// verify token - end/failure
export const verifyTokenEnd = () => {
  return {
    type: VERIFY_TOKEN_END
  }
}

// user login - start
export const userLoginStarted = () => {
  return {
    type: USER_LOGIN_STARTED
  }
}

// user login - failure
export const userLoginFailure = (error = 'Something went wrong. Please try again later.') => {
  return {
    type: USER_LOGIN_FAILURE,
    payload: {
      error
    }
  }
}

// verify token - success
export const verifyUserSuccess = ({ token, expiredAt, user }) => {    
  return {
    type: VERIFY_USER_SUCCESS,
    payload: {
      token,
      expiredAt,
      user
    }
  }
}

// user signUp - start
export const userSignUpStarted = () => {
  return {
    type: USER_SIGNUP_STARTED
  }
}

// user signup - failure
export const userSignUpFailure = (error = 'Something went wrong. Please try again later.') => {
  return {
    type: USER_SIGNUP_FAILURE,
    payload: {
      error
    }
  }
}

// verify signUp - success
export const verifySignUpSuccess = () => {  
  return {
    type: VERIFY_SIGNUP_SUCCESS    
  }
}

// user login - start
export const userGetStarted = () => {
  return {
    type: USER_GET_STARTED
  }
}

// user login - failure
export const userGetFailure = (error = 'Something went wrong. Please try again later.') => {
  return {
    type: USER_GET_FAILURE,
    payload: {
      error
    }
  }
}

// verify token - success
export const verifyGetUserSuccess = ({ token, expiredAt, user }) => {  
  return {
    type: VERIFY_GET_USER_SUCCESS,
    payload: {
      token,
      expiredAt,
      user
    }
  }
}

// user update - start
export const profileUpdateStarted = () => {
  return {
    type: PROFILE_UPDATE_STARTED
  }
}

// user update - failure
export const profileUpdateFailure = (error = 'Something went wrong. Please try again later.') => {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: {
      error
    }
  }
}

// verify update - success
export const verifyProfileUpdateSuccess = () => {  
  return {
    type: VERIFY_PROFILE_UPDATE_SUCCESS    
  }
}

// handle user logout
export const userLogout = () => {
  setAuthToken();
  return {
    type: USER_LOGOUT
  }
}