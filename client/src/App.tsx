import React from "react";
import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { LoginScreen } from "./LoginScreen";
import PrivateRoute from "./components/PrivateRoute";
import DarkModeToggle from "./components/DarkModeToggle";

function App(): JSX.Element {
  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 ">
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/register" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </div>
  );
}

export default App;
