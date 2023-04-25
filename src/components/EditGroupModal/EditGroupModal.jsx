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
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Base: edit name and income
// Stretch: add/remove users, delete group
const EditGroupModal = ({ openEditModal, handleEditClose, handleEditOpen }) => {
  const [editedGroupInfo, setEditedGroupInfo] = useState({
    name: "",
    income1: "",
    income2: "",
  });
  const [snackSuccessOpen, setSnackSuccessOpen] = useState(false);
  const [snackFailureOpen, setSnackFailureOpen] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackSuccessOpen(false);
    setSnackFailureOpen(false);
  };
  console.log(editedGroupInfo);

  const dispatch = useDispatch();

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
            <Typography id="transition-modal-title" variant="h5">
              Edit Group
            </Typography>

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
            </Stack>

            <Stack
              direction="row"
              sx={{ mt: "20px" }}
              justifyContent="flex-end"
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
        <Alert onClose={() => setSnackFailureOpen(false)} severity="success" sx={{ width: "100%" }}>
          Group info updated!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditGroupModal;
