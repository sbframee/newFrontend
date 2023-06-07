import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import User from "./Components/User";

const App = () => {
  //const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <Login /> } />
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
};

export default App;
