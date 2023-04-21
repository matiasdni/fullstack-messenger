import React from "react";
import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { LoginScreen } from "./components/LoginScreen";
import PrivateRoute from "./components/common/PrivateRoute";
import Layout from "./components/common/Layout";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<LoginScreen />} />

        {/* private */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404</div>} />
      </Route>
    </Routes>
  );
}

export default App;
