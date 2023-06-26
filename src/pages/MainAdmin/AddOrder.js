import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Add } from "@mui/icons-material";
import AddCustomer from './AddCustomer';
import AddItem from "./AddItem";
import Select from "react-select";
import AddSupplier from './AddSupplier';

const AddOrder = ({ onSave, onClose }) => {
    const [order, setOrder] = useState();
    const [category, setCategory] = useState('New Order');
    const [latestOrderId, setLatestOrderId] = useState(0);
    const [customersData, setCustomersData] = useState([]);
    const [newCustomerForm, setNewCustomerForm] = useState(false);
    const [newItemForm, setNewItemForm] = useState(false);
    const [itemsData, setItemsData] = useState([]);
    const [newSupplierForm, setNewSupplierForm] = useState(false);
    const [suppliersData, setSuppliersData] = useState([]);


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
  
    const getCustomersData = async () => {
      const response = await axios.get("http://localhost:9000/customers/GetCustomerList");
      console.log(response);
      if (response.data.success) setCustomersData(response.data.result);
    };

    const getItemsData = async () => {
      const response = await axios.get("http://localhost:9000/items/GetItemList");
      console.log(response);
      if (response.data.success) setItemsData(response.data.result);
    };

    const getSuppliersData = async () => {
      const response = await axios.get("http://localhost:9000/suppliers/GetSupplierList");
      console.log(response);
      if (response.data.success) setSuppliersData(response.data.result);
    };
  
  
    useEffect(() => {
      fetchLatestOrderId();
      getCustomersData();
      getItemsData();
      getSuppliersData();
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
  
    const itemsOptions = useMemo(
      () =>
        itemsData.map((a) => ({
          value: a.item_uuid,
          label: a?.item_name,
        })),
      [itemsData]
    );
  
    const itemValue = useMemo(
      () =>
        order?.item_uuid
          ? {
              value: order?.item_uuid,
              label: (() => {
                let a = itemsData?.find(
                  (j) => j.item_uuid === order.item_uuid
                );
                return a?.item_name;
              })(),
            }
          : "",
      [itemsData, order]
    );
  
    const onItemChange = (doc, value) => {
      if (value.name === "item_uuid");
      setOrder((prev) => ({
        ...prev,
        [value.item_name]: doc.value,
      }));
    };
  
    const suppliersOptions = useMemo(
      () =>
        suppliersData.map((a) => ({
          value: a.supplier_uuid,
          label: a?.supplier_name,
        })),
      [suppliersData]
    );
  
    const supplierValue = useMemo(
      () =>
        order?.supplier_uuid
          ? {
              value: order?.supplier_uuid,
              label: (() => {
                let a = suppliersData?.find(
                  (j) => j.supplier_uuid === order.supplier_uuid
                );
                return a?.supplier_name;
              })(),
            }
          : "",
      [suppliersData, order]
    );
  
    const onSupplierChange = (doc, value) => {
      if (value.name === "supplier_uuid");
      setOrder((prev) => ({
        ...prev,
        [value.supplier_name]: doc.value,
      }));
    };
  
  
    const submitHandler = async (e) => {
      e.preventDefault();
      const newOrderId = latestOrderId + 1;
  
      const orderData = {
        customer_uuid: customerValue.value,
        item_uuid: itemValue.value,
        supplier_uuid: supplierValue.value,
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
      <div className="modal" style={{ height: "fit-content", width: "20%" }}>
        <div className="content" style={{
            height: "fit-content",
            padding: "20px",
            width: "100%",
          }}>
          <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row" style={{width:"100%"}}>
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
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewCustomerForm("Customer")}
                    className="item-sales-search"
                    style={{
                      width: "30%",
                      top: 0,
                      height: "fit-content"
                    }}
                  >
                    <Add />
                  </button>
                  
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                  Item
          <Select
                    name="item_uuid"
                    options={itemsOptions}
                    onChange={onItemChange}
                    value={itemValue}
                    openMenuOnFocus={true}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    placeholder="Select"
                  />               
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewItemForm("Item")}
                    className="item-sales-search"
                    style={{
                      width: "fit-content",
                      top: 0,
                    }}
                  >
                    <Add />
                  </button>
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                  Supplier
          <Select
                    name="supplier_uuid"
                    options={suppliersOptions}
                    onChange={onSupplierChange}
                    value={supplierValue}
                    openMenuOnFocus={true}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    placeholder="Select"
                  />
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewSupplierForm("Supplier")}
                    className="item-sales-search"
                    style={{
                      width: "fit-content",
                      top: 0,
                    }}
                  >
                    <Add />
                  </button>
                </div>
               </div>
              <button type="submit" className="submit">Save</button>
            </form>
          </div>
          <button onClick={onClose} className="closeButton">x</button>
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
          
          getCustomersData();
          setNewCustomerForm(false);
        }}
        name={newCustomerForm}
      />
    ) : (
      ""
    )}
    {newItemForm ? (
      <AddItem
        onSave={(data, condition) => {
          console.log(data);
          if (newItemForm === "Item")
            setOrder((prev) => ({
              ...prev,
              item_uuid: data?.item_uuid,
            }));
          
          getItemsData();
          setNewItemForm(false);
        }}
        name={newItemForm}
      />
    ) : (
      ""
    )}
    {newSupplierForm ? (
      <AddSupplier
        onSave={(data, condition) => {
          console.log(data);
          if (newSupplierForm === "Supplier")
            setOrder((prev) => ({
              ...prev,
              supplier_uuid: data?.supplier_uuid,
            }));
          
          getItemsData();
          setNewSupplierForm(false);
        }}
        name={newSupplierForm}
      />
    ) : (
      ""
    )}
    </>
  );
};

export default AddOrder;
