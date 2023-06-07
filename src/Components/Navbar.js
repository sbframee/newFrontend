import React from "react";

const Navbar = ({ filterItems, orderList }) => {
  return (
    <>
      <nav className="navbar">
        <div className="btn-group">
          {orderList.map((curElem) => (
            <button className="btn-group__item" onClick={() => filterItems(curElem)}>
              {curElem}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
