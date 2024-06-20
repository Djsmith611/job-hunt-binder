import { Link } from "react-router-dom";
import LogOutButton from "../../Util/Buttons/LogoutButton/LogoutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";

export default function Nav() {
  const user = useSelector((state) => state.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Job Hunt Binder</h2>
      </Link>
      <div className="nav-links">
        {!user.id && (
          <>
            <Link className="navLink" to="/home">
              Home
            </Link>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "rgb(168, 168, 168)", width: "1px" }}
            /> */}
          </>
        )}
        {user.id && (
          <>
            <Link className="navLink" to="/dashboard">
              Dashboard
            </Link>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "rgb(168, 168, 168)", width: "1px" }}
            /> */}

            <Link className="navLink" to="/binder">
              Binder
            </Link>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "rgb(168, 168, 168)", width: "1px" }}
            /> */}
            <Link className="navLink" to="/analytics">
              Analytics
            </Link>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "rgb(168, 168, 168)", width: "1px" }}
            /> */}
          </>
        )}
        <Link className="navLink" to="/about">
          About
        </Link>
        {/* <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ bgcolor: "rgb(168, 168, 168)", width: "1px" }}
        /> */}
        <Link className="navLink" to="/resources">
          Resources
        </Link>
      </div>{" "}
      {
        user.id && (
          <IconButton>
            
          </IconButton>
        )
      }
      {!user.id && (
        <div className="sign-in">
          <Link className="signinLink1" to="/login">
            Login
          </Link>
          <Link className="signinLink2" to="/register" >
            Register
          </Link>
        </div>
      )}
      {user.id && (
        <div className="sign-in">
          <LogOutButton className="signinLink2"  />
        </div>
      )}
    </div>
  );
}
