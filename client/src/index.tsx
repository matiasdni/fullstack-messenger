import React from "react";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

// create store and pass it to the Provider

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
