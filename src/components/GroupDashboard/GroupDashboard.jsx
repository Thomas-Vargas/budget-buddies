import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useHistory } from "react-router-dom";
import BudgetCategoryTable from "../BudgetCategoryTable/BudgetCategoryTable";
import AddExpenseForm from "../AddExpenseForm/AddExpenseForm";
import AddCategoryForm from "../AddCategoryForm/AddCategoryForm";
import ActivityFeed from "../ActivityFeed/ActivtyFeed";

import "./GroupDashboard.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GroupDashboard = () => {
  const groupId = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [expenseFormToggle, setExpenseFormToggle] = useState(false);
  const [categoryFormToggle, setCategoryFormToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetSuccessSnackOpen, setResetSuccessSnackOpen] = useState(false);

  const categories = useSelector((store) => store.categories);
  const currentGroup = useSelector((store) => store.currentGroup);
  const allExpenses = useSelector((store) => store.expenses);

  let totalBudgetAmount = 0;
  let totalMoneySpent = 0;
  let monthlyIncome = Math.round(currentGroup.totalBudget / 12);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setResetSuccessSnackOpen(false);
  };

  if (categories[0]) {
    categories.map((category) => (totalBudgetAmount += category.budgetAmount));
  }

  allExpenses.map((expense) => (totalMoneySpent += expense.amount));

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

  // store specific budget and categories in global state based on groupId from url params
  useEffect(() => {
    currentGroup.id &&
      dispatch({ type: "FETCH_GROUP_CATEGORIES", payload: currentGroup.id });
    currentGroup.id &&
      dispatch({ type: "FETCH_ALL_GROUP_EXPENSES", payload: currentGroup.id });
    currentGroup.id &&
      dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: currentGroup.id });
    dispatch({ type: "FETCH_CURRENT_GROUP", payload: groupId });
  }, [currentGroup.id]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const deleteAllExpenses = () => {
    dispatch({ type: "DELETE_ALL_EXPENSES", payload: currentGroup.id });
    handleClose();
    setResetSuccessSnackOpen(true);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div className="main-wrapper">
      {loading ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "25%" }}
        >
          <Box>
            <CircularProgress />
          </Box>
        </Stack>
      ) : (
        <div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "40px", mb: "20px" }}
          >
            <Typography variant="h3">{currentGroup.name}</Typography>
            <Button
              variant="contained"
              onClick={() => history.push(`/allExpenses/${groupId.id}`)}
              style={{ backgroundColor: "#5B4570" }}
            >
              All Expenses
            </Button>
          </Stack>
          <Stack direction="row" gap="40px">
            <Stack direction="column" width="80%">
              {/* Display monthly income before tax */}
              {/* stretch: implement monthly take home based on taxes by state */}

              <Stack
                direction="column"
                gap="10px"
                alignItems="flex-start"
                width="100%"
                sx={{ margin: "20px 0px" }}
              >
                {expenseFormToggle ? (
                  <div>
                    <AddExpenseForm
                      groupId={currentGroup.id}
                      categories={categories}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setExpenseFormToggle(false)}
                      style={{ backgroundColor: "#5B4570" }}
                    >
                      Close Form
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setExpenseFormToggle(true)}
                    style={{ backgroundColor: "#5B4570" }}
                  >
                    Add Expenses
                  </Button>
                )}

                {categoryFormToggle ? (
                  <div>
                    <AddCategoryForm
                      budgetId={currentGroup.id}
                      groupId={groupId}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setCategoryFormToggle(false)}
                      style={{ backgroundColor: "#5B4570" }}
                    >
                      Close Form
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setCategoryFormToggle(true)}
                    style={{ backgroundColor: "#5B4570" }}
                  >
                    Add Category
                  </Button>
                )}
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ marginBottom: "40px" }}
              >
                <Stack direction="column" gap="10px">
                  <Typography variant="h5">
                    Monthly Income: {currencyFormatter.format(monthlyIncome)}
                  </Typography>
                  <Typography variant="h5">
                    Projected Budget:{" "}
                    {totalBudgetAmount >
                    Math.round(currentGroup.totalBudget / 12) ? (
                      <span style={{ color: "red" }}>
                        {currencyFormatter.format(totalBudgetAmount)}
                      </span>
                    ) : (
                      <span>{currencyFormatter.format(totalBudgetAmount)}</span>
                    )}
                  </Typography>
                  <Typography variant="h5">
                    Money Left:{" "}
                    {totalMoneySpent > totalBudgetAmount ? (
                      <span style={{ color: "red" }}>
                        {currencyFormatter.format(
                          totalMoneySpent - totalBudgetAmount
                        )}{" "}
                        Over Projected Budget
                      </span>
                    ) : (
                      <span>
                        {currencyFormatter.format(
                          totalBudgetAmount - totalMoneySpent
                        )}{" "}
                        left
                      </span>
                    )}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  // onClick={deleteAllExpenses}
                  onClick={handleOpen}
                  style={{ backgroundColor: "#5B4570" }}
                >
                  Reset All Expenses
                </Button>
              </Stack>

              <Box>
                <Grid
                  container
                  spacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  {categories[0] ? (
                    categories.map((category) => (
                      <BudgetCategoryTable
                        key={category.id}
                        category={category}
                      />
                    ))
                  ) : (
                    <></>
                  )}
                </Grid>
              </Box>
            </Stack>
            <ActivityFeed allExpenses={allExpenses} />
          </Stack>
        </div>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Paper sx={{ ...style, border: "none" }}>
            <Typography id="transition-modal-title" variant="h5">
              Are you sure?
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              This will remove all expenses from all categories.
            </Typography>
            <Stack
              direction="row"
              sx={{ mt: "20px" }}
              justifyContent="flex-end"
              gap="20px"
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#5B4570" }}
                onClick={deleteAllExpenses}
              >
                Reset
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Modal>

      <Snackbar open={resetSuccessSnackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={() => setResetSuccessSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
          All expenses deleted.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GroupDashboard;
