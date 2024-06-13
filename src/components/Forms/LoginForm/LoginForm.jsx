import { useState } from "react";
import useLogin from "../../../modules/hooks/useLogin";
import useMessage from "../../../modules/hooks/useMessage";
import useLoginInputError from "../../../modules/hooks/useLoginInputError";
import FolderButton from "../../Util/Buttons/FolderButton/FolderButton";
import { TextField, Typography } from "@mui/material";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const inputError = useLoginInputError();
  const loginMessage = useMessage('login');

  const handleLogin = (event) => {
    event.preventDefault();

    if (email && password) {
      login({ email, password });
    } else {
      inputError();
    }
  };

  return (
    <form className="formPanel" onSubmit={handleLogin}>
      <Typography variant="h5" element="h2" style={{ textAlign: "center" }}>
        Welcome back!
      </Typography>
      {loginMessage && (
        <h3 className="alert" role="alert">
          {loginMessage}
        </h3>
      )}
      <div
        style={{
          display: "flex",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <TextField
          variant="filled"
          value={email}
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          sx={{ backgroundColor: "white", margin: "auto" }}
          required
        />
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <TextField
          variant="filled"
          value={password}
          type="password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          sx={{ backgroundColor: "white", margin: "auto" }}
          required
        />
      </div>
      <div style={{ display: "flex", marginTop: 5 }}>
        <FolderButton type="submit" text="Log In" />
      </div>
    </form>
  );
}
