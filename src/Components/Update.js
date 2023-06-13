import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const Update = ({ onSave, onClose, item }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errMessage, setErrorMessage] = useState("");
  const [cname, setCname] = useState([]);
  const [category, setCategory] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [data, setData] = useState({ category: item.category || "", name: item.cname || "" });

  useEffect(() => {
    fetchOrderDetails();
    fetchCategory();
    fetchName();
  }, [item]);

  const fetchOrderDetails = async () => {
    if (item) {
      try {
        const orderResponse = await axios.get(`http://localhost:9000/orders/GetOrderDetails/${item.order_id}`);
        const orderData = orderResponse.data.result;
        console.log("Order Data:", orderData);
        setSelectedOrder(orderData);
        console.log("Customer UUID:", orderData.customer_uuid);
  
        setData((prevState) => ({
          ...prevState,
          category: orderData.category,
          name: orderData.cname,
        }));
  
        // Fetch customer details based on customer_uuid
        try {
          const customerResponse = await axios.get(`http://localhost:9000/customers/getCustomerDetails/${orderData.customer_uuid}`);
          const customerData = customerResponse.data.result;
          console.log("Customer Data:", customerData);
          setCustomerDetails(customerData);
        } catch (error) {
          console.error(error);
          setCustomerDetails({});
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  
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
    try {
      const response = await axios.put(
        `http://localhost:9000/orders/putOrders/${item.order_id}`,
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
        <div
          className="content"
          style={{
            height: "fit-content",
            padding: "20px",
            width: "fit-content",
          }}
        >
          <div style={{ overflowY: "scroll" }}>
            <form className="form">
              <div className="row">
                <h2>Update</h2>
              </div>
              {customerDetails && customerDetails.customer_name && (
                <div className="formGroup">
                  <label className="selectLabel">
                    Name
                    <input type="text" value={customerDetails.customer_name} readOnly />
                  </label>
                </div>
              )}
              {customerDetails && customerDetails.customer_mobile && (
                <div className="formGroup">
                  <label className="selectLabel">
                    Mobile Number
                    <input type="text" value={customerDetails.customer_mobile} readOnly />
                  </label>
                </div>
              )}
              <div className="formGroup">
                <label className="selectLabel" style={{ width: "100%" }}>
                  Select category
                  <select id="category" value={data.category} onChange={onCategoryChange}>
                    <option value="">Select</option>
                    {category.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="formGroup">
                <label className="selectLabel" style={{ width: "100%" }}>
                  Select name
                  <select id="name" value={data.name} onChange={onNameChange}>
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
              
                <button
                  type="submit"
                  className="submit"
                  onClick={() => { submitHandler(); onClose(); }}
                >
                  Update
                </button>
              
              <button onClick={onClose} className="closeButton">
                x
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
