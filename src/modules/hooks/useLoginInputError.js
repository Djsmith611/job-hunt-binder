import { loginInputError } from "../actions/loginActions";
import { useDispatch } from "react-redux";

const useLoginInputError = () => {
    const dispatch = useDispatch();

    const inputError = () => {
        dispatch(loginInputError());
    }

    return inputError;
};

export default useLoginInputError;