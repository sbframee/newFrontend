import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const Navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/login");
  };

  return (
    <>
      <div className="header">
        <div className="name">
          <h2>{localStorage.getItem("organization_title")}</h2>
        </div>
        <div className="header_right">
          <div className="header_right_link" onClick={() => Navigate("/admin")}>
            Dashboard
          </div>
          <div
            className="header_right_link"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Header;
