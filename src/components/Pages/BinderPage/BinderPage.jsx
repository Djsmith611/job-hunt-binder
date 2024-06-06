import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  Select,
  Backdrop,
  Checkbox,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditForm from "../../Forms/EditForm/EditForm";
import NewLeadForm from "../../Forms/";
import { useDispatch } from "react-redux";
import {
  submitLeadRetrieval,
  addLeadRequest,
  updateLeadRequest,
  batchUpdateRequest,
} from "../../../modules/actions/leadActions";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useMemo } from "react";
import useLeads from "../../../modules/hooks/useLeads";
import EnhancedTableHead from "../../";
import EnhancedTableToolbar from "../EnhancedTableToolbar/EnhancedTableToolbar";

// Utility function for stable sorting
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

// Function to get the comparator based on the order and orderBy
const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Comparator function for descending order
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

// Main component for managing leads
export default function Binder() {
  const dispatch = useDispatch();

  // Fetch leads data on component mount
  useEffect(() => {
    dispatch(submitLeadRetrieval());
  }, [dispatch]);

  // Fetch leads and their options
  const leads = useLeads();
  const {
    statuses: statusOptions,
    companies: companiesOptions,
    locations: locationsOptions,
    titles: titlesOptions,
    types: typesOptions,
    fields: fieldsOptions,
    leads: rowsData,
  } = leads.pop;

  // State variables for table and pagination
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("status");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State variables for modals and forms
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newLead, setNewLead] = useState(initialState);
  const [addlParams, setAddlParams] = useState(addlInitialState);
  const [leadToEdit, setLeadToEdit] = useState({});
  const [isDocumentUpload, setIsDocumentUpload] = useState(false);

  // Handle sorting request
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle select all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // Handle row click for selection
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle density change
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Check if a row is selected
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Handle status edit for a row
  const handleStatusEdit = async (id, value) => {
    const leadToUpdate = rowsData.find((row) => row.id === id);
    const leadWithIds = {
      id: leadToUpdate.id,
      status: await statusOptions.find((status) => status.name === value)?.id,
      title: await titlesOptions.find(
        (title) => title.name === leadToUpdate.title
      )?.id,
      field: await fieldsOptions.find(
        (field) => field.name === leadToUpdate.field
      )?.id,
      company: await companiesOptions.find(
        (company) => company.name === leadToUpdate.company
      )?.id,
      location: await locationsOptions.find(
        (location) => location.name === leadToUpdate.location
      )?.id,
      type: await typesOptions.find((type) => type.name === leadToUpdate.type)
        ?.id,
      notes: leadToUpdate.notes,
      description: leadToUpdate.description,
    };
    dispatch(updateLeadRequest(leadWithIds));
  };

  // Handle batch status change
  const handleBatchStatusChange = (newStatus) => {
    dispatch(batchUpdateRequest(newStatus, selected));
    setSelected([]);
  };

  // Handle add new lead click
  const handleAddNewClick = () => {
    setOpen(true);
  };

  // Handle close of the new lead form
  const handleClose = () => {
    setNewLead(initialState);
    setAddlParams(addlInitialState);
    setOpen(false);
  };

  // Handle edit form open
  const openEdit = (row) => {
    setIsEdit(true);
    setLeadToEdit(row);
  };

  // Handle edit form close
  const closeEdit = () => {
    setIsEdit(false);
    setLeadToEdit({});
  };

  // Handle submit of the new lead form
  const handleSubmit = () => {
    dispatch(addLeadRequest(newLead, addlParams));
    handleClose();
  };

  // Calculate empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsData.length) : 0;

  // Get visible rows based on sorting and pagination
  const visibleRows = useMemo(
    () =>
      stableSort(rowsData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rowsData]
  );

  return (
    <div className="container">
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleBatchStatusChange={handleBatchStatusChange}
          statusOptions={statusOptions}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowsData.length}
              onAddNewClick={handleAddNewClick}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, row.id)}
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Select
                        value={row.status}
                        variant="standard"
                        onChange={(event) =>
                          handleStatusEdit(row.id, event.target.value)
                        }
                        sx={{ color: row.color }}
                        inputProps={{ "aria-label": "Status" }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem
                            key={status.id}
                            value={status.name}
                            sx={{ color: status.color }}
                          >
                            {status.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">{row.field}</TableCell>
                    <TableCell align="left">{row.company}</TableCell>
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell align="left">{row.type}</TableCell>
                    <TableCell align="left">{row.notes}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">
                      <a
                        href={row.documents}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <NewLeadForm
            setOpen={setOpen}
        />
      </Backdrop>
      <Backdrop open={isEdit} onClick={closeEdit}>
        <EditForm
          closeEdit={closeEdit}
        />
      </Backdrop>
    </div>
  );
}
