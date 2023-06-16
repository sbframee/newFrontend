import { Add } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import AddCustomer from "./AddCustomer";
import Navbar from "./Navbar";
import Select from "react-select";
import OrderList from "./OrderList";

const UserView = () => {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uniqueList, setUniqueList] = useState([]);
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
          onClick={openPopupForm
          }
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
function AddOrder({
  onSave, onClose
}) {
  const [order, setOrder] = useState();
  const [category, setCategory] = useState('New Order');
  const [latestOrderId, setLatestOrderId] = useState(0);
  const [customersData, setCustomersData] = useState([]);
  const [details, setDetails] = useState({ customers: [] });
  const [newCustomerForm, setNewCustomerForm] = useState(false);

  const fetchLatestOrderId = async () => {
    try {
      const response = await axios.get("http://localhost:9000/orders/GetOrderList");
      const orders = response.data.result;
      if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        const latestOrderId = latestOrder.order_id;
        setLatestOrderId(latestOrderId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getItemsData = async () => {
    const response = await axios.get("http://localhost:9000/customers/GetCustomerList");
    console.log(response);
    if (response.data.success) setCustomersData(response.data.result);
  };


  useEffect(() => {
    fetchLatestOrderId();
    getItemsData();
  }, []);

  const customersOptions = useMemo(
    () =>
      customersData.map((a) => ({
        value: a.customer_uuid,
        label: a?.customer_name,
      })),
    [customersData]
  );

  const customerValue = useMemo(
    () =>
      order?.customer_uuid
        ? {
            value: order?.customer_uuid,
            label: (() => {
              let a = customersData?.find(
                (j) => j.customer_uuid === order.customer_uuid
              );
              return a?.customer_name;
            })(),
          }
        : "",
    [customersData, order]
  );

  

  const onCustomerChange = (doc, value) => {
    if (value.name === "customer_uuid");
    setOrder((prev) => ({
      ...prev,
      [value.name]: doc.value,
    }));
  };

  console.log(details);


  const submitHandler = async (e) => {
    e.preventDefault();
    const newOrderId = latestOrderId + 1;

    const orderData = {
      customer_uuid: customerValue.value,
      order_id: newOrderId,
      category
    };

    try {
      await axios.post('http://localhost:9000/orders/postOrder', orderData);
      console.log('Order added successfully');
      onSave();
    } catch (error) {
      console.error('Failed to add order', error);
    }
  };

  return (
    <>
    <div className="overlay" style={{ zIndex: 9999999 }}>
      <div className="modal" style={{ height: "fit-content", width: "fit-content" }}>
        <div className="content" style={{
            height: "fit-content",
            padding: "20px",
            width: "fit-content",
          }}>
        <div style={{ overflowY: "scroll" }}>
        <form className="form" onSubmit={submitHandler}>
         <div className="row">
            <h2>Add Order</h2>
          </div> 
          <div className="formGroup">     
          <div className="row" style={{width:"100%"}}>   
        <label className="selectLabel" style={{width:"100%"}}>
          Customer
          <Select
                    name="customer_uuid"
                    options={customersOptions}
                    onChange={onCustomerChange}
                    value={customerValue}
                    openMenuOnFocus={true}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    placeholder="Select"
                  />
                  <button
                    type="button"
                    onClick={() => setNewCustomerForm("Customer")}
                    className="item-sales-search"
                    style={{
                      width: "fit-content",
                      top: 0,
                    }}
                  >
                    <Add />
                  </button>
        </label>
        </div>
        
        </div>
        <button type="submit" className="submit">
              Add Order
          </button>
          </form>
          </div>
        <button onClick={onClose} className="closeButton">
                x
              </button>
      
      
      
    </div>
    </div>
    </div>
    {newCustomerForm ? (
      <AddCustomer
        onSave={(data, condition) => {
          console.log(data);
          if (newCustomerForm === "Customer")
            setOrder((prev) => ({
              ...prev,
              customer_uuid: data?.customer_uuid,
            }));
          
          getItemsData();
          setNewCustomerForm(false);
        }}
        name={newCustomerForm}
      />
    ) : (
      ""
    )}
    </>
  );
}

export default UserView;
