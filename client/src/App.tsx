import React from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./components/PrivateRoute";
import { Home } from "./components/Home";
import { LoginScreen } from "./LoginScreen";
import DarkModeToggle from "./components/DarkModeToggle";

function App(): JSX.Element {
  return (
    <div className="dark:bg-gray-900 bg-gray-100">
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </div>
  );
}

export default App;
