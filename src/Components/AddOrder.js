import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
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

  const handleSubmit = async (e) => {
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
      setCategory('New Order');
    } catch (error) {
      console.error('Failed to add order', error);
    }
  };

  return (
    <div>
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Mobile:
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
        <br />
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="New Order">New Order</option>
            <option value="Designing">Designing</option>
            <option value="Printsk">Printsk</option>
            <option value="Printother">Printother</option>
            <option value="Binding">Binding</option>
            <option value="Fitting">Fitting</option>
            <option value="Ready">Ready</option>
            <option value="Holdsk">Holdsk</option>
            <option value="Customer">Customer</option>
          </select>
        </label>
        <br />
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;
