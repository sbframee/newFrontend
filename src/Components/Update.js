import React, { useEffect, useState } from "react";
import axios from "axios";

const Update = ({ onSave, onClose, item }) => {
  const [errMessage, setErrorMessage] = useState("");
  const [name, setName] = useState(item.name || "");
  const [mobile, setMobile] = useState(item.mobile || "");
  const [cname, setCname] = useState([]);
  const [category, setCategory] = useState([]);
  const [data, setData] = useState({ category: item.category || "", name: item.cname || "" });

  useEffect(() => {
    fetchCategory();
    fetchName();
  }, [item]);

  const fetchCategory = () => {
    axios
      .get("http://localhost:9000/actions/getCategory")
      .then((response) => setCategory(response.data))
      .catch((error) => console.error(error));
  };

  const fetchName = () => {
    axios
      .get("http://localhost:9000/actions/getName")
      .then((response) => setCname(response.data))
      .catch((error) => console.error(error));
  };

  const onCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setData((prevState) => ({
      ...prevState,
      category: selectedCategory,
    }));
  };

  const onNameChange = (event) => {
    const selectedName = event.target.value;
    setData((prevState) => ({
      ...prevState,
      name: selectedName,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:9000/orders/orders/putOrders/${item.order_id}`,
        {
          category: data.category,
          cname: data.name,
        }
      );

      if (response.data.success) {
        const updatedOrder = { ...item, category: data.category, cname: data.name };
        onSave(updatedOrder);
        onClose();
      } else {
        setErrorMessage("Failed to update order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay" style={{ zIndex: 9999999 }}>
      <div className="modal" style={{ height: "fit-content", width: "fit-content" }}>
        <div className="content" style={{
            height: "fit-content",
            padding: "20px",
            width: "fit-content",
          }}>
            <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
          
          <div className="row">
            <h2>Update</h2>
          </div>
          <div>
              <div>
                <label className="selectLabel">
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label className="selectLabel">
                  Mobile Number
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </label>
              </div>

              <div className="row">
                <label className="selectLabel" style={{ width: "100%" }}>
                  Select category
                  <select
                    id="category"
                    value={data.category}
                    onChange={onCategoryChange}
                  >
                    <option value="">Select</option>
                    {category.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="row">
                <label className="selectLabel" style={{ width: "100%" }}>
                  Select name
                  <select
                    id="name"
                    value={data.name}
                    onChange={onNameChange}
                  >
                    <option value="">Select</option>
                    {cname.map((caseName) => (
                      <option key={caseName} value={caseName}>
                        {caseName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {errMessage && <p>{errMessage}</p>}

              <div className="bottomContent" style={{ padding: "20px" }}>
                <button
                  type="submit"
                  onClick={(e) => {
                    submitHandler(e);
                    onClose();
                  }}
                >
                  Update
                </button>
              </div>
              <button onClick={onClose} className="closeButton">
                x
              </button>
          </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
