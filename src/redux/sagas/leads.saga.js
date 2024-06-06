import { call, put, takeLatest } from "redux-saga/effects";
import {
  ADD_LEAD_REQUEST,
  BATCH_UPDATE_REQUEST,
  FETCH_DATA_REQUEST,
  FETCH_LEADS_REQUEST,
  UPDATE_LEAD_REQUEST,
  UPDATE_STATUS_REQUEST,
  fetchDataFailure,
  fetchDataRequest,
  fetchLeadsFailure,
  fetchLeadsRequest,
  setCompanies,
  setFields,
  setLeads,
  setLocations,
  setStatuses,
  setTitles,
  setTypes,
} from "../../modules/actions/leadActions";

function* fetchLeads(action) {
  try {
    const leadsResponse = yield call(axios.get, "/api/leads");
    yield put(setLeads(leadsResponse.data));
    yield put(fetchDataRequest());
  } catch (error) {
    console.error(error);
    const message = error.message;
    yield put(fetchLeadsFailure(message));
  }
}

function* fetchData(action) {
  try {
    const typesResponse = yield call(axios.get, "/api/data/types");
    yield put(setTypes(typesResponse.data));

    const companiesResponse = yield call(axios.get, "/api/data/companies");
    yield put(setCompanies(companiesResponse.data));

    const locationsResponse = yield call(axios.get, "/api/data/locations");
    yield put(setLocations(locationsResponse.data));

    const statusesResponse = yield call(axios.get, "/api/data/statuses");
    yield put(setStatuses(statusesResponse.data));

    const titlesResponse = yield call(axios.get, "/api/data/titles");
    yield put(setTitles(titlesResponse.data));

    const fieldsResponse = yield call(axios.get, "/api/data/fields");
    yield put(setFields(fieldsResponse.data));
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
      const idResponse = await axios.post(`/api/data/${field}`, {value});
      return idResponse.data;
    } catch (error) {
      console.error(error);
    }
  };

  for (let key in lead) {
    if (typeof lead[key] === "string") {
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

/*************** BATCH UPDATE *****************/
function* batchUpdate(action) {
  const leadIds = action.payload.leadIds;
  const statusId = action.payload.statusId;
  const body = { leadIds, statusId };
  try {
    yield call(axios.put, "/api/leads", body);
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
    yield call(axios.put, `/api/leads/status/${leadId}`, statusId);
    yield put(fetchLeadsRequest());
  } catch (error) {
    console.error(error);
  }
}

function* updateLead(action) {
  const leadId = parseInt(action.payload.leadId);
  const lead = action.payload.lead;
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
    if (typeof lead[key] === "string") {
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

export default function* leadSaga() {
  yield takeLatest(FETCH_LEADS_REQUEST, fetchLeads);
  yield takeLatest(FETCH_DATA_REQUEST, fetchData);
  yield takeLatest(ADD_LEAD_REQUEST, addLead);
  yield takeLatest(UPDATE_STATUS_REQUEST, updateLeadStatus);
  yield takeLatest(BATCH_UPDATE_REQUEST, batchUpdate);
  yield takeLatest(UPDATE_LEAD_REQUEST, updateLead);
}
