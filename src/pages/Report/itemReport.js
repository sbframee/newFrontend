import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import axios from "axios";

const ItemReport = () => {
  const [itemsData, setItemsData] = useState([]);
  const [filterItemsData, setFilterItemsData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [itemList, setItemList] = useState([]); 
  const [selectedItem, setSelectedItem] = useState("");

  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:9000/items/GetItemList",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setItemsData(response.data.result);
  };

  const getItemList = async () => {
    try {
      const response = await axios.get("http://localhost:9000/groups/GetItem_GroupList");
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
    const filteredItems = itemsData.filter(
      (item) => (!selectedItem || item.item_group === selectedItem)
    );
    setFilterItemsData(filteredItems);
  }, [itemsData, selectedItem]);

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
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="searchInput"
            >
              <option value="">Select Item Group</option>
              {itemList.map((item) => (
                <option key={item.itemGroup_uuid} value={item.item_group}>
                  {item.item_group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedItem && filterItemsData.length > 0 ? (
          <div className="table-container-user item-sales-container">
            <Table itemsDetails={filterItemsData} setPopupForm={setPopupForm} />
          </div>
        ) : null}
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
              <span>Item</span>
            </div>
          </th>
          <th colSpan={6}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails?.map((item, i) => (
          <tr key={item.item_uuid} style={{ height: "30px" }} onClick={() => {}}>
            <td>{i + 1}</td>
            <td colSpan={3}>{item.item_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
