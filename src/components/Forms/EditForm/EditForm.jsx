import { Autocomplete, Box, TextField, Select, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import useData from "../../../modules/hooks/useData";
import { useDispatch } from "react-redux";
import { updateLeadRequest } from "../../../modules/actions/leadActions";

export default function EditForm({ lead, closeEdit }) {
  const data = useData();
  const {
    statuses: statusOptions,
    types: typeOptions,
    titles: titlesOptions,
    fields: fieldsOptions,
    companies: companiesOptions,
    locations: locationsOptions,
  } = data;

  const {
    title: initialTitle,
    status: initialStatus,
    field: initialField,
    company: initialCompany,
    location: initialLocation,
    type: initialType,
    notes: initialNotes,
    description: initialDescription,
    document: initialDocument,
  } = lead;

  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState(initialStatus);
  const [field, setField] = useState(initialField);
  const [company, setCompany] = useState(initialCompany);
  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [notes, setNotes] = useState(initialNotes);
  const [description, setDescription] = useState(initialDescription);
  const [document, setDocument] = useState(initialDocument);

  const dispatch = useDispatch();

  const sendLead = () => {
    const leadToSend = {
      title: titlesOptions.find(option => option.name === title)?.id || title,
      status: status,
      field: fieldsOptions.find(option => option.name === field)?.id || field,
      company: companiesOptions.find(option => option.name === company)?.id || company,
      location: locationsOptions.find(option => option.name === location)?.id || location,
      type: type,
      notes: notes,
      description: description,
      document: document
    };

    dispatch(updateLeadRequest(leadToSend));
  };

  const handleAutoCompleteChange = (event, newValue, setter) => {
    setter(newValue);
  };

  const handleClose = () => {
    closeEdit();
  };

  const handleSubmit = () => {
    sendLead();
    handleClose();
  };

  return (
    <Box>
      <Select
        name="status"
        value={status}
        onChange={(e) => setStatus(parseInt(e.target.value))}
        inputProps={{ "aria-label": "Status" }}
        fullWidth
        margin="normal"
      >
        {statusOptions.map((status) => (
          <MenuItem key={status.id} value={status.id}>
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
        margin="normal"
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
        onInputChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setTitle)
        }
        renderInput={(params) => <TextField {...params} label="Title" fullWidth margin="normal" />}
      />
      <Autocomplete
        freeSolo
        value={field}
        options={fieldsOptions.map((option) => option.name)}
        onInputChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setField)
        }
        renderInput={(params) => <TextField {...params} label="Field" fullWidth margin="normal" />}
      />
      <Autocomplete
        freeSolo
        value={company}
        options={companiesOptions.map((option) => option.name)}
        onInputChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setCompany)
        }
        renderInput={(params) => <TextField {...params} label="Company" fullWidth margin="normal" />}
      />
      <Autocomplete
        freeSolo
        value={location}
        options={locationsOptions.map((option) => option.name)}
        onInputChange={(event, newInputValue) =>
          handleAutoCompleteChange(event, newInputValue, setLocation)
        }
        renderInput={(params) => <TextField {...params} label="Location" fullWidth margin="normal" />}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        fullWidth
        margin="normal"
      />
      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        fullWidth
        margin="normal"
      />
      <TextField
        label="Document"
        type="file"
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button variant="text" onClick={handleClose} sx={{ color: 'grey', '&:hover': { color: 'red' } }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: 'black', color: 'red', '&:hover': { color: 'white', backgroundColor: 'red' } }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}