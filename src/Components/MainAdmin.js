
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./style.css";


// import VerticalTabs from "../../components/VerticalTabs";

const MainAdmin = () => {
  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/sign-in");
  };
  return (
    <>
      <Sidebar />
      <div className="right-side">
        <Header />
  
        <div style={{ display: "flex", height: "100%" }}>
          {/* <VerticalTabs /> */}
          <div className="inputs"></div>

          <div className="content-container" id="content-file-container">
            <div className="noOrder">No Order</div>

            <div
              className="searchBar"
              style={{
                width: "400px",
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                // value={searchItems}
                // onChange={(e) => setSearhItems(e.target.value)}
              />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainAdmin;
