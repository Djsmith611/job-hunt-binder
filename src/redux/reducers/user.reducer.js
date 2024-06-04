import { SET_USER, UNSET_USER } from "../../modules/actions/loginActions";

const initialState = {};

// Logged in user object
const userReducer = (state = initialState, action) => {
  // state.user
  const value = action.payload;
  switch (action.type) {
    case SET_USER:
      return value;
    case UNSET_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
