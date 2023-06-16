import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const AddCustomer = ({ onSave, popupInfo, name }) => {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        customer_gender: '',
        customer_name: '',
        address: '',
        customer_mobile: '',
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.customer_name) {
      setErrorMessage('Please insert User Title');
      return;
    }

    try {
      let response;

      if (popupInfo?.type === 'edit') {
        response = await axios.put('http://localhost:9000/customers/putCustomers', [formData], {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await axios.post('http://localhost:9000/customers/postCustomer', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.data.success) {
        onSave(response.data.result, 1);
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
                <h1>{popupInfo?.type === 'edit' ? 'Edit' : 'Add'} {name}</h1>
              </div>

              <div className="formGroup">
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                    Name
                    <input
                      type="text"
                      name="customer_name"
                      className="numberInput"
                      value={formData?.customer_name || ''}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                  </label>
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Mobile Number
                    <input
                      type="number"
                      name="customer_mobile"
                      className="numberInput"
                      value={formData?.customer_mobile || ''}
                      onChange={(e) => setFormData({ ...formData, customer_mobile: e.target.value })}
                    />
                  </label>
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                    Gender
                    <select
                      name="customer_gender"
                      className="numberInput"
                      value={formData?.customer_gender || ''}
                      onChange={(e) => setFormData({ ...formData, customer_gender: e.target.value })}
                    >
                      <option value="">None</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </label>
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                    Date Of Birth
                    <input
                      type="date"
                      name="dob"
                      className="numberInput"
                      value={formData?.dob || ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </label>
                </div>
                <div className="row" style={{width:"100%"}}>
                  <label className="selectLabel" style={{width:"100%"}}>
                    Address
                    <input
                      type="text"
                      name="address"
                      className="numberInput"
                      value={formData?.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </label>
                </div>
              </div>
              <i style={{ color: 'red' }}>
                {errMessage === '' ? '' : 'Error: ' + errMessage}
              </i>
              <button type="submit" className="submit">Save</button>
            </form>
          </div>
          <button onClick={onSave} className="closeButton">x</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
