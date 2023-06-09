import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import {
  Edit,
} from "@mui/icons-material";
import axios from "axios";
import AddOrder from "../MainAdmin/AddOrder";
import Update from "../MainAdmin/Update";

const Items = () => {
  const [itemsData, setItemsData] = useState([]);
  const [disabledItem, setDisabledItem] = useState(false);
  const [filterItemsData, setFilterItemsData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [updateForm, setUpdateForm] = useState(false);

  const getItemsData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/orders/GetOrderList");
      if (response.data.success) {
        const orders = response.data.result;

        const ordersWithCustomerData = await Promise.all(
          orders.map(async (orderItem) => {
            try {
              const [customerResponse, itemResponse, supplierResponse] = await Promise.all([
                axios.get(`http://localhost:9000/customers/getCustomerDetails/${orderItem.customer_uuid}`),
                axios.get(`http://localhost:9000/items/getItemDetails/${orderItem.item_uuid}`),
                axios.get(`http://localhost:9000/suppliers/getSupplierDetails/${orderItem.supplier_uuid}`)
              ]);

              const customerData = customerResponse.data.result;
              const itemData = itemResponse.data.result;
              const supplierData = supplierResponse.data.result;

              return {
                ...orderItem,
                customer_name: customerData.customer_name,
                item_name: itemData.item_name,
                supplier_name: supplierData.supplier_name
              };
            } catch (error) {
              console.error(error);
              return orderItem; 
            }
          })
        );
        setItemsData(ordersWithCustomerData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItemsData();
  }, [popupForm]);

  useEffect(
    () =>
      setFilterItemsData(
        itemsData.filter(
          (a) =>
            a.customer_name &&
            (!filterTitle ||
              a.customer_name
                .toLocaleLowerCase()
                .includes(filterTitle.toLocaleLowerCase()))
        )
      ),
    [itemsData, filterTitle, disabledItem]
  );
  
  const openPopupForm = () => {
    setPopupForm(true);
  };

  const handlePopupClose = () => {
    setPopupForm(false);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Orders</h2>
        </div>
        <div id="item-sales-top">
          <div
            id="date-input-container"
            style={{
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <input
              type="text"
              onChange={(e) => setFilterTitle(e.target.value)}
              value={filterTitle}
              placeholder="Search Order Title..."
              className="searchInput"
            />

            <div>Total Items: {filterItemsData.length}</div>

            <button className="item-sales-search" onClick={openPopupForm}>
              Add
            </button>
          </div>
        </div>
        <div className="table-container-user item-sales-container">
        <Table itemsDetails={filterItemsData} setUpdateForm={setUpdateForm} />
        </div>
      </div>
      {popupForm ? (
        <AddOrder onSave={handlePopupClose} onClose={handlePopupClose}  popupInfo={popupForm}/>
      ) : (
        ""
      )}
      {updateForm && updateForm.type === "edit" && (
  <Update
    onSave={handlePopupClose}
    onClose={handlePopupClose}
    item={updateForm.data}
    order={updateForm}
  />
)}
    </>
  );
};

export default Items;

function Table({ itemsDetails, setUpdateForm }) {
  return (
    <table
      className="user-table"
      style={{ maxWidth: "100vw", height: "fit-content", overflowX: "scroll" }}
    >
      <thead>
        <tr>
          <th>S.N</th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Customer</span>
            </div>
          </th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Item</span>
            </div>
          </th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Supplier</span>
            </div>
          </th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Order</span>
            </div>
          </th>
          <th colSpan={6}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails?.map((item, i) => (
          <tr key={item.order_uuid} style={{ height: "30px" }} onClick={() => {}}>
            <td>{i + 1}</td>
            <td colSpan={3}>{item.customer_name}</td>
            <td colSpan={3}>{item.item_name}</td>
            <td colSpan={3}>{item.supplier_name}</td>
            <td colSpan={3}>{item.category}</td>
            <td colSpan={1} onClick={(e) => { e.stopPropagation(); setUpdateForm({ type: "edit", data: item }); }}>
              <Edit />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
