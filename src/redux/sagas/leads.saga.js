import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  ADD_LEAD_REQUEST,
  BATCH_UPDATE_REQUEST,
  FETCH_DATA_REQUEST,
  FETCH_LEADS_REQUEST,
  UPDATE_LEAD_REQUEST,
  UPDATE_STATUS_REQUEST,
  fetchDataFailure,
  fetchDataRequest,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  fetchLeadsRequest,
  setCompanies,
  setFields,
  setLeads,
  setLocations,
  setStatuses,
  setTitles,
  setTypes,
  DELETE_LEADS_REQUEST,
} from "../../modules/actions/leadActions";
import axios from "axios";

function* fetchLeads(action) {
  try {
    const leadsResponse = yield call(axios.get, "/api/leads");
    yield put(setLeads(leadsResponse.data));
    yield put(fetchLeadsSuccess());
    yield put(fetchDataRequest());
  } catch (error) {
    console.error(error);
    const message = error.message;
    yield put(fetchDataRequest());
    yield put(fetchLeadsFailure(message));
  } finally {
    yield put(fetchDataRequest());
  }
}

function* fetchData(action) {
  try {
    const [
      typeResponse,
      companiesResponse,
      locationsResponse,
      statusesResponse,
      titlesResponse,
      fieldsResponse,
    ] = yield all([
      call(axios.get, '/api/data/types'),
      call(axios.get, '/api/data/companies'),
      call(axios.get, '/api/data/locations'),
      call(axios.get, '/api/data/statuses'),
      call(axios.get, '/api/data/titles'),
      call(axios.get, '/api/data/fields'),
    ]);
      console.log(typeResponse.data);
    yield all([
      put(setTypes(typeResponse.data)),
      put(setCompanies(companiesResponse.data)),
      put(setLocations(locationsResponse.data)),
      put(setStatuses(statusesResponse.data)),
      put(setTitles(titlesResponse.data)),
      put(setFields(fieldsResponse.data)),
    ]);
   
  } catch (error) {
    console.error(error);
    const message = error.message;
    yield put(fetchDataFailure(message));
  }
}

function* addLead(action) {
  const lead = action.payload;
  let leadToPost = { ...lead };

  const replaceWithIds = async (field, value) => {
    try {
      console.log(`/api/data/${field}`, {value});
      const idResponse = await axios.post(`/api/data/${field}`, {value});
      return idResponse.data;
    } catch (error) {
      console.error(error);
    }
  };

  for (let key in lead) {
    if (typeof lead[key] === "string" && key !== 'type' && key !== 'status') {
      const numericValue = parseInt(lead[key], 10);
      if (!isNaN(numericValue)) {
        leadToPost[key] = numericValue;
      } else {
        try {
          const id = yield call(replaceWithIds(key, lead[key])) ;
          leadToPost[key] = parseInt(id);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  try {
    yield call(axios.post, "/api/leads", leadToPost);
    yield put(fetchLeadsRequest());
  } catch (error) {
    console.error(error);
  }
}

/*************** BATCH UPDATE STATUS *****************/
function* batchUpdate(action) {
  const leadIds = action.payload.leadIds;
  const statusId = action.payload.statusId;
  const body = { leadIds:leadIds, statusId:statusId };
  try {
    yield call(axios.put, "/api/leads/batch", body);
    yield put(fetchLeadsRequest());
  } catch (error) {
    console.error(error);
  }
}

/************** UPDATE LEAD STATUS ************/
function* updateLeadStatus(action) {
  const leadId = parseInt(action.payload.leadId);
  const statusId = parseInt(action.payload.statusId);
  try {
    yield call(axios.put, `/api/leads/status/${leadId}`, {statusId: statusId});
    yield put(fetchLeadsRequest());
  } catch (error) {
    console.error(error);
  }
}
/************** UPDATE LEAD ************/
function* updateLead(action) {
  console.log(action);
  const leadId = parseInt(action.payload.id);
  const lead = action.payload;
  console.log(lead);
  let leadToPost = { ...lead };
  const replaceWithIds = async (field, value) => {
    try {
      const idResponse = await axios.post(`/api/data/${field}`, {value});
      return idResponse.data;
    } catch (error) {
      console.error(error);
    }
  };
  for (let key in lead) {
    if (typeof lead[key] === "string" && key !== "notes" && key !== "description") {
      const numericValue = parseInt(lead[key], 10);
      if (!isNaN(numericValue)) {
        leadToPost[key] = numericValue;
      } else {
        try {
          const id = yield replaceWithIds(key, lead[key]);
          leadToPost[key] = parseInt(id);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  try {
    yield call(axios.put, `/api/leads/${leadId}`, leadToPost);
    yield put(fetchLeadsRequest());
  } catch (error) {
    console.error(error);
  }
}

/************** DELETE LEADS ************/
function* deleteLeads(action) {
  const leadIds = action.payload.leadIds;
  try {
    yield call(axios.delete, "/api/leads/delete", {
      data: {leadIds: leadIds}
    });
    yield put(fetchLeadsRequest());
  } catch(error){
    console.error(error);
  }
}

export default function* leadSaga() {
  yield takeLatest(FETCH_LEADS_REQUEST, fetchLeads);
  yield takeLatest(FETCH_DATA_REQUEST, fetchData);
  yield takeLatest(ADD_LEAD_REQUEST, addLead);
  yield takeLatest(UPDATE_STATUS_REQUEST, updateLeadStatus);
  yield takeLatest(BATCH_UPDATE_REQUEST, batchUpdate);
  yield takeLatest(UPDATE_LEAD_REQUEST, updateLead);
  yield takeLatest(DELETE_LEADS_REQUEST, deleteLeads);
}
