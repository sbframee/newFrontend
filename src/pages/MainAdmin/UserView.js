import { Add } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Container,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";
import AddOrder from "./AddOrder";
import Navbar from "./Navbar";
import OrderList from "./OrderList";

const UserView = () => {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uniqueList, setUniqueList] = useState([]);

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/login");
  };

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/orders/GetOrderList");
      if (response.data.success) {
        const orders = response.data.result;

        const ordersWithCustomerData = await Promise.all(
          orders.map(async (orderItem) => {
            try {
              const customerResponse = await axios.get(`http://localhost:9000/customers/getCustomerDetails/${orderItem.customer_uuid}`);
              const customerData = customerResponse.data.result;
              return {
                ...orderItem,
                customer_name: customerData.customer_name,
                customer_mobile: customerData.customer_mobile
              };
            } catch (error) {
              console.error(error);
              return orderItem; // Return case item without customer details on error
            }
          })
        );
        setItems(ordersWithCustomerData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
      const uniqueCategories = [...new Set(items.map((curElem) => curElem.category))];
      setUniqueList([ ...uniqueCategories, "All"]);
    }, [items]);
    
    console.log(uniqueList);
  

  const filterItems = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const openPopupForm = () => {
    setShowAddOrder(true);
  };

  const handlePopupClose = () => {
    setShowAddOrder(false);
  };


  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="layout">
          <AppBar position="static" style={{ background: "#4AC959" }}>
            <Container maxWidth="xl">
              <Toolbar
                disableGutters
                style={{
                  minWidth: "300px",
                  flex: "1",
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  src="/logo512.png"
                  alt="logo"
                  sx={{ width: 48, height: 48 }}
                />
                <h1 style={{ width: "100%", textAlign: "center" }}>
                {filteredItems.length}/{items.length}
                </h1>
              </Toolbar>
            </Container>
          </AppBar>
          <Navbar filterItems={filterItems} orderList={uniqueList} items={items} />
          <OrderList items={filteredItems} />
        </div>
        <button onClick={handleLogout}>Logout</button>
        <div
          className="flex"
          style={{
            fontsize: "50px",
            zIndex: "9999999999999",
            position: "fixed",
            color: "green",
            bottom: "10px",
            border: "2px solid green",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={openPopupForm}
        >
          <Add style={{ fontSize: "50px" }} />
        </div>
      </div>
      {showAddOrder ? (
        <AddOrder
        onSave={handlePopupClose} onClose={handlePopupClose}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default UserView;
