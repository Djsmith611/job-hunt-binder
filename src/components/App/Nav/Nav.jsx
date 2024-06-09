import { Link } from "react-router-dom";
import LogOutButton from "../../Util/Buttons/LogoutButton/LogoutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
import { Divider, Box } from "@mui/material";

export default function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Job Hunt Binder</h2>
      </Link>
      <div className="nav-links">
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ bgcolor: "grey", width: "1px" }}
        />
        {user.id && (
          <>
            <Link className="navLink" to="/dashboard">
              Dashboard
            </Link>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "grey", width: "1px" }}
            />

            <Link className="navLink" to="/binder">
              Binder
            </Link>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "grey", width: "1px" }}
            />
            <Link className="navLink" to="/analytics">Analytics</Link>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "grey", width: "1px" }}
            />
          </>
        )}
        <Link className="navLink" to="/about">
          About
        </Link>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ bgcolor: "grey", width: "1px" }}
        />
        <Link className="navLink" to="/resources">
          Resources
        </Link>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ bgcolor: "grey", width: "1px" }}
        />
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <>
            <Link className="navLink" to="/home">
              Home
            </Link>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ bgcolor: "grey", width: "1px" }}
            />
            <Link className="navLink" to="/login">
              Login
            </Link>
          </>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && <LogOutButton className="navLink" />}
      </div>
    </div>
  );
}
