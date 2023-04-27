import { useSelector } from "react-redux";
import {
  Typography,
  Stack,
  Paper,
  Grid,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import UserProfile from "../UserProfile/UserProfile";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const HomeDashboard = () => {
  const user = useSelector((store) => store.user);
  const allGroups = useSelector((store) => store.groups);

  const history = useHistory();
  const dispatch = useDispatch();

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleClick = () => {
    dispatch({ type: "UNSET_CURRENT_GROUP" });
    history.push("/newGroup");
  };

  return (
    <div className="main-wrapper">
      <Typography variant="h2" mb="20px">
        Welcome, {user.username}
      </Typography>

      <Stack direction="row" ml="30%">
        <Typography variant="h3" mb="20px">
          Your groups
        </Typography>
      </Stack>

      <Stack direction="column" justifyContent="center" alignItems="center">
        {allGroups[0] ? (
          <div>
            <Stack direction="row" gap="20px">
              <Box sx={{ display: "flex", flexWrap: "wrap", width: "70%" }}>
                {allGroups[0] &&
                  allGroups.map((group) => (
                    <Box sx={{ width: "50%", padding: "20px" }} key={group.id}>
                      <Paper elevation={6}>
                        <Stack direction="row" justifyContent="flex-end">
                          <IconButton
                            onClick={() =>
                              history.push(`/groupDashboard/${group.groupId}`)
                            }
                          >
                            <OpenInNewIcon></OpenInNewIcon>
                          </IconButton>
                        </Stack>
                        <Box sx={{ padding: "0px 40px 40px 40px" }}>
                          <Typography variant="h4" mb="20px">
                            {group.name}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h5" mb="10px">
                                Members
                              </Typography>
                              {group.users.map((user) => (
                                <Typography key={user}>{user}</Typography>
                              ))}
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h5" mb="10px">
                                Budget Info
                              </Typography>
                              <Typography>
                                Total Budget:{" "}
                                {currencyFormatter.format(group.totalBudget)}
                              </Typography>
                              <Typography>
                                Total Spent:{" "}
                                {group.totalSpent > group.totalBudget ? (
                                  <span style={{ color: "red" }}>
                                    {currencyFormatter.format(group.totalSpent)}
                                  </span>
                                ) : (
                                  currencyFormatter.format(group.totalSpent)
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Box>
                  ))}
              </Box>

              <UserProfile />
            </Stack>
          </div>
        ) : (
          <div>
            <Stack direction="row">
              <Paper elevation={6}>
                <Box width="800px" height="800px">
                  <Stack alignItems="center">
                    <Typography mt="50%">No groups</Typography>
                  </Stack>
                </Box>
              </Paper>
              <UserProfile />
            </Stack>
          </div>
        )}
      </Stack>

      <Stack direction="row" justifyContent="flex-start" mt="20px">
        <Button
          variant="contained"
          style={{ backgroundColor: "#5B4570" }}
          onClick={() => handleClick()}
        >
          Create New Group
        </Button>
      </Stack>
    </div>
  );
};

export default HomeDashboard;
