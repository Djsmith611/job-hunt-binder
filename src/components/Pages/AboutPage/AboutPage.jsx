import React from "react";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

export default function AboutPage() {
  return (
    <div className="container" style={{margin:"auto", width:"60%"}}>
      <Grid container spacing={4} style={{ margin: "20px" }}>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Developer
            </Typography>
            <Typography variant="body1">
              This application was developed by David Smith, a passionate
              developer and fellow job hunter. He has built this app to help job
              hunters, such as himself, to streamline their job hunting process.
            </Typography>
            <Link
              className="navLink"
              href="https://www.davidjsmith.dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                border: "solid black 1px",
                padding: "5px",
                marginTop: "20px",
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  transform: "translate(5px,-5px)",
                  backgroundColor: "gray",
                },
              }}
            >
              Personal Site
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Why?
            </Typography>
            <Typography variant="body1">
              The Binder app is designed for job seekers looking to organize and
              track their job applications efficiently. With features like
              saving job leads, tracking application statuses, and analytics to
              monitor progress, this app aims to simplify the job search process
              and keep users motivated.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              How to Use
            </Typography>
            <List>
              <ListItem>
                <img
                  src="/Images/app-image1.png"
                  alt="Add a Lead"
                  style={{ width: "100%" }}
                />
              </ListItem>
              <ListItem>
                <img
                  src="/Images/app-image2.png"
                  alt="Edit Leads"
                  style={{ width: "100%" }}
                />
              </ListItem>
              <ListItem>
                <img
                  src="/Images/app-image3.png"
                  alt="Delete Leads"
                  style={{ width: "100%" }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
