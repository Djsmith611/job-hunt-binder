import { useState } from "react";
import { useDispatch } from "react-redux";
import useMessage from "../../../modules/hooks/useMessage.js";
import { registerUserRequest } from "../../../modules/actions/registrationActions.js";
import { TextField, Typography } from "@mui/material";
import FolderButton from "../../Util/Buttons/FolderButton/FolderButton.jsx";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const message = useMessage('registration');

  const registerUser = (event) => {
    event.preventDefault();
    console.log(email, fName, lName, password);      
    const user = {
        email: email,
        f_name: fName,
        l_name: lName,
        password: password,
      };
      console.log(user);
    dispatch(registerUserRequest(user));
  };

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <Typography variant="h5" element="h2" sx={{ textAlign: "center" }}>
        Welcome to your binder!
      </Typography>
      {message && (
        <h3 className="alert" role="alert">
          {message}
        </h3>
      )}

      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <TextField
          variant="filled"
          value={fName}
          label="First Name"
          onChange={(event) => setFName(event.target.value)}
          sx={{ backgroundColor: "white" }}
          required
        />
        <TextField
          variant="filled"
          value={lName}
          label="Last Name"
          onChange={(event) => setLName(event.target.value)}
          sx={{ backgroundColor: "white" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <TextField
          variant="filled"
          value={email}
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          sx={{ backgroundColor: "white" }}
          required
        />
        <TextField
          variant="filled"
          value={password}
          label="Password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          sx={{ backgroundColor: "white" }}
          required
        />
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 5,
        }}
      >
        <FolderButton type="submit" text="Register" />
      </div>
    </form>
  );
}
