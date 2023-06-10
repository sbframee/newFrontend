import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";

const AddOrder = ({onSave, onClose}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('New Order');
  const [latestOrderId, setLatestOrderId] = useState(0);

  const fetchLatestOrderId = async () => {
    try {
      const response = await axios.get("http://localhost:9000/orders/GetOrderList");
      const orders = response.data.result;
      if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        const latestOrderId = latestOrder.order_id;
        setLatestOrderId(latestOrderId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestOrderId();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newOrderId = latestOrderId + 1;

    const orderData = {
      order_id: newOrderId,
      name,
      mobile,
      category
    };

    try {
      await axios.post('http://localhost:9000/orders/postOrder', orderData);
      console.log('Order added successfully');
      // Clear the form after successful submission
      setName('');
      setMobile('');
      onSave();
    } catch (error) {
      console.error('Failed to add order', error);
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
            <h2>Add Order</h2>
          </div> 
          <div className="formGroup">     
          <div className="row" style={{width:"100%"}}>   
        <label className="selectLabel">
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        </div>
        <div className="row" style={{width:"100%"}}>
        <label className="selectLabel">
          Mobile:
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
        </div>
        </div>
        <button type="submit" className="button">
              Add Order
          </button>
          </form>
          </div>
        <button onClick={onClose} className="closeButton">
                x
              </button>
      
      
      
    </div>
    </div>
    </div>
  );
};

export default AddOrder;
