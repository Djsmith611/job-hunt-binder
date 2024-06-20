import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import useData from "../../../modules/hooks/useData";
import { useDispatch } from "react-redux";
import {
  updateLeadRequest,
  uploadDocumentRequest,
} from "../../../modules/actions/leadActions";

export default function EditForm({ lead, closeEdit }) {
  const data = useData();
  const {
    statuses: statusOptions = [],
    types: typeOptions = [],
    titles: titlesOptions = [],
    fields: fieldsOptions = [],
    companies: companiesOptions = [],
    locations: locationsOptions = [],
  } = data;

  const [id, setId] = useState(lead?.id || 1);
  const [title, setTitle] = useState(lead?.title || "");
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.name === lead?.status)?.id || ""
  );
  const [field, setField] = useState(lead?.field || "");
  const [company, setCompany] = useState(lead?.company || "");
  const [location, setLocation] = useState(lead?.location || "");
  const [type, setType] = useState(
    typeOptions.find((option) => option.name === lead?.type)?.id || ""
  );
  const [notes, setNotes] = useState(lead?.notes || "");
  const [description, setDescription] = useState(lead?.description || "");
  const [document, setDocument] = useState(null);

  useEffect(() => {
    if (lead && statusOptions.length && typeOptions.length) {
      setId(lead.id || 1);
      setTitle(lead.title || "");
      setStatus(
        statusOptions.find((option) => option.name === lead.status)?.id || ""
      );
      setField(lead.field || "");
      setCompany(lead.company || "");
      setLocation(lead.location || "");
      setType(
        typeOptions.find((option) => option.name === lead.type)?.id || ""
      );
      setNotes(lead.notes || "");
      setDescription(lead.description || "");
    }
  }, [lead, statusOptions, typeOptions]);

  const dispatch = useDispatch();

  const sendLead = () => {
    const leadToSend = {
      id: lead.id,
      title: titlesOptions.find((option) => option.name === title)?.id || title,
      status: status,
      field: fieldsOptions.find((option) => option.name === field)?.id || field,
      company:
        companiesOptions.find((option) => option.name === company)?.id ||
        company,
      location:
        locationsOptions.find((option) => option.name === location)?.id ||
        location,
      type: type,
      notes: notes,
      description: description,
    };

    dispatch(updateLeadRequest(leadToSend));
  };

  const handleAutoCompleteChange = (event, newValue, setter) => {
    setter(newValue);
  };

  const handleClose = () => {
    setDocument(null);
    closeEdit();
  };

  const handleSubmit = () => {
    sendLead();
    if (document) {
      const formData = new FormData();
      formData.append("document", document);
      dispatch(uploadDocumentRequest(formData, id));
      setDocument(null);
    }
    handleClose();
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 1,
        boxShadow: 24,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "80%",
        maxWidth: 400,
        maxHeight: "80vh",
        overflowY: "auto",
        margin: "0 auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography
        variant="h6"
        component="h2"
        style={{ color: "black", textAlign: "center" }}
      >
        Edit Lead
      </Typography>
      <Select
        name="status"
        value={status}
        onChange={(e) => setStatus(parseInt(e.target.value))}
        inputProps={{ "aria-label": "Status" }}
        fullWidth
      >
        {statusOptions.map((status) => (
          <MenuItem
            key={status.id}
            value={status.id}
            sx={{ color: status.color }}
          >
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        name="type"
        value={type}
        onChange={(e) => setType(parseInt(e.target.value))}
        inputProps={{ "aria-label": "Type" }}
        fullWidth
      >
        {typeOptions.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
      <Autocomplete
        freeSolo
        value={title}
        options={titlesOptions.map((option) => option.name)}
        onChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setTitle)
        }
        renderInput={(params) => (
          <TextField {...params} label="Title" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        value={field}
        options={fieldsOptions.map((option) => option.name)}
        onChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setField)
        }
        renderInput={(params) => (
          <TextField {...params} label="Field" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        value={company}
        options={companiesOptions.map((option) => option.name)}
        onChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setCompany)
        }
        renderInput={(params) => (
          <TextField {...params} label="Company" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        value={location}
        options={locationsOptions.map((option) => option.name)}
        onChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setLocation)
        }
        renderInput={(params) => (
          <TextField {...params} label="Location" fullWidth />
        )}
      />
      <Typography
        variant="body1"
        style={{ color: "black", textAlign: "center" }}
      >
        Description
      </Typography>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        fullWidth
        style={{
          minHeight: "200px",
          maxHeight: "400px",
          overflow: "auto",
        }}
      />
      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        fullWidth
      />
      <Typography
        variant="body1"
        component="h3"
        style={{ color: "black", textAlign: "center" }}
      >
        Add your Resume (optional)
      </Typography>
      <TextField type="file" onChange={handleDocumentChange} fullWidth />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ color: "grey", "&:hover": { color: "red" } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "black",
            color: "red",
            "&:hover": { color: "white", backgroundColor: "red" },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
