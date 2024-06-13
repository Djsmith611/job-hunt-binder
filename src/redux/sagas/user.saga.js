import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchUserSuccess,
  fetchUserFailure,
  FETCH_USER_REQUEST,
  setUser,
} from "../../modules/actions/loginActions";

function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const response = yield call(axios.get, "/api/user", config);
    yield put(setUser(response.data));
    yield put(fetchUserSuccess());
  } catch (error) {
    const message = error.message;
    yield put(fetchUserFailure(message));
  }
}

function* userSaga() {
  yield takeLatest(FETCH_USER_REQUEST, fetchUser);
}

export default userSaga;
