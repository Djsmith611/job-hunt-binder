import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setUser,
  fetchUserFailure,
  FETCH_USER_REQUEST,
} from "../../modules/actions/loginActions";

function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const response = yield call(axios.get, "/api/user", config);
    yield put(setUser(response.data));
  } catch (error) {
    const message = error.message;
    yield put(fetchUserFailure(message));
  }
}

function* userSaga() {
  yield takeLatest(FETCH_USER_REQUEST, fetchUser);
}

export default userSaga;
