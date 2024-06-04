import { useDispatch } from "react-redux";
import { logoutRequest } from "../../../../modules/actions/loginActions";

export default function LogOutButton(props) {
  const dispatch = useDispatch();
  return (
    <button
      className={props.className}
      onClick={() => dispatch(logoutRequest())}
    >
      Log Out
    </button>
  );
}
