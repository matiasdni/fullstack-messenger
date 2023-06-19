import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./app/store";
import "./index.css";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
