import { useDispatch } from "react-redux";
import { logoutRequest } from "../../../../modules/actions/loginActions";

export default function LogOutButton(props) {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutRequest())
  }
  return (
    <div
      className={props.className}
      onClick={() => logout()}
    >
      Log Out
    </div>
  );
}
