import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import axios from "axios";

const ItemReport = () => {
  const [itemsData, setItemsData] = useState([]);
  const [filterItemsData, setFilterItemsData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [itemList, setItemList] = useState([]); // List of all items
  const [selectedItem, setSelectedItem] = useState("");
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
        setItemsData(ordersWithCustomerData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getItemList = async () => {
    try {
      const response = await axios.get("http://localhost:9000/items/GetItemList");
      if (response.data.success) {
        const items = response.data.result;
        setItemList(items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItemsData();
    getItemList();
  }, [popupForm]);

  useEffect(() => {
    setFilterItemsData(
      itemsData.filter(
        (a) =>
          a.date &&
          (!filterDate || a.date.toLocaleLowerCase().includes(filterDate.toLocaleLowerCase()))
      )
    );
  }, [itemsData, filterDate]);

  const handleSearch = () => {
    setSearchClicked(true);
    const filteredItems = itemsData.filter(
      (item) =>
        (!filterDate || item.date === filterDate) &&
        (!selectedItem || item.item_name === selectedItem)
    );
    setFilterItemsData(filteredItems);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Item Report</h2>
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
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="searchInput"
            >
              <option value="">All Items</option>
              {itemList.map((item) => (
                <option key={item.item_id} value={item.item_name}>
                  {item.item_name}
                </option>
              ))}
            </select>

            <button className="item-sales-search" onClick={handleSearch}>Search</button>
          </div>
        </div>
        
        {searchClicked && (
          <div className="table-container-user item-sales-container">
            <Table itemsDetails={filterItemsData} setPopupForm={setPopupForm} />
          </div>
        )}
      </div>
    </>
  );
};

export default ItemReport;

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
