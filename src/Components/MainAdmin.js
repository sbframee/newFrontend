
import React from "react";
import "./style.css";

const MainAdmin = () => {
    const handleLogout = () => {
        window.localStorage.clear();
        window.location.assign("/sign-in");
      };
  return (
    <>
      <div className="right-side">
  
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
            </div>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default MainAdmin;
