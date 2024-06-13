import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { Box, Typography } from "@mui/material";
import ParallaxButton from "../../Util/Buttons/ParallaxButton/ParallaxButton";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{margin:"30px auto", width:"60%"}}>
      <Box
        className="ImageHeader"
        style={{
          backgroundImage: "url(/Images/landing-head.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="header-content">
          <h2>Streamline Your Job Search</h2>
          <h5 className="subheader">Start tracking your applications</h5>
          <div className="button-container">
            <ParallaxButton text="Learn More" className="learn-more-button" onClickFunction={()=>{navigate('/about')}}/>
          </div>
        </div>
      </Box>
      <div className="helpful-folders-section">
        <Typography variant="h4" gutterBottom>
          Helpful Folders
        </Typography>
        <div className="folders-container">
          <div className="folder">
            <div
              className="folder-img"
              style={{
                backgroundImage: "url(/Images/start.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="folder-content">
              <p>Get Started</p>
              <p>Create an account and get tracking!</p>
              <ParallaxButton
                text="Start"
                onClickFunction={() => navigate("/register")}
              />
            </div>
          </div>
          <div className="folder">
            <div
              className="folder-img"
              style={{
                backgroundImage: "url(/Images/learn-more.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="folder-content">
              <p>What is this?</p>
              <p>Learn what Job Hunt Binder can do for you.</p>
              <ParallaxButton
                text="Learn More"
                onClickFunction={() => navigate("/about")}
              />
            </div>
          </div>
          <div className="folder">
            <div
              className="folder-img"
              style={{
                backgroundImage: "url(/Images/resources.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="folder-content">
              <p>More Job Resources</p>
              <p>Useful websites and links to help you on your hunt.</p>
              <ParallaxButton
                text="Resources"
                onClickFunction={() => navigate("/resources")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
