import LoginForm from "../../Forms/LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import "../../App/App.css";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/register");
  };

  return (
    <motion.div
      className="container"
      style={{ margin: "auto", width: "60%" }}
      initial={{ opacity: 0, translateY: 0 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoginForm />
      <center>
        <button type="button" className="btn btn_asLink" onClick={handleClick}>
          I need an account
        </button>
      </center>
    </motion.div>
  );
}
