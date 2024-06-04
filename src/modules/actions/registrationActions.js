/*********************** REGISTRATION ****************************/
export const REGISTER_USER_REQUEST = "REGISTER_USER_REQUEST";
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";
export const REGISTRATION_INPUT_ERROR = "REGISTRATION_INPUT_ERROR";
export const CLEAR_REGISTRATION_ERROR = "CLEAR_REGISTRATION_ERROR";
export const SET_TO_LOGIN_MODE = "SET_TO_LOGIN_MODE";

export const registerUserRequest = (user) => ({
  type: REGISTER_USER_REQUEST,
  payload: user,
});

export const registerUserSuccess = () => ({
  type: REGISTER_USER_SUCCESS,
});

export const registerUserFailure = (error) => ({
  type: REGISTER_USER_FAILURE,
  payload: error,
});

export const registrationInputError = () => ({
  type: REGISTRATION_INPUT_ERROR,
});

export const clearRegistrationError = () => ({
    type: CLEAR_REGISTRATION_ERROR,
});

export const setToLoginMode = () => ({
    type: SET_TO_LOGIN_MODE,
});
