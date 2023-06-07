import React, { useEffect, useState } from "react";
import OrderList from "./OrderList";
import axios from "axios";
import "./style.css";
import Navbar from "./Navbar";

const Home = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const uniqueList = [
    ...new Set(
      items.map((curElem) => {
        return curElem.category;
      })
    ),
    "All",
  ];
  console.log(uniqueList);

  const getOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/orders/GetOrderList");
      if (response.data.success) {
        const orders = response.data.result;
        setItems(orders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/sign-in");
  };

  const filterItems = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;


  return (
    <>
      <Navbar filterItems={filterItems} orderList={uniqueList} />
      <OrderList items={filteredItems} />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;
