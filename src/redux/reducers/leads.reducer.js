import { combineReducers } from "redux";
import {
  SET_COMPANIES,
  SET_LOCATIONS,
  SET_STATUSES,
  SET_TITLES,
  SET_TYPES,
  SET_FIELDS,
  SET_LEADS,
  FETCH_LEADS_REQUEST,
  FETCH_LEADS_SUCCESS,
  FETCH_LEADS_FAILURE,
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

const initialLeadLoadState = {
  loading: false,
  error: null,
};


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

const leadLoadReducer = (state = initialLeadLoadState, action) => {
  switch(action.type) {
    case FETCH_LEADS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_LEADS_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case FETCH_LEADS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state;
  }
};

export default combineReducers({
  data: dataReducer,
  leads: leadsReducer,
  leadLoad: leadLoadReducer,
});
