import { useDispatch } from "react-redux";
import { loginRequest } from "../actions/loginActions";

const useLogin = () => {
  const dispatch = useDispatch();

  const login = (credentials) => {
    dispatch(loginRequest(credentials));
  };

  return login;
};

export default useLogin;
