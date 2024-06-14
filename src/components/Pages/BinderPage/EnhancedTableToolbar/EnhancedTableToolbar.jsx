import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function EnhancedTableToolbar(props) {
  const { numSelected, handleBatchStatusChange, statusOptions, deleteSelected } = props;
  const [batchStatus, setBatchStatus] = useState("");

  const handleChange = (event) => {
    setBatchStatus(event.target.value);
    handleBatchStatusChange(event.target.value);
    setBatchStatus("");
  };

  return (
    <Toolbar
      sx={{
        borderRadius:"15px 15px 0 0",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Select
            value={batchStatus}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Batch Status" }}
            sx={{ minWidth:"250px", marginRight:"40%", textAlign:"center" }}
          >
            <MenuItem value="" disabled>
              Select Status to Apply
            </MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status.name} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Binder
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => deleteSelected()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleBatchStatusChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
};
