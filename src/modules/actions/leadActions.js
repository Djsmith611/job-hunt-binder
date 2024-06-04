/********************** SET DATA **************************/
export const SET_STATUSES = "SET_STATUSES";
export const SET_LOCATIONS = "SET_LOCATIONS";
export const SET_COMPANIES = "SET_COMPANIES";
export const SET_TITLES = "SET_TITLES";
export const SET_TYPES = "SET_TYPES";
export const SET_LEADS = "SET_LEADS";
export const SET_FIELDS = "SET_FIELDS";

/********************** FETCH DATA **************************/
export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";

/********************** FETCH LEADS **************************/
export const FETCH_LEADS_REQUEST = "FETCH_LEAD_REQUEST";
export const FETCH_LEADS_SUCCESS = "FETCH_LEAD_SUCCESS";
export const FETCH_LEADS_FAILURE = "FETCH_LEAD_FAILURE";

/********************** ADD LEAD **************************/
export const ADD_LEAD_REQUEST = "ADD_LEAD_REQUEST";
export const ADD_LEAD_SUCCESS = "ADD_LEAD_SUCCESS";
export const ADD_LEAD_FAILURE = "ADD_LEAD_FAILURE";

/********************** UPDATE STATUS **************************/
export const UPDATE_STATUS_REQUEST = "UPDATE_STATUS_REQUEST";
export const UPDATE_STATUS_SUCCESS = "UPDATE_STATUS_SUCCESS";
export const UPDATE_STATUS_FAILURE = "UPDATE_STATUS_FAILURE";

/********************** UPDATE LEAD **************************/
export const UPDATE_LEAD_REQUEST = "UPDATE_LEAD_REQUEST";
export const UPDATE_LEAD_SUCCESS = "UPDATE_LEAD_SUCCESS";
export const UPDATE_LEAD_FAILURE = "UPDATE_LEAD_FAILURE";

/********************** BATCH UPDATE **************************/
export const BATCH_UPDATE_REQUEST = "BATCH_UPDATE_REQUEST";
export const BATCH_UPDATE_SUCCESS = "BATCH_UPDATE_SUCCESS";
export const BATCH_UPDATE_FAILURE = "BATCH_UPDATE_FAILURE";

/********************** SET DATA **************************/
export const setStatuses = (statuses) => ({
  type: SET_STATUSES,
  payload: statuses,
});

export const setLocations = (locations) => ({
  type: SET_LOCATIONS,
  payload: locations,
});

export const setCompanies = (companies) => ({
  type: SET_COMPANIES,
  payload: companies,
});

export const setTitles = (titles) => ({
  type: SET_TITLES,
  payload: titles,
});

export const setTypes = (types) => ({
  type: SET_TYPES,
  payload: types,
});

export const setLeads = (leads) => ({
  type: SET_LEADS,
  payload: leads,
});

export const setFields = (fields) => ({
  type: SET_FIELDS,
  payload: fields,
});

/********************** FETCH DATA **************************/
export const fetchDataRequest = () => ({
  type: FETCH_DATA_REQUEST,
});

export const fetchDataSuccess = () => ({
  type: FETCH_DATA_SUCCESS,
});

export const fetchDataFailure = (error) => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

/********************** FETCH LEADS **************************/
export const fetchLeadsRequest = () => ({
  type: FETCH_LEADS_REQUEST,
});

export const fetchLeadsSuccess = () => ({
  type: FETCH_LEADS_SUCCESS,
});

export const fetchLeadsFailure = (error) => ({
  type: FETCH_LEADS_FAILURE,
  payload: error,
});

/********************** ADD LEAD **************************/
export const addLeadRequest = (lead) => ({
  type: ADD_LEAD_REQUEST,
  payload: lead,
});

export const addLeadSuccess = () => ({
  type: ADD_LEAD_SUCCESS,
});

export const addLeadFailure = (error) => ({
  type: ADD_LEAD_FAILURE,
  payload: error,
});

/********************** UPDATE STATUS **************************/
export const updateStatusRequest = (leadId, statusId) => ({
  type: UPDATE_STATUS_REQUEST,
  payload: {
    leadId: leadId,
    statusId: statusId,
  },
});

export const updateStatusSuccess = () => ({
  type: UPDATE_STATUS_SUCCESS,
});

export const updateStatusFailure = (error) => ({
  type: UPDATE_STATUS_FAILURE,
  payload: error,
});

/********************** UPDATE LEAD **************************/
export const updateLeadRequest = (lead) => ({
  type: UPDATE_LEAD_REQUEST,
  payload: lead,
});

export const updateLeadSuccess = () => ({
  type: UPDATE_LEAD_SUCCESS,
});

export const updateLeadFailure = (error) => ({
  type: UPDATE_LEAD_FAILURE,
  payload: error,
});

/********************** BATCH UPDATE *************************/
export const batchUpdateRequest = (leadIds, statusId) => ({
  type: BATCH_UPDATE_REQUEST,
  payload: {
    leadIds: leadIds,
    statusId: statusId,
  },
});

export const batchUpdateSuccess = () => ({
  type: BATCH_UPDATE_SUCCESS,
});

export const batchUpdateFailure = (error) => ({
  type: BATCH_UPDATE_FAILURE,
  payload: error,
});
