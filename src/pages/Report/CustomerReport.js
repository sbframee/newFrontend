import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import axios from "axios";

const CustomerReport = () => {
  const [customersData, setCustomersData] = useState([]);
  const [filterCustomersData, setFilterCustomersData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [customerList, setCustomerList] = useState([]); 
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:9000/customers/GetCustomerList",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setCustomersData(response.data.result);
  };

  const getCustomerList = async () => {
    try {
      const response = await axios.get("http://localhost:9000/groups/GetCustomer_GroupList");
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
    const filteredItems = customersData.filter(
      (item) => (!selectedCustomer || item.group === selectedCustomer)
    );
    setFilterCustomersData(filteredItems);
  }, [customersData, selectedCustomer]);

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
        
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="searchInput"
            >
              <option value="">Select Customer Group</option>
              {customerList.map((item) => (
                <option key={item.customerGroup_uuid} value={item.customer_group}>
                  {item.customer_group}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedCustomer && filterCustomersData.length > 0 ? (
          <div className="table-container-user item-sales-container">
            <Table itemsDetails={filterCustomersData} setPopupForm={setPopupForm} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CustomerReport;

function Table({ itemsDetails }) {
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
          
          <th colSpan={6}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails?.map((item, i) => (
          <tr key={item.customer_uuid} style={{ height: "30px" }} onClick={() => {}}>
            <td>{i + 1}</td>
            <td colSpan={3}>{item.customer_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
