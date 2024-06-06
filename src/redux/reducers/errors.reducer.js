import {
  CLEAR_LOGIN_ERROR,
  LOGIN_FAILURE,
  LOGIN_FAILURE_NO_CODE,
  LOGIN_INPUT_ERROR,
} from "../../modules/actions/loginActions";
import {
  CLEAR_REGISTRATION_ERROR,
  REGISTRATION_INPUT_ERROR,
  REGISTER_USER_FAILURE,
} from "../../modules/actions/registrationActions";
import { combineReducers } from "redux";

const initialState = "";

// loginMessage for login form
const loginMessage = (state = initialState, action) => {
  // state.errors.loginMessage
  switch (action.type) {
    case CLEAR_LOGIN_ERROR:
      return initialState;
    case LOGIN_INPUT_ERROR:
      return "Enter your email and password!";
    case LOGIN_FAILURE:
      return "Oops! The email and password didn't match. Try again!";
    case LOGIN_FAILURE_NO_CODE:
      return "Oops! Something went wrong! Is the server running?";
    default:
      return state;
  }
};

// registrationMessage for registration form
const registrationMessage = (state = initialState, action) => {
  // state.errors.registrationMessage
  switch (action.type) {
    case CLEAR_REGISTRATION_ERROR:
      return initialState;
    case REGISTRATION_INPUT_ERROR:
      return "Please fill required fields!";
    case REGISTER_USER_FAILURE:
      return "Oops! That didn't work. Try again!";
    default:
      return state;
  }
};

export default combineReducers({
  loginMessage,
  registrationMessage,
});
