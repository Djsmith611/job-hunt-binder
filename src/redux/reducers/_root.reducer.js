import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import leads from "./leads.reducer";
import loading from "./loading.reducer";

const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  leads, // will have lead information
  loading, // for user object loading
});

export default rootReducer;
