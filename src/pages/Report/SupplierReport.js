import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.css";
import axios from "axios";

const SupplierReport = () => {
  const [itemsData, setItemsData] = useState([]);
  const [filterSuppliersData, setFilterSuppliersData] = useState([]);
  const [popupForm, setPopupForm] = useState(false);
  const [supplierList, setSupplierList] = useState([]); 
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const getItemsData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/suppliers/GetSupplierList");
      if (response.data.success) {
        const items = response.data.result;
        setItemsData(items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSupplierList = async () => {
    try {
      const response = await axios.get("http://localhost:9000/groups/GetSupplier_GroupList");
      if (response.data.success) {
        const items = response.data.result;
        setSupplierList(items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItemsData();
    getSupplierList();
  }, [popupForm]);

  useEffect(() => {
    const filteredItems = itemsData.filter(
      (item) => (!selectedSupplier || item.supplier_group === selectedSupplier)
    );
    setFilterSuppliersData(filteredItems);
  }, [itemsData, selectedSupplier]);
  
  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Supplier Report</h2>
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
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="searchInput"
            >
              <option value="">Select Suppliers Group</option>
              {supplierList.map((item) => (
                <option key={item.supplier_uuid} value={item.supplier_group}>
                  {item.supplier_group}
                </option>
              ))}
            </select>

          </div>
        </div>
        
        {selectedSupplier && filterSuppliersData.length > 0 ? (
          <div className="table-container-user item-sales-container">
            <Table itemsDetails={filterSuppliersData} setPopupForm={setPopupForm} />
          </div>
        ) : null}
      </div>
      
    </>
  );
};

export default SupplierReport;

function Table({ itemsDetails }) {
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
              <span>Supplier</span>
            </div>
          </th>
          <th colSpan={6}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails?.map((item, i) => (
          <tr key={item.supplier_uuid} style={{ height: "30px" }} onClick={() => {}}>
            <td>{i + 1}</td>
            <td colSpan={3}>{item.supplier_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
