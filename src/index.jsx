import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import store from "./redux/store";
import App from "./components/App/App";

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey="6Lcwo_UpAAAAABPXX0Q1ajdT4U24eULHm6J9E-ul">
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
