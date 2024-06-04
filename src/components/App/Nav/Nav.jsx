import { Link } from "react-router-dom";
import LogOutButton from "../../Util/Buttons/LogoutButton/LogoutButton";
import "./Nav.css";
import { useSelector } from "react-redux";

export default function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Job Hunt Binder</h2>
      </Link>
      <div>
        {user.id && (
          <>
            <Link className="navLink" to="/dashboard">
              Dashboard
            </Link>

            <Link className="navLink" to="/binder">
              Binder
            </Link>
          </>
        )}
        <Link className="navLink" to="/about">
          About
        </Link>
        <Link className="navLink" to="/resources">
          Resources
        </Link>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <>
            <Link className="navLink" to="/home">
              Home
            </Link>
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
