import React from "react";
import { Typography, Stack, Paper, Box } from "@mui/material";
import { FaReact, FaNodeJs, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiRedux, SiReduxsaga, SiPostgresql } from "react-icons/si";
import { TfiWorld } from "react-icons/tfi";
import { IconContext } from "react-icons";

function AboutPage() {
  return (
    <div>
      <Paper elevation={8}>
        <Box padding="40px">
          <Stack alignItems="center" gap="40px">
            <Typography variant="h3">Budget Buddies</Typography>
            <Typography variant="h4">Built With:</Typography>
            <IconContext.Provider
              value={{
                size: "6em",
                color: "#5B4570",
                className: "global-class-name",
              }}
            >
              <Stack direction="row" gap="40px">
                <FaReact />
                <SiRedux />
                <SiReduxsaga />
                <FaNodeJs />
                <SiPostgresql />
              </Stack>
            </IconContext.Provider>
            <Typography variant="h4">Connect With Me:</Typography>
            <Stack>
              <IconContext.Provider
                value={{
                  size: "3em",
                  color: "#5B4570",
                  className: "global-class-name",
                }}
              >
                <Stack direction="row" gap="100px" mb="40px">
                  <Stack
                    direction="row"
                    gap="10px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FaGithub />
                    <Typography variant="h5">
                      <a
                        href="https://github.com/Thomas-Vargas"
                        target="_blank"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {" "}
                        github.com/Thomas-Vargas
                      </a>
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap="10px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FaLinkedin />
                    <Typography variant="h5">
                      <a
                        href="http://linkedin.com/in/thomasavargas"
                        target="_blank"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {" "}
                        linkedin.com/in/thomasavargas/
                      </a>
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  gap="10px"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TfiWorld />
                  <Typography variant="h5">
                    <a
                      href="https://thomasavargas.com/"
                      target="_blank"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      thomasavargas.com/
                    </a>
                  </Typography>
                </Stack>
              </IconContext.Provider>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </div>
  );
}

export default AboutPage;
