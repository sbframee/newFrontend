import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import {
  CopyAll,
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import axios from "axios";

import { useParams } from "react-router-dom";

const Dynamics = () => {
  const [itemsData, setItemsData] = useState([]);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");

  const [filterItemsData, setFilterItemsData] = useState([]);

  const [popupForm, setPopupForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [arragmentPopup, setArragmentPopup] = useState(false);

  const [filterTitle, setFilterTitle] = useState("");
  const [selections, setSelection] = useState([]);
  const params = useParams();
  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "/Event/getEvent/" + params.event_uuid,

      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      setItemsData(response.data.result.dynamic_data);
      setDomain(response.data.result.domains[0]);
    }
  };
  useEffect(() => {
    getItemsData();
  }, [popupForm, deletePopup]);
  useEffect(
    () =>
      setFilterItemsData(
        itemsData
        // .filter(
        //   (a) =>

        //     (!filterTitle ||
        //       a.question
        //         .toLocaleLowerCase()
        //         .includes(filterTitle.toLocaleLowerCase()))
        // )
      ),
    [itemsData, filterTitle]
  );
  const data = useMemo(
    () =>
      itemsData
        ?.map((b) => {
          let obj = { link: b.link };
          for (let d of b.details) {
            obj = {
              ...obj,
              [d.key]: d.value,
            };
          }
          return obj;
        })
        .filter((a) => {
          let obj = false;
          if (search) {
            for (const key in a) {
              console.log(a[key]);
              obj =
                !obj && a[key] && key !== "link"
                  ? a[key]
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  : obj;
            }
          }
          let res =
            (!filterTitle || a.inviter === filterTitle) && (!search || obj);
          return res;
        }),
    [filterTitle, itemsData, search]
  );
  const options = useMemo(() => {
    let arr = itemsData
      ?.map((b) => {
        let obj = { link: b.link };
        for (let d of b.details) {
          obj = {
            ...obj,
            [d.key]: d.value,
          };
        }
        return obj;
      })
      .map((a) => a.inviter);

    let uniqueArray = arr.filter(function (item, pos) {
      return arr.indexOf(item) == pos;
    });

    return uniqueArray;
  }, [itemsData]);
  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Dynamics</h2>
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
              type="text"
              onChange={(e) => setFilterTitle(e.target.value)}
              value={filterTitle}
              placeholder="Search Inviter..."
              className="searchInput"
            >
              <option value="">All</option>
              {options.map((a) => (
                <option value={a}>{a}</option>
              ))}
            </select>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search..."
              className="searchInput"
            />
            <div>Total Items: {data.length}</div>
            {selections?.length ? (
              <button
                className="item-sales-search"
                onClick={() => setPopupForm(selections)}
              >
                Add Invitation
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="table-container-user item-sales-container">
          <Table
            itemsDetails={filterItemsData}
            data={data}
            selections={selections}
            setSelection={setSelection}
            setPopupForm={setPopupForm}
            domain={domain}
          />
        </div>
      </div>
      {popupForm ? (
        <NewUserForm
          onSave={() => setPopupForm(false)}
          setItemsData={setItemsData}
          popupInfo={popupForm}
          items={itemsData}
          getItem={getItemsData}
          params={params}
          selections={selections}
          itemsData={itemsData}
          domian={domain}
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
      {arragmentPopup ? (
        <ArragmentPopup
          onSave={() => setArragmentPopup(false)}
          popupInfo={arragmentPopup}
          itemsData={itemsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Dynamics;
function Table({
  itemsDetails,
  data,
  selections,
  setSelection,
  setPopupForm,
  domain,
}) {
  const [items, setItems] = useState("sort_order");
  const [order, setOrder] = useState("");
  const [copied, setCopid] = useState("");

  return (
    <table
      className="user-table"
      style={{ maxWidth: "100vw", height: "fit-content", overflowX: "scroll" }}
    >
      <thead>
        <tr>
          <th colSpan={3} style={{ width: "140px" }}>
            <input
              type="checkbox"
              checked={selections.length === data.length}
              onChange={() => {
                let item = selections.length === data.length ? [] : data;
                setSelection(item);
              }}
            />
          </th>

          <th>S.N</th>

          {itemsDetails?.length
            ? itemsDetails[0]?.details.map((a) => (
                <th colSpan={3}>
                  <div className="t-head-element">
                    <span>{a.key}</span>
                    <div className="sort-buttons-container">
                      <button
                        onClick={() => {
                          setItems(a.key);
                          setOrder("asc");
                        }}
                      >
                        <KeyboardArrowUp className="sort-up sort-button" />
                      </button>
                      <button
                        onClick={() => {
                          setItems(a.key);
                          setOrder("desc");
                        }}
                      >
                        <KeyboardArrowDown className="sort-down sort-button" />
                      </button>
                    </div>
                  </div>
                </th>
              ))
            : ""}
        </tr>
      </thead>
      <tbody className="tbody">
        {data

          .sort((a, b) =>
            order === "asc"
              ? typeof a[items] === "string"
                ? a[items]?.localeCompare(b[items])
                : a[items] - b[items]
              : typeof a[items] === "string"
              ? b[items]?.localeCompare(a[items])
              : b[items] - a[items]
          )
          ?.map((item, i) => (
            <tr
              key={Math.random()}
              style={{ height: "30px" }}
              onClick={() => {}}
            >
              <td style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={selections.find((a) => a.link === item.link)}
                  onChange={() => {
                    setSelection((prev) =>
                      selections.find((a) => a.link === item.link)
                        ? selections.filter((a) => a.link !== item.link)
                        : [...(prev || []), item]
                    );
                  }}
                />
              </td>
              <td
                style={{ width: "50px" }}
                onClick={() => {
                  setPopupForm(item);
                }}
              >
                <Edit />
              </td>
              <td
                style={{ width: "50px" }}
                onClick={(e) => {
                  e.stopPropagation();

                  navigator.clipboard.writeText(
                    `${domain}/invitee/${item.link}`
                  );
                  setCopid(item.link);
                  setTimeout(() => {
                    setCopid("");
                  }, 3000);
                }}
              >
                {copied === item.link ? (
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
              <td>{i + 1}</td>
              {itemsDetails?.length
                ? itemsDetails[0]?.details.map((a) => (
                    <td colSpan={3}>{item[a.key]}</td>
                  ))
                : ""}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
function NewUserForm({
  onSave,
  popupInfo,
  itemCategories,
  getItem,
  params,
  selections,
  itemsData,
}) {
  const [data, setdata] = useState({ invitation_title: "" });
  useEffect(() => {
    setdata({
      invitation_title: "",
      link: popupInfo.map((a) => ({ link: a.link, status: 0 })),
      event_uuid: params.event_uuid,
    });
  }, [itemsData, params.event_uuid, popupInfo, popupInfo.link]);

  const [errMassage, setErrorMassage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    let response = await axios({
      method: "post",
      url: "/Invitation/postInvitation",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.success) {
      getItem();
      onSave();
    }
  };
  console.log(data);
  return (
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
                <h1>Create Invitation</h1>
              </div>

              <div className="formGroup">
                <div className="row">
                  <label className="selectLabel">
                    Title
                    <input
                      type="text"
                      name="route_title"
                      className="numberInput"
                      value={data.invitation_title}
                      onChange={(e) =>
                        setdata((prev) => ({
                          ...prev,
                          invitation_title: e.target.value,
                        }))
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
    setLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: "/Query/deleteQuery",
        data: { query_uuid: popupInfo.query_uuid },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        onSave();
      }
    } catch (err) {
      console.log(err);
      setErrorMassage("Order already exist");
    }
    setLoading(false);
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
                <h1>Confirm Delete Query ?</h1>
              </div>
              <div className="row">
                <h1>{popupInfo.question}</h1>
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
function ArragmentPopup({ onSave, popupInfo, itemsData }) {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setData(popupInfo?.trailing_question || []);
  }, [popupInfo.trailing_question]);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "put",
        url: "/Query/putQuery",
        data: { query_uuid: popupInfo.query_uuid, trailing_question: data },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        onSave();
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div
        className="modal"
        style={{ width: "fit-content", height: "fit-content" }}
      >
        <div
          className="content"
          style={{
            height: "max-content",
            padding: "20px",
            width: "fit-content",
          }}
        >
          <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row">
                <h1>Trailing Question</h1>
              </div>
              {data.length
                ? data
                    .sort((a, b) => a - b)
                    .map((a) => (
                      <div className="row flex" style={{ margin: "10px 0" }}>
                        <div>{a.sort_order}. </div>
                        <div style={{ width: "100%" }}>
                          {
                            itemsData.find((b) => b.query_uuid === a.query_uuid)
                              ?.question
                          }
                        </div>
                        <div
                          onClick={() => {
                            setData((prev) =>
                              prev
                                .filter((b) => b.query_uuid !== a.query_uuid)
                                .sort((a, b) => a - b)
                                .map((a, i) => ({ ...a, sort_order: i + 1 }))
                            );
                          }}
                        >
                          <Delete />
                        </div>
                      </div>
                    ))
                : ""}
              <div className="row">
                <label className="selectLabel">
                  Other Queries
                  <select
                    name="route_title"
                    className="numberInput"
                    onChange={(e) =>
                      e.target.value
                        ? setData((prev) => [
                            ...prev,
                            {
                              query_uuid: e.target.value,
                              sort_order: prev.length + 1,
                            },
                          ])
                        : {}
                    }
                    maxLength={42}
                    style={{ width: "200px" }}
                  >
                    {console.log(popupInfo, data)}
                    <option value="">None</option>
                    {itemsData
                      .filter(
                        (a) =>
                          a.query_uuid !== popupInfo.query_uuid &&
                          !data.find((b) => b.query_uuid === a.query_uuid)
                      )
                      .map((a) => (
                        <option value={a.query_uuid}>{a.question}</option>
                      ))}
                  </select>
                </label>
              </div>
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
                  <button type="submit" className="submit">
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
