import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import {
  Edit,
} from "@mui/icons-material";
import axios from "axios";

const User_Role = () => {
  const [itemsData, setItemsData] = useState([]);
  const [disabledItem, setDisabledItem] = useState(false);
  const [filterItemsData, setFilterItemsData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");

  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:9000/groups/GetUserRoleList",

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setItemsData(response.data.result);
  };
  useEffect(() => {
    getItemsData();
  }, [popupForm]);
  useEffect(
    () =>
      setFilterItemsData(
        itemsData.filter(
          (a) =>
            a.user_role &&
            (!filterTitle ||
              a.user_role
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
          <h2>User Roll</h2>
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
              placeholder="Search Role Title..."
              className="searchInput"
            />

            <div>Total Items: {filterItemsData.length}</div>
           
            <button
              className="item-sales-search"
              onClick={() => setPopupForm("Groups")}
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
        <AddRole
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

export default User_Role;
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
              <span>User Role</span>
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

              <td colSpan={3}>{item?.user_role}</td>

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

function AddRole({ onSave, popupInfo }) {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        user_role: '',
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (popupInfo?.type === 'edit') {
        response = await axios.put(
          'http://localhost:9000/groups/putUserRole',
          [formData],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:9000/groups/postUserRole',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.data.success) {
        onSave(response.data.result, 1);
      }
    } catch (error) {
      console.error(error);
    }
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
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} Role</h1>
              </div>
              <div className="formGroup">
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    User Role
                    <input
                      type="text"
                      name="user_group"
                      className="numberInput"
                      value={formData?.user_role || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, user_role: e.target.value })
                      }
                    />
                  </label>
                </div>
             </div>
             <i style={{ color: 'red' }}>
                {errMessage === '' ? '' : 'Error: ' + errMessage}
              </i>
              <button type="submit" className="submit">
              {popupInfo.type === "edit" ? "Update" : "Save"}
              </button>
            </form>
          </div>
          <button onClick={onSave} className="closeButton">
            x
          </button>
           
        </div>
      </div>
    </div>
  );
}

