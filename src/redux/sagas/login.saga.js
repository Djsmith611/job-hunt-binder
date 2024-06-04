import axios from "axios";
import {
  unsetUser,
  loginFailure,
  unsetUserError,
  clearLoginError,
  loginFailureNoCode,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  fetchUserRequest,
} from "../../modules/actions/loginActions";
import { call, put, takeLatest } from "redux-saga/effects";
import { fetchLeadsRequest } from "../../modules/actions/leadActions";

const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

function* loginUser(action) {
  try {
    yield put(clearLoginError()); // clear any existing error on the login page
    yield call(axios.post, "/api/user/login", action.payload, config);
    yield put(fetchUserRequest());
    yield put(fetchLeadsRequest());
  } catch (error) {
    const message = error.message;
    if (error.response.status === 401) {
      yield put(loginFailure(message)); // incorrect email and/or password
    } else {
      yield put(loginFailureNoCode(message)); // other than 401
    }
  }
}

function* logoutUser(action) {
  try {
    yield call(axios.post, "/api/user/logout", config);
    yield put(unsetUser());
  } catch (error) {
    const message = error.message;
    yield put(unsetUserError(message));
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginUser);
  yield takeLatest(LOGOUT_REQUEST, logoutUser);
}
