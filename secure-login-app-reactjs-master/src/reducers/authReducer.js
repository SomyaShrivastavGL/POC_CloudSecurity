import {
  VERIFY_TOKEN_STARTED, VERIFY_TOKEN_END,
  USER_LOGIN_STARTED, USER_LOGIN_FAILURE,
  VERIFY_USER_SUCCESS, USER_LOGOUT, 
  USER_SIGNUP_STARTED, USER_SIGNUP_FAILURE, VERIFY_SIGNUP_SUCCESS,
  PROFILE_UPDATE_STARTED, VERIFY_PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE
} from "../actions/actionTypes";

// define initial state of auth reducer
const initialState = {
  token: null, // manage the access token
  expiredAt: null, // manage expiry time of the access token
  user: null, // manage the user details
  authLoading: true, // to indicate that the auth API is in progress
  isAuthenticated: false, // consider as a authentication flag
  userLoginLoading: false, // to indicate that the user signin API is in progress
  loginError: null, // manage the error of the user signin API
  signUpPosting: false, // to indicate that the signUP POST API is in progress
  signUpError: false,
  profileUpdating: false,
  profileUpdateError: false
}

// update store based on type and payload and return the state
const auth = (state = initialState, action) => {
  switch (action.type) {
    // verify token - started
    case VERIFY_TOKEN_STARTED:
      const { silentAuth } = action.payload;
      return silentAuth ? {
        ...state
      } : initialState;
    // verify token - ended/failed
    case VERIFY_TOKEN_END:
      return {
        ...state,
        authLoading: false
      };
    // user login - started
    case USER_LOGIN_STARTED:
      return {
        ...state,
        userLoginLoading: true
      };
    // user login - ended/failed
    case USER_LOGIN_FAILURE:
      const { error } = action.payload;      
      return {
        ...state,
        loginError: error,
        userLoginLoading: false
      };
    // verify token - success
    case VERIFY_USER_SUCCESS:
      const { token, expiredAt, user } = action.payload;
      return {
        ...state,
        token,
        expiredAt,
        user,
        isAuthenticated: true,
        authLoading: false,
        userLoginLoading: false
      };
    // handle user logout
    case USER_LOGOUT:
      return {
        ...initialState,
        authLoading: false
      };
    // user login - started
    case USER_SIGNUP_STARTED:
      return {
        ...state,
        signUpPosting: true
      };
    // user login - started
    case VERIFY_SIGNUP_SUCCESS:
      return {
        ...state,
        signUpPosting: false
      };
    // user login - started
    case USER_SIGNUP_FAILURE:
      const { signUpError } = action.payload;      
      return {
        ...state,
        signUpPosting: false,
        signUpError: signUpError
      };
      // user login - started
    case PROFILE_UPDATE_STARTED:
      return {
        ...state,
        profileUpdating: true
      };
    // user login - started
    case VERIFY_PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        profileUpdating: false
      };
    // user login - started
    case PROFILE_UPDATE_FAILURE:
      const { profileUpdateError } = action.payload;      
      return {
        ...state,
        profileUpdating: false,
        profileUpdateError: profileUpdateError
      };
    default:
      return state
  }
}

export default auth;