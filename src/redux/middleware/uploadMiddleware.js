import { fetchLeadsRequest } from "../../modules/actions/leadActions";
import {
  UPLOAD_DOCUMENT_REQUEST,
  uploadDocumentSuccess,
  uploadDocumentFailure,
} from "../../modules/actions/leadActions";
import axios from "axios";

const uploadMiddleware = (store) => (next) => async (action) => {
  if (action.type === UPLOAD_DOCUMENT_REQUEST) {
    const { document, leadId } = action.payload;

    try {
      const response = await axios.post(`/api/upload`, document, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const documentUrl = response.data.documentUrl;
      await axios.post(`/api/upload/documents`, {documentUrl, leadId})
, 
      console.log("Upload successful:", documentUrl);

      store.dispatch(uploadDocumentSuccess({ documentUrl, leadId }));
      store.dispatch(fetchLeadsRequest());
    } catch (error) {
      console.error("Upload failed:", error);
      store.dispatch(uploadDocumentFailure(error.message));
    }
  }

  return next(action);
};

export default uploadMiddleware;