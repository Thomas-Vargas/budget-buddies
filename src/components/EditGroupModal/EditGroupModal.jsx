import * as React from "react";
import {
  Modal,
  Paper,
  Typography,
  Button,
  Stack,
  Backdrop,
  Fade,
  TextField,
  Snackbar,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Base: edit name and income
// Stretch: add/remove users, delete group
const EditGroupModal = ({ openEditModal, handleEditClose, totalMembers }) => {
  const [editedGroupInfo, setEditedGroupInfo] = useState({
    name: "",
    income1: "",
    income2: "",
  });
  const [numberOfMembers, setNumberOfMembers] = [0];
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [snackSuccessOpen, setSnackSuccessOpen] = useState(false);
  const [snackFailureOpen, setSnackFailureOpen] = useState(false);

  console.log("totalMembers: ", totalMembers)

  const handleDeleteModalClose = () => {
    setDeleteGroupOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackSuccessOpen(false);
    setSnackFailureOpen(false);
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const currentGroup = useSelector((store) => store.currentGroup);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  const saveGroupChanges = () => {
    if (editedGroupInfo.name || editedGroupInfo.income1) {
      // update "groups".name, need "groups".id -> currentGroup.groupId
      if (editedGroupInfo.name) {
        dispatch({
          type: "UPDATE_GROUP_NAME",
          payload: { ...editedGroupInfo, id: currentGroup.groupId },
        });
      }
      if (editedGroupInfo.income1) {
        // update "budget".totalBudget, need "budget".id
        const newObj = {
          totalBudget:
            Number(editedGroupInfo.income1) + Number(editedGroupInfo.income2),
          id: currentGroup.groupId,
          budgetId: currentGroup.id,
        };

        dispatch({
          type: "UPDATE_BUDGET_AMOUNT",
          payload: newObj,
        });
      }
      setEditedGroupInfo({
        name: "",
        income1: "",
        income2: "",
      });

      handleEditClose();
      setSnackSuccessOpen(true);
    } else {
      setSnackFailureOpen(true);
    }
  };

  const deleteGroup = () => {
    dispatch({
      type: "DELETE_GROUP",
      payload: { groupId: currentGroup.groupId, budgetId: currentGroup.id },
    });
    dispatch({ type: "UNSET_CURRENT_GROUP" });
    history.push("/newGroup");
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditModal}
        onClose={handleEditClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEditModal}>
          <Paper sx={{ ...style, border: "none" }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography id="transition-modal-title" variant="h5">
                Edit Group
              </Typography>
              <IconButton onClick={() => setDeleteGroupOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Stack direction="column" gap="20px" mt="20px" width="70%">
              <TextField
                type="text"
                label="Group Name"
                variant="outlined"
                required
                value={editedGroupInfo.name}
                onChange={(e) =>
                  setEditedGroupInfo({
                    ...editedGroupInfo,
                    name: e.target.value,
                  })
                }
              />
              <Stack direction="column" gap="10px">
                {totalMembers > 2 ? (
                  <div>
                    <Typography mb="20px">Target Cost Per Person</Typography>
                    <TextField
                      type="number"
                      label="Cost"
                      variant="outlined"
                      required
                      value={editedGroupInfo.income1}
                      onChange={(e) =>
                        setEditedGroupInfo({
                          ...editedGroupInfo,
                          income1: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <Stack gap="20px">
                    <Typography>Monthly Take Home</Typography>
                    <TextField
                      type="number"
                      label="Income"
                      variant="outlined"
                      required
                      value={editedGroupInfo.income1}
                      onChange={(e) =>
                        setEditedGroupInfo({
                          ...editedGroupInfo,
                          income1: e.target.value,
                        })
                      }
                    />
                    <TextField
                      type="number"
                      label="Second Income"
                      variant="outlined"
                      value={editedGroupInfo.income2}
                      onChange={(e) =>
                        setEditedGroupInfo({
                          ...editedGroupInfo,
                          income2: e.target.value,
                        })
                      }
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              sx={{ mt: "20px" }}
              justifyContent="space-between"
              gap="20px"
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => handleEditClose()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#5B4570" }}
                onClick={saveGroupChanges}
              >
                Save
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Modal>

      <Modal
        open={deleteGroupOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Paper sx={{ ...style, width: 300, border: "none" }}>
          <Stack gap="20px">
            <Typography variant="h4">Are you Sure?</Typography>
            <Typography>
              This will permanently delete the group and all of it's data.
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteGroupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#5B4570" }}
                onClick={() => deleteGroup()}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>

      <Snackbar
        open={snackFailureOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setSnackFailureOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Missing required fields.
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackSuccessOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setSnackFailureOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Group info updated!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditGroupModal;
