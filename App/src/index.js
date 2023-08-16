import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import AppRoutes from "./components/appRoutes/AppRoutes";
// import App from "./components/App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import LoginProvider from "./providers/login/login.provider.jsx";
import * as serviceWorker from "./serviceWorker";
import { CurrentUserProvider } from "./providers/currentUser.provider";
import { FilesProvider } from "./providers/files.provider";

ReactDOM.render(
  <BrowserRouter>
    <LoginProvider>
      <CurrentUserProvider>
        <FilesProvider>
          <AppRoutes />
        </FilesProvider>
      </CurrentUserProvider>
    </LoginProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
