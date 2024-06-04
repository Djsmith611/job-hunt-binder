import { useSelector } from "react-redux";

const useMessage = (type) => {
  switch (type) {
    case "login":
      return useSelector((state) => state.errors.loginMessage);
    case "registration":
      return useSelector((state) => state.errors.registrationMessage);
    default:
      return;
  }
};

export default useMessage;
