import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import MainAdmin from "./Components/MainAdmin";
import UserView from "./Components/UserView";

const App = () => {
  //const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <Login /> } />
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/user" element={<UserView />} />
      </Routes>
    </Router>
  );
};

export default App;
