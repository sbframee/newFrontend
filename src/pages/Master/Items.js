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
const Items = () => {
  const [itemsData, setItemsData] = useState([]);
  const [disabledItem, setDisabledItem] = useState(false);
  const [message, setMessage] = useState();

  const [filterItemsData, setFilterItemsData] = useState([]);

  const [popupForm, setPopupForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [filterTitle, setFilterTitle] = useState("");

  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:9000/orders/GetOrderList",

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
            a.cname &&
            (!filterTitle ||
              a.cname
                .toLocaleLowerCase()
                .includes(filterTitle.toLocaleLowerCase()))
        )
      ),
    [itemsData, filterTitle, disabledItem]
  );
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
           
            <button
              className="item-sales-search"
              onClick={() => setPopupForm(true)}
            >
              Add
            </button>
          </div>
        </div>
        <div className="table-container-user item-sales-container">
          <Table
            itemsDetails={filterItemsData}
            setPopupForm={setPopupForm}
            setDeletePopup={setDeletePopup}
          />
        </div>
      </div>
      {popupForm ? (
        <AddGroup
          onSave={() => setPopupForm(false)}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <DeleteItemPopup
          onSave={() => setDeletePopup(false)}
          setItemsData={setItemsData}
          popupInfo={deletePopup}
        />
      ) : (
        ""
      )}
      {message ? (
        <MessagePopup
          message={message.text1}
          message2={message.text2}
          button1="Okay"
          onClose={() => setMessage(false)}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Items;
function Table({ itemsDetails, setPopupForm, setDeletePopup }) {
  const [items, setItems] = useState("");
  const [order, setOrder] = useState("");
  const [copied, setCopid] = useState("");
  const navigate = useNavigate();
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
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("cname");
                    setOrder("asc");
                  }}
                >
                  <KeyboardArrowUp className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("cname");
                    setOrder("desc");
                  }}
                >
                  <KeyboardArrowDown className="sort-down sort-button" />
                </button>
              </div>
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

              <td colSpan={3}>{item?.cname}</td>

              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setPopupForm({ type: "edit", data: item });
                }}
              >
                <Edit />
              </td>
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setDeletePopup(item);
                }}
              >
                <DeleteOutline />
              </td>
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  navigator.clipboard.writeText(
                    `https://savedate.in/inviters/${item.order_uuid}`
                  );
                  setCopid(item.event_uuid);
                  setTimeout(() => {
                    setCopid("");
                  }, 3000);
                }}
              >
                {copied === item.event_uuid ? (
                  <div
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    Copied!
                  </div>
                ) : (
                  <CopyAll />
                )}
              </td>
              <td>
                <button
                  className="item-sales-search"
                  onClick={() => navigate("/admin/queries/" + item.order_uuid)}
                >
                  Queries
                </button>
              </td>
              <td>
                <button
                  className="item-sales-search"
                  onClick={() => navigate("/admin/dynamics/" + item.order_uuid)}
                >
                  Dynamics
                </button>
              </td>
              
            </tr>
          ))}
      </tbody>
    </table>
  );
}
function AddGroup({ onSave }) {
  const [data, setdata] = useState({});
  const [group, setGroup] = useState();

  const [errMassage, setErrorMassage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const orderData = {
      group
    };

    try {
      await axios.post('http://localhost:9000/categories/postgroup', orderData);
      console.log('Group added successfully');
      onSave();
    } catch (error) {
      console.error('Failed to add Group', error);
    }
  };


  
  return (
    <>
      <div className="overlay" style={{ zIndex: 9999999 }}>
        <div
          className="modal"
          style={{ height: "fit-content", width: "fit-content" }}
        >
          <div
            className="content"
            style={{
              height: "fit-content",
              padding: "20px",
              width: "fit-content",
            }}
          >
            <div style={{ overflowY: "scroll" }}>
              <form className="form" onSubmit={submitHandler}>
                <div className="row">
                  <h1>Add Group</h1>
                </div>

                <div className="formGroup">
                  <div className="row">
                    <label className="selectLabel">
                      Group Name:
                      <input
                        type="text"
                        name="route_title"
                        className="numberInput"
                        value={data?.group}
                        onChange={(e) =>
                          setGroup(e.target.value)
                        }
                        maxLength={60}
                      />
                    </label>
                  </div>
                 
                 </div>
                <i style={{ color: "red" }}>
                  {errMassage === "" ? "" : "Error: " + errMassage}
                </i>

                <button type="submit" className="submit">
                  Save changes
                </button>
              </form>
            </div>
            <button onClick={onSave} className="closeButton">
              x
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
}

function DeleteItemPopup({ onSave, popupInfo }) {
  const [errMassage, setErrorMassage] = useState("");
  const [enable, setEnable] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnable(true), 5000);
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ width: "fit-content", height: "250px" }}>
        <div
          className="content"
          style={{
            height: "100px",
            padding: "20px",
            width: "fit-content",
          }}
        >
          <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row">
                <h1>Confirm Delete Order ?</h1>
              </div>
              <div className="row">
                <h1>{popupInfo.cname}</h1>
              </div>

              <i style={{ color: "red" }}>
                {errMassage === "" ? "" : "Error: " + errMassage}
              </i>
              <div
                className="flex"
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {loading ? (
                  <button
                    className="submit"
                    id="loading-screen"
                    style={{ background: "red", width: "120px" }}
                  >
                    <svg viewBox="0 0 100 100">
                      <path
                        d="M10 50A40 40 0 0 0 90 50A40 44.8 0 0 1 10 50"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          dur="1s"
                          repeatCount="indefinite"
                          keyTimes="0;1"
                          values="0 50 51;360 50 51"
                        ></animateTransform>
                      </path>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="submit"
                    style={{ background: "red", opacity: enable ? 1 : 0.5 }}
                    disabled={!enable}
                  >
                    Confirm
                  </button>
                )}
                <button type="button" className="submit" onClick={onSave}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
