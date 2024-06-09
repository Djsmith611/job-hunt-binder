import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import useData from "../../../modules/hooks/useData";
import { useDispatch } from "react-redux";
import { addLeadRequest } from "../../../modules/actions/leadActions";

export default function NewLeadForm({ setOpen }) {
  const data = useData();
  const {
    statuses: statusOptions,
    types: typeOptions,
    titles: titlesOptions,
    fields: fieldsOptions,
    companies: companiesOptions,
    locations: locationsOptions,
  } = data;

  const initialState = {
    status: "",
    title: "",
    field: "",
    company: "",
    location: "",
    type: "",
    notes: "",
    description: "",
  };

  const [newLead, setNewLead] = useState(initialState);

  const dispatch = useDispatch();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prevState) => ({
      ...prevState,
      [name]: parseInt(value, 10),
    }));
  };

  const handleAutocompleteChange = (event, newValue, field) => {
    setNewLead((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));
  };

  const handleClose = () => {
    setNewLead(initialState);
    setOpen(false);
  };

  const handleSubmit = () => {
    const leadToSend = {
      title:
        titlesOptions.find((option) => option.name === newLead.title)?.id ||
        newLead.title,
      status: newLead.status,
      field:
        fieldsOptions.find((option) => option.name === newLead.field)?.id ||
        newLead.field,
      company:
        companiesOptions.find((option) => option.name === newLead.company)
          ?.id || newLead.company,
      location:
        locationsOptions.find((option) => option.name === newLead.location)
          ?.id || newLead.location,
      type: newLead.type,
      notes: newLead.notes,
      description: newLead.description,
    };

    dispatch(addLeadRequest(leadToSend));
    handleClose();
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
        width: 400,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography
        variant="h6"
        component="h2"
        style={{ color: "black", textAlign: "center" }}
      >
        Add New Lead
      </Typography>
      <Select
        name="status"
        value={newLead.status}
        onChange={handleSelectChange}
        displayEmpty
        inputProps={{ "aria-label": "Status" }}
        fullWidth
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
            },
          },
          disableScrollLock: true,
        }}
      >
        <MenuItem value="" disabled>
          Select Status
        </MenuItem>
        {statusOptions.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        name="type"
        value={newLead.type}
        onChange={handleSelectChange}
        displayEmpty
        inputProps={{ "aria-label": "Type" }}
        fullWidth
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
            },
          },
          disableScrollLock: true,
        }}
      >
        <MenuItem value="" disabled>
          Select Type
        </MenuItem>
        {typeOptions.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
      <Autocomplete
        freeSolo
        options={titlesOptions.map((option) => option.name)}
        value={newLead.title}
        onChange={(event, newValue) =>
          handleAutocompleteChange(event, newValue, "title")
        }
        renderInput={(params) => (
          <TextField {...params} label="Title" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        options={fieldsOptions.map((option) => option.name)}
        value={newLead.field}
        onChange={(event, newValue) =>
          handleAutocompleteChange(event, newValue, "field")
        }
        renderInput={(params) => (
          <TextField {...params} label="Field" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        options={companiesOptions.map((option) => option.name)}
        value={newLead.company}
        onChange={(event, newValue) =>
          handleAutocompleteChange(event, newValue, "company")
        }
        renderInput={(params) => (
          <TextField {...params} label="Company" fullWidth />
        )}
      />
      <Autocomplete
        freeSolo
        options={locationsOptions.map((option) => option.name)}
        value={newLead.location}
        onChange={(event, newValue) =>
          handleAutocompleteChange(event, newValue, "location")
        }
        renderInput={(params) => (
          <TextField {...params} label="Location" fullWidth />
        )}
      />
      <TextField
        label="Notes"
        value={newLead.notes}
        onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
        multiline
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={newLead.description}
        onChange={(e) =>
          setNewLead({ ...newLead, description: e.target.value })
        }
        multiline
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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