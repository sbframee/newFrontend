import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import "./style.css";
import Select from "react-select";
import { Add } from "@mui/icons-material";
import "react-datepicker/dist/react-datepicker.css";
import AddCustomer from './AddCustomer';

const AddOrder = ({onSave, onClose}) => {
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
};

export default AddOrder;
