import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import axios from "axios";

const CustomerReport = () => {
  const [customersData, setCustomersData] = useState([]);
  const [filterCustomersData, setFilterCustomersData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [customerList, setCustomerList] = useState([]); 
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

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
        setCustomersData(ordersWithCustomerData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerList = async () => {
    try {
      const response = await axios.get("http://localhost:9000/customers/GetCustomerList");
      if (response.data.success) {
        const items = response.data.result;
        setCustomerList(items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItemsData();
    getCustomerList();
  }, [popupForm]);

  useEffect(() => {
    setFilterCustomersData(
      customersData.filter(
        (a) =>
          a.date &&
          (!filterDate || a.date.toLocaleLowerCase().includes(filterDate.toLocaleLowerCase()))
      )
    );
  }, [customersData, filterDate]);

 
  const handleSearch = () => {
    setSearchClicked(true);
    const filteredCustomers = customersData.filter(
      (item) =>
        (!filterDate || item.date === filterDate) &&
        (!selectedCustomer || item.item_name === selectedCustomer)
    );
    setFilterCustomersData(filteredCustomers);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Customer Report</h2>
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
              type="date"
              onChange={(e) => setFilterDate(e.target.value)}
              value={filterDate}
              placeholder="Search date"
              className="searchInput"
            />

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="searchInput"
            >
              <option value="">All Customer</option>
              {customerList.map((item) => (
                <option key={item.customer_id} value={item.customer_name}>
                  {item.customer_name}
                </option>
              ))}
            </select>

            <button className="item-sales-search" onClick={handleSearch}>Search</button>
          </div>
        </div>
        
        {searchClicked && (
          <div className="table-container-user item-sales-container">
            <Table itemsDetails={filterCustomersData} setPopupForm={setPopupForm} />
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerReport;

function Table({ itemsDetails, setPopupForm }) {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
