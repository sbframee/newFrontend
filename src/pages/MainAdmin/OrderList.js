import React, { useState } from "react";
import { Edit, WhatsApp } from "@mui/icons-material";
import Update from "./Update";
import { Box } from "@mui/material";

const OrderList = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openPopup = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  const handleSave = (updatedOrder) => {
    console.log("Updated order:", updatedOrder);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 1rem)",
          maxHeight: "calc(100vh - 64px)",
          overflow: "hidden",
          background: "white",
        }}
      >
        <div className="row">
          <div
            className="item-sales-container orders-report-container"
            style={{
              width: "100%",
              left: "0",
              top: "10px",
              textAlign: "center",
            }}
          >
            <div
              className="table-container-user item-sales-container"
              style={{
                width: "100%",
                overflow: "scroll",
                left: "0",
                top: "0",
                display: "flex",
                minHeight: "93vh",
              }}
            >
              <table
                className="user-table"
                style={{
                  width: "100%",
                  height: "fit-content",
                }}
              >
                <thead>
                  <tr>
                    <th colSpan={2}></th>
                    <th colSpan={2}>
                      <div className="t-head-element">Name</div>
                    </th>
                    <th colSpan={2}>
                      <div className="t-head-element">Mobile</div>
                    </th>
                    <th>
                      <div className="t-head-element"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {items?.map((item) => (
                    <tr key={item.id} style={{ height: "30px", backgroundColor: "#fff" }}>
                      <td></td>
                      <td style={{ width: "50px", cursor: "pointer" }} onClick={() => openPopup(item)}>
                        <Edit />
                      </td>
                      <td colSpan={2}>{item?.customer_name}</td>
                      <td colSpan={2} style={{ color: "blue" }}>
                        <span className="flex">{item?.customer_mobile || ""}</span>
                      </td>
                      <td style={{ color: "green", display: "none", cursor: "pointer" }}>
                        <WhatsApp />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Box>

      {selectedItem && (
        <Update onSave={handleSave} onClose={closePopup} item={selectedItem} />
      )}
    </>
  );
};


export default OrderList;
