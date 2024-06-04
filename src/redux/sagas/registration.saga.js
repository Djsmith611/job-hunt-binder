import { call, put, takeLatest } from 'redux-saga/effects';
import { loginRequest } from '../../modules/actions/loginActions';
import { REGISTER_USER_REQUEST, registerUserFailure, setToLoginMode, clearRegistrationError } from '../../modules/actions/registrationActions';

import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  const user = action.payload;
  try {
    yield put(clearRegistrationError());
    yield call(axios.post, "/api/user/register", user);
    yield put(loginRequest({email: user.email, password: user.password}));
    yield put(setToLoginMode());
  } catch (error) {
    const message = error.message;
    yield put(registerUserFailure(message));
  }
}

export default function* registrationSaga() {
  yield takeLatest(REGISTER_USER_REQUEST, registerUser);
}
