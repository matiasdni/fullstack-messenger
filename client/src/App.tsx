import React from "react";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";

function App(): JSX.Element {
  const [user, setUser] = React.useState(null);

  // const handleLogin = () => setUser({ id: "1", name: "robin" });
  // const handleLogout = () => setUser(null);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

//   return (
//     <div className="App">
//       <DarkModeToggle />
//       <div className="bg-cover dark:bg-gray-900">
//         {user ? (
//           <button onClick={handleLogout}>Sign Out</button>
//         ) : (
//           <button onClick={handleLogin}>Sign In</button>
//         )}
//         <Routes>
//           <Route
//             path="home"
//             element={
//               <PrivateRoute user={user}>
//                 <Home />
//               </PrivateRoute>
//             }
//           />
//           {/*<PrivateRoute path="/dashboard" element={<Dashboard />} />*/}
//           {!user && <Route path="/login" Component={Login} />}
//           {user && <Route path="/dashboard" Component={Dashboard} />}
//         </Routes>
//       </div>
//     </div>
//   );
// }

/*
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import Signup from "./components/Signup";
// import ForgotPassword from "./components/ForgotPassword";
// import UpdateProfile from "./components/UpdateProfile";
// import Dashboard from "./components/Dashboard";
// import Home from "./components/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import NotFound from "./components/NotFound";
// <Router>
//   <AuthProvider>
//     <Switch>
//       <PrivateRoute exact path="/" component={Home} />
//       <PrivateRoute path="/dashboard" component={Dashboard} />
//       <PrivateRoute path="/update-profile" component={UpdateProfile} />
//       <Route path="/login" component={Login} />
//       <Route path="/signup" component={Signup} />
//       <Route path="/forgot-password" component={ForgotPassword} />
//       <Route path="/about" component={About} />
//       <Route path="/contact" component={Contact} />
//       <Route path="*" component={NotFound} />
//     </Switch>
//   </AuthProvider>
// </Router>*/
