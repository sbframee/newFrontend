import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import {
  CopyAll,
  DeleteOutline,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import MessagePopup from "../../components/MessagePopup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddCustomer from "../MainAdmin/AddCustomer";

const Customers = () => {
  const [itemsData, setItemsData] = useState([]);
  const [disabledItem, setDisabledItem] = useState(false);
  const [message, setMessage] = useState();

  const [filterItemsData, setFilterItemsData] = useState([]);

  const [popupForm, setPopupForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [filterTitle, setFilterTitle] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:9000/customers/GetCustomerList",

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setItemsData(response.data.result);
  };
  useEffect(() => {
    getItemsData();
  }, [popupForm, deletePopup]);
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
  useEffect(
    () =>
      setFilterItemsData(
        itemsData.filter(
          (a) =>
            a.group &&
            (!filterGroup ||
              a.group
                .toLocaleLowerCase()
                .includes(filterGroup.toLocaleLowerCase())),
           
        )
      ),
    [itemsData, filterGroup, disabledItem]
  );
  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Customers</h2>
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
              placeholder="Search Customer Title..."
              className="searchInput"
            />

           <input
              type="text"
              onChange={(e) => setFilterGroup(e.target.value)}
              value={filterGroup}
              placeholder="Search Group Title..."
              className="searchInput"
            />

            <div>Total Items: {filterItemsData.length}</div>
           
            <button
              className="item-sales-search"
              onClick={() => setPopupForm("Customer")}
            >
              Add
            </button>
          </div>
        </div>
        <div className="table-container-user item-sales-container">
          <Table
            itemsDetails={filterItemsData}
            setPopupForm={setPopupForm}
          />
        </div>
      </div>
      {popupForm ? (
        <AddCustomer
          onSave={() => setPopupForm(false)}
          setItemsData={setItemsData}
          popupInfo={popupForm}
          items={itemsData}
          getItem={getItemsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Customers;
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
              <span>Name</span>
              
            </div>
          </th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Mobile</span>
              
            </div>
          </th>
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Group</span>
              
            </div>
          </th>

          <th colSpan={6}></th>
        </tr>
      </thead>
      <tbody className="tbody">
      {itemsDetails?.map((item, i) => (
            <tr
              key={Math.random()}
              style={{ height: "30px" }}
              onClick={() => {}}
            >
              <td>{i + 1}</td>

              <td colSpan={3}>{item?.customer_name}</td>
              <td colSpan={3}>{item?.customer_mobile}</td>
              <td colSpan={3}>{item?.group}</td>
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setPopupForm({ type: "edit", data: item });
                }}
              >
                <Edit />
              </td>
              
            </tr>
          ))}
      </tbody>
    </table>
  );
}

