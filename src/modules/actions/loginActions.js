/******************* LOGIN ******************/
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_FAILURE_NO_CODE = 'LOGIN_FAILURE_NO_CODE';
export const LOGIN_INPUT_ERROR = 'LOGIN_INPUT_ERROR';
export const CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR';

/******************* FETCH USER ******************/
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const SET_USER = 'SET_USER';

/******************* LOGOUT ******************/
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const UNSET_USER = 'UNSET_USER';
export const UNSET_USER_ERROR = 'UNSET_USER_ERROR';

/******************* LOGIN ******************/
export const loginRequest = (credentials) => ({
    type: LOGIN_REQUEST,
    payload: credentials,
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const loginFailureNoCode = () => ({
    type: LOGIN_FAILURE_NO_CODE,
});

export const loginInputError = () => ({
    type: LOGIN_INPUT_ERROR,
});

export const clearLoginError = () => ({
    type: CLEAR_LOGIN_ERROR,
});

/******************* FETCH USER ******************/
export const fetchUserRequest = () => ({
    type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = () => ({
    type: FETCH_USER_SUCCESS,
});

export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

/******************* LOGOUT ******************/
export const logoutRequest = () => ({
    type: LOGOUT_REQUEST,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

export const logoutFailure = (error) => ({
    type: LOGOUT_FAILURE,
    payload: error,
});

export const unsetUser = () => ({
    type: UNSET_USER,
});

export const unsetUserError = () => ({
    type: UNSET_USER_ERROR,
});








