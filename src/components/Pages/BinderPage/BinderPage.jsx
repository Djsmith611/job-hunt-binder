import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Select,
  Backdrop,
  Checkbox,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress, // Was used for loading but removed
} from "@mui/material";
import EditForm from "../../Forms/EditForm/EditForm";
import NewLeadForm from "../../Forms/NewLeadForm/NewLeadForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeadsRequest,
  updateStatusRequest,
  batchUpdateRequest,
  deleteLeadsRequest,
} from "../../../modules/actions/leadActions";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useMemo } from "react";
import EnhancedTableHead from "./EnhancedTableHead/EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar/EnhancedTableToolbar";
import useLeads from "../../../modules/hooks/useLeads";
import useLeadLoad from "../../../modules/hooks/useLeadLoad";
import useData from "../../../modules/hooks/useData";
import "./BinderPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";


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
export default function BinderPage() {
  const dispatch = useDispatch();

  // Fetch leads data on component mount
  useEffect(() => {
    dispatch(fetchLeadsRequest());
  }, [dispatch]);

  // Fetch leads and their options
  const data = useData();
  const leads = useLeads();
  const leadLoad = useLeadLoad();

  const {
    statuses: statusOptions = [],
    companies: companiesOptions = [],
    locations: locationsOptions = [],
    titles: titlesOptions = [],
    types: typesOptions = [],
    fields: fieldsOptions = [],
  } = data;

  const rowsData = leads;

  // State variables for table and pagination
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("status");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const initialRowState = {
    status: "",
    title: "",
    field: "",
    company: "",
    location: "",
    type: "",
    notes: "",
    description: "",
  };

  const [isDescription, setIsDescription] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [rowClicked, setRowClicked] = useState({});

  const openDescription = (row) => {
    setRowClicked(row);
    setIsDescription(true);
  };

  const closeDescription = () => {
    setIsDescription(false);
    setRowClicked({});
  };

  const openNotes = (row) => {
    setRowClicked(row);
    setIsNotes(true);
  };

  const closeNotes = () => {
    setIsNotes(false);
    setRowClicked({});
  };

  // State variables for modals and forms
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState({});

  // Handle sorting request
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle select all rows
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllClick = () => {
    if (selectAllChecked) {
      setSelected([]);
    } else {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
    }
    setSelectAllChecked(!selectAllChecked);
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
  const handleStatusEdit = async (leadId, statusName) => {
    const statusId = await statusOptions.find(
      (option) => option.name === statusName
    )?.id;
    dispatch(updateStatusRequest(leadId, statusId));
  };

  // Handle batch status change
  const handleBatchStatusChange = (statusId) => {
    dispatch(batchUpdateRequest(statusId, selected));
    setSelected([]);
    setSelectAllChecked(false);
  };

  const deleteSelected = () => {
    dispatch(deleteLeadsRequest(selected));
    setSelected([]);
  };

  // Handle add new lead click
  const handleAddNewClick = () => {
    setOpen(true);
  };

  // Handle close of the new lead form
  const handleClose = () => {
    setOpen(false);
  };

  // Handle edit form open
  const openEdit = (row) => {
    setLeadToEdit(row);
    setIsEdit(true);
  };

  // Handle edit form close
  const closeEdit = () => {
    setIsEdit(false);
    setLeadToEdit({});
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

  const deleteRow = (id) => {
    dispatch(deleteLeadsRequest([id]));
  };

  // State to track hovered row
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <motion.div className="container" style={{ margin: "30px auto", width: "90%" }} 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}>
      <Paper sx={{  backgroundColor:"#ffffff", boxShadow:"1px 1px 15px rgba(0, 0, 0, 0.229)", borderRadius:"15px" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleBatchStatusChange={handleBatchStatusChange}
          statusOptions={statusOptions}
          deleteSelected={deleteSelected}
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
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{fontSize:"12px"}}
                  >
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
                        margin={dense ? "dense" : "none"}
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
                    {row.notes === "" ? (
                      <TableCell></TableCell>
                    ) : (
                      <TableCell
                        align="left"
                        onClick={() => openNotes(row)}
                        sx={{
                          cursor: "pointer",
                          color: "darkblue",
                          "&:hover": { color: "blue" },
                        }}
                      >
                        View Notes
                      </TableCell>
                    )}

                    {row.description === "" ? (
                      <TableCell></TableCell>
                    ) : (
                      <TableCell
                        align="left"
                        onClick={() => openDescription(row)}
                        sx={{
                          cursor: "pointer",
                          color: "darkblue",
                          "&:hover": { color: "blue" },
                        }}
                      >
                        View Description
                      </TableCell>
                    )}
                    <TableCell align="left">
                      {row.document === null ? (
                        ""
                      ) : (
                        <a
                          href={row.document}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => openEdit(row)}
                          style={{
                            visibility:
                              hoveredRow === row.id ? "visible" : "hidden",
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => deleteRow(row.id)}
                          style={{
                            visibility:
                              hoveredRow === row.id ? "visible" : "hidden",
                          }}
                        >
                          <DeleteIcon />
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
        <NewLeadForm setOpen={setOpen} />
      </Backdrop>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isEdit}
        onClick={closeEdit}
      >
        <EditForm lead={leadToEdit} closeEdit={closeEdit} />
      </Backdrop>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isDescription}
        onClick={closeDescription}
      >
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
            style={{ color: "black", textAlign: "center" }}
          >
            Description
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "black", textAlign: "center" }}
          >
            {rowClicked.description}
          </Typography>
        </Box>
      </Backdrop>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isNotes}
        onClick={closeNotes}
      >
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
            style={{ color: "black", textAlign: "center" }}
          >
            Notes
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "black", textAlign: "center" }}
          >
            {rowClicked.notes}
          </Typography>
        </Box>
      </Backdrop>
    </motion.div>
  );
}
