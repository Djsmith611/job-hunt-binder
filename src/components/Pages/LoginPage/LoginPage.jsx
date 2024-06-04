import LoginForm from "../LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import '../../App/App.css'

export default function LoginPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <LoginForm />

      <center>
        <button type="button" className="btn btn_asLink" onClick={handleClick}>
          I need an account
        </button>
      </center>
    </div>
  );
}