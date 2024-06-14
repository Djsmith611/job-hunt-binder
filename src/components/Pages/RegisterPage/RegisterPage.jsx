import { useNavigate } from "react-router-dom";
import RegisterForm from "../../Forms/RegisterForm/RegisterForm";
import { motion } from "framer-motion";

function RegisterPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
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
      <RegisterForm />
      <center>
        <button type="button" className="btn btn_asLink" onClick={handleClick}>
          I have an account
        </button>
      </center>
    </motion.div>
  );
}

export default RegisterPage;
