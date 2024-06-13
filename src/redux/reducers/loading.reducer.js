import { FETCH_USER_REQUEST, SET_USER, UNSET_USER, FETCH_USER_FAILURE } from "../../modules/actions/loginActions";

const initialState = {
  loading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true };
    case SET_USER:
    case UNSET_USER:
    case FETCH_USER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loadingReducer;
