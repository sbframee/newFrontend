import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessagePopup from "./MessagePopup";

const Header = () => {
  const Navigate = useNavigate();
  const [logoutPopup, setLogoutPopup] = useState("");
  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/sign-in");
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
      {logoutPopup ? (
        <MessagePopup
          onClose={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
            Navigate("/login");
          }}
          onSave={() => setLogoutPopup(false)}
          message="Confirm Logout"
          button1="Logout"
          button2="Cancel"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Header;
