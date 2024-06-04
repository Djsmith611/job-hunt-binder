import { combineReducers } from "redux";
import {
  SET_COMPANIES,
  SET_LOCATIONS,
  SET_STATUSES,
  SET_TITLES,
  SET_TYPES,
  SET_FIELDS,
  SET_LEADS,
} from "../../modules/actions/leadActions";

const initialDataState = {
  statuses: [],
  companies: [],
  titles: [],
  locations: [],
  types: [],
  fields: [],
};

const initialLeadsState = [];

const dataReducer = (state = initialDataState, action) => {
  const values = action.payload;
  switch (action.type) {
    case SET_STATUSES:
      return {
        ...state,
        statuses: values,
      };
    case SET_COMPANIES:
      return {
        ...state,
        companies: values,
      };
    case SET_TITLES:
      return {
        ...state,
        titles: values,
      };
    case SET_LOCATIONS:
      return {
        ...state,
        locations: values,
      };
    case SET_TYPES:
      return {
        ...state,
        types: values,
      };
    case SET_FIELDS:
      return {
        ...state,
        fields: values,
      };
    default:
      return state;
  }
};

const leadsReducer = (state = initialLeadsState, action) => {
  switch (action.type) {
    case SET_LEADS:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  data: dataReducer,
  leads: leadsReducer,
});
