import React from "react";
import "./style.css";

const OrderList = ({ items }) => {
  return (
    <>
      <div className="right-side">
        <div>
          <table
            className="user-table"
            style={{
              maxWidth: "100vw",
              height: "fit-content",
              overflowX: "scroll",
            }}
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {items.map((item) => {
                const { id, order_id, name, mobile, category } = item;
                return (
                  <tr key={id}>
                    <td>{order_id}</td>
                    <td>{name}</td>
                    <td>{mobile}</td>
                    <td>{category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderList;
