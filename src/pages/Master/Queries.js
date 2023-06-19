import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import {
  Add,
  AudioFile,
  Cancel,
  Close,
  CopyAll,
  Delete,
  DeleteOutline,
  Edit,
  EmojiEmotions,
  Image,
  KeyboardArrowDown,
  KeyboardArrowUp,
  UploadFile,
} from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { useParams } from "react-router-dom";
import { server } from "../../App";
import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css";
// function HtmlEditor({ value, setValue,...props }) {
//   const modules = {
//     toolbar: [["bold", "italic", "underline"]],
//   };
//   const { quill, quillRef } = useQuill({ modules,editor:value });

//   React.useEffect(() => {
//     if (quill) {
//       quill.on("text-change", () => {
//         console.log(quillRef.current.firstChild.innerHTML);
//         setValue(quillRef.current.firstChild.innerHTML);
//       });
//     }
//   }, [quill]);

//   console.log(value, "this is quill editor");
//   return (
//     <div >
//       <div {...props}>
//         <div ref={quillRef} />
//       </div>
//     </div>
//   );
// }
const Queries = () => {
  const [itemsData, setItemsData] = useState([]);

  const [filterItemsData, setFilterItemsData] = useState([]);

  const [popupForm, setPopupForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [copyQueryPopup, setCopyQueryPopup] = useState(false);
  const [arragmentPopup, setArragmentPopup] = useState(false);

  const [filterTitle, setFilterTitle] = useState("");
  const params = useParams();
  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "/Query/getQuery/" + params.event_uuid,

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
            a.question &&
            (!filterTitle ||
              a.question
                .toLocaleLowerCase()
                .includes(filterTitle.toLocaleLowerCase()))
        )
      ),
    [itemsData, filterTitle]
  );

  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Queries</h2>
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
              placeholder="Search Event Title..."
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
            setArragmentPopup={setArragmentPopup}
            setCopyQueryPopup={setCopyQueryPopup}
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
        />
      ) : (
        ""
      )}
      {copyQueryPopup ? (
        <NewUserForm
          onSave={() => setCopyQueryPopup(false)}
          setItemsData={setItemsData}
          popupInfo={copyQueryPopup}
          items={itemsData}
          getItem={getItemsData}
          params={params}
          copy={true}
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

export default Queries;
function Table({
  itemsDetails,
  setPopupForm,
  setDeletePopup,
  setArragmentPopup,
  setCopyQueryPopup,
}) {
  const [items, setItems] = useState("sort_order");
  const [order, setOrder] = useState("");

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
              <span>Questions</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("question");
                    setOrder("asc");
                  }}
                >
                  <KeyboardArrowUp className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("question");
                    setOrder("desc");
                  }}
                >
                  <KeyboardArrowDown className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>

          <th colSpan={4} style={{ width: "30vw" }}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails
          .map((a) => ({ ...a, item_discount: +a.item_discount || 0 }))
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
              <td>{i + 1}</td>

              <td colSpan={3}>{item.question}</td>

              <td
                onClick={(e) => {
                  e.stopPropagation();

                  setPopupForm({ type: "edit", data: item });
                }}
              >
                <Edit />
              </td>
              <td
                onClick={(e) => {
                  e.stopPropagation();

                  setCopyQueryPopup({ ...item, question: "" });
                }}
              >
                <CopyAll />
              </td>
              <td
                onClick={(e) => {
                  e.stopPropagation();

                  setDeletePopup(item);
                }}
              >
                <DeleteOutline />
              </td>

              <td>
                <button
                  className="item-sales-search"
                  onClick={() => setArragmentPopup(item)}
                >
                  Trailing
                </button>
              </td>
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
  copy,
}) {
  const [data, setdata] = useState({});
  const [image, setImage] = useState();
  const [active, setActive] = useState();

  const [errMassage, setErrorMassage] = useState("");

  useEffect(() => {
    if (copy) {
      setdata(popupInfo);
    } else if (popupInfo?.type === "edit")
      setdata({
        ...popupInfo.data,
      });
    else {
      setdata({ event_uuid: params.event_uuid });
    }
  }, [itemCategories, popupInfo.data, popupInfo?.type]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let jsonData = data;
    delete jsonData._id;
    if (!data.question) {
      setErrorMassage("Please insert Item Title");
      return;
    }
    let response;
    if (popupInfo?.type === "edit") {
      response = await axios({
        method: "put",
        url: "/Query/putQuery",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      response = await axios({
        method: "post",
        url: "/Query/postQuery",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (response?.data?.success) {
      if (image?.length) {
        for (let Item of image) {
          const form = new FormData();
          form.append("song", Item);
          await axios({
            method: "post",
            url: "/Event/uploadSong",
            data: form,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }
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
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} Query</h1>
              </div>

              <div className="formGroup">
                <div className="row">
                  <label className="selectLabel">
                    Question
                    <input
                      type="text"
                      name="route_title"
                      className="numberInput"
                      value={data?.question}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          question: e.target.value,
                        })
                      }
                      maxLength={60}
                    />
                  </label>
                </div>

                {data.response?.length
                  ? data.response.map((item) => (
                      <div className="row" key={item.uuid}>
                        <label className="selectLabel">
                          Type
                          <select
                            name="route_title"
                            className="numberInput"
                            value={item?.type}
                            onChange={(e) =>
                              setdata((prev) => ({
                                ...prev,
                                response: prev.response.map((a) =>
                                  a.uuid === item.uuid
                                    ? { ...a, type: e.target.value }
                                    : a
                                ),
                              }))
                            }
                            maxLength={42}
                            style={{ width: "200px" }}
                          >
                            <option value="img">Image</option>
                            <option value="text">Text</option>
                            <option value="yt">Youtube</option>
                            <option value="hl">HyperLink</option>
                            <option value="gif">GIF</option>
                          </select>
                        </label>
                        {item.img_url && item.type === "img" ? (
                          <img
                            src={server + "/" + item.img_url}
                            alt="noImage"
                            style={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          ""
                        )}
                        {item.gif && item.type === "gif" ? (
                          <img
                            src={server + "/" + item.gif}
                            alt="noGIF"
                            style={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          ""
                        )}
                        {!item.type ? (
                          ""
                        ) : item.type === "img" ? (
                          <label
                            className="selectLabel"
                            htmlFor={item.uuid}
                            style={{ cursor: "pointer" }}
                          >
                            Upload Image
                            <input
                              type="file"
                              id={item.uuid}
                              onWheel={(e) => e.target.blur()}
                              name="sort_order"
                              className="numberInput"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const previousFile = e.target.files[0];
                                const newFile = new File(
                                  [previousFile],
                                  item.uuid + ".png"
                                );
                                setImage((prev) => [...(prev || []), newFile]);
                                setdata((prev) => ({
                                  ...prev,
                                  response: prev.response.map((a) =>
                                    a.uuid === item.uuid
                                      ? { ...a, img_url: item.uuid + ".png" }
                                      : a
                                  ),
                                }));
                              }}
                              accept="image/png"
                            />
                            <UploadFile />
                          </label>
                        ) : item.type === "gif" ? (
                          <label
                            className="selectLabel"
                            htmlFor={item.uuid + "gif"}
                            style={{ cursor: "pointer" }}
                          >
                            Upload Gif
                            <input
                              type="file"
                              id={item.uuid + "gif"}
                              onWheel={(e) => e.target.blur()}
                              name="sort_order"
                              className="numberInput"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const previousFile = e.target.files[0];
                                const newFile = new File(
                                  [previousFile],
                                  item.uuid + ".gif"
                                );
                                setImage((prev) => [...(prev || []), newFile]);
                                setdata((prev) => ({
                                  ...prev,
                                  response: prev.response.map((a) =>
                                    a.uuid === item.uuid
                                      ? { ...a, gif: item.uuid + ".gif" }
                                      : a
                                  ),
                                }));
                              }}
                              accept=".gif"
                            />
                            <UploadFile />
                          </label>
                        ) : item.type === "text" ? (
                          <label className="selectLabel">
                            Text
                            <div className="flex">
                              <textarea
                                type="text"
                                onWheel={(e) => e.target.blur()}
                                name="sort_order"
                                className="numberInput"
                                value={item?.text}
                                style={{ height: "100px" }}
                                onChange={(e) =>
                                  setdata((prev) => ({
                                    ...prev,
                                    response: prev.response.map((a) =>
                                      a.uuid === item.uuid
                                        ? { ...a, text: e.target.value }
                                        : a
                                    ),
                                  }))
                                }
                              />

                              {active === item.uuid ? (
                                <div
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={() => setActive("")}
                                >
                                  <Close />
                                </div>
                              ) : (
                                <div
                                  style={{ cursor: "pointer", color: "green" }}
                                  onClick={() => setActive(item.uuid)}
                                >
                                  <EmojiEmotions />
                                </div>
                              )}
                            </div>
                            {active === item.uuid ? (
                              <Picker
                                onEmojiClick={(e, eo) =>
                                  setdata((prev) => ({
                                    ...prev,
                                    response: prev.response.map((a) =>
                                      a.uuid === item.uuid
                                        ? { ...a, text: a.text + e.emoji }
                                        : a
                                    ),
                                  }))
                                }
                              />
                            ) : (
                              ""
                            )}
                          </label>
                        ) : (
                          <>
                            <label className="selectLabel">
                              {item.type === "hl" ? "Hyper Link" : "Video Link"}

                              <input
                                type="text"
                                onWheel={(e) => e.target.blur()}
                                name="sort_order"
                                className="numberInput"
                                value={item[item.type]}
                                onChange={(e) =>
                                  setdata((prev) => ({
                                    ...prev,
                                    response: prev.response.map((a) =>
                                      a.uuid === item.uuid
                                        ? { ...a, [item.type]: e.target.value }
                                        : a
                                    ),
                                  }))
                                }
                              />
                            </label>
                            {item.type === "hl" ? (
                              <label
                                className="selectLabel"
                                htmlFor={item.uuid}
                                style={{ cursor: "pointer" }}
                              >
                                Upload Thumbnail
                                <input
                                  type="file"
                                  id={item.uuid}
                                  onWheel={(e) => e.target.blur()}
                                  name="sort_order"
                                  className="numberInput"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    const previousFile = e.target.files[0];
                                    const newFile = new File(
                                      [previousFile],
                                      item.uuid + ".png"
                                    );
                                    setImage((prev) => [
                                      ...(prev || []),
                                      newFile,
                                    ]);
                                    setdata((prev) => ({
                                      ...prev,
                                      response: prev.response.map((a) =>
                                        a.uuid === item.uuid
                                          ? {
                                              ...a,
                                              img_url: item.uuid + ".png",
                                            }
                                          : a
                                      ),
                                    }));
                                  }}
                                  accept="image/png"
                                />
                                <UploadFile />
                              </label>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                        <div
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() =>
                            setdata((prev) => ({
                              ...prev,
                              response: (prev?.response || []).filter(
                                (a) => a.uuid !== item.uuid
                              ),
                            }))
                          }
                        >
                          <Delete />
                        </div>
                      </div>
                    ))
                  : ""}
                <button
                  type="button"
                  className="submit flex"
                  style={{ padding: 0, fontSize: "small" }}
                  onClick={() =>
                    setdata((prev) => ({
                      ...prev,
                      response: [
                        ...(prev.response || []),
                        { uuid: uuid(), type: "img" },
                      ],
                    }))
                  }
                >
                  <Add /> Add Response
                </button>
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
