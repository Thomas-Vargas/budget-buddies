import AllExpensesTable from "../AllExpensesTable/AllExpensesTable";
import { Button, Stack, CircularProgress, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import DonutChart from "../DonutChart/DonutChart";

import "./AllExpensesPage.css";

const AllExpensesPage = () => {
  const [loading, setLoading] = useState(true);
  const groupId = useParams();
  const currentGroup = useSelector((store) => store.currentGroup);
  const history = useHistory();

  const categoryTotals = useSelector((store) => store.categoryTotals);

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
          <CircularProgress />
        </Stack>
      ) : (
        <div>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            gap="20px"
            sx={{mb: "20px"}}
          >
            <Button
              variant="contained"
              onClick={() => history.push(`/groupDashboard/${groupId.id}`)}
            >
              Back
            </Button>
            <Typography variant="h3">{currentGroup.name}</Typography>
          </Stack>
          <Stack direction="row" gap="40px">
            <Stack direction="column" sx={{ width: "70%" }}>
              <AllExpensesTable />
            </Stack>
            <Stack sx={{ width: "30%" }}>
              <DonutChart categoryTotals={categoryTotals} />
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default AllExpensesPage;
