import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCustomer = ({ onSave, popupInfo }) => {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    axios
    .get('http://localhost:9000/groups/GetCustomer_GroupList')  // Update the endpoint here
    .then((response) => setGroup(response.data.result))
    .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        group: '',
        customer_name: '',
        customer_mobiule: '',
        dob: '',
        address: '',
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.customer_name) {
      setErrorMessage('Please insert Customer name');
      return;
    }

    try {
      let response;

      if (popupInfo?.type === 'edit') {
        response = await axios.put(
          'http://localhost:9000/items/putItems',
          [formData],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
     
       response = await axios.post(
        'http://localhost:9000/customers/postCustomer',
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
    <div className="overlay" style={{ zIndex: 9999999 }}>
      <div className="modal" style={{ height: 'fit-content', width: 'fit-content' }}>
        <div
          className="content"
          style={{
            height: 'fit-content',
            padding: '20px',
            width: 'fit-content',
          }}
        >
          <div style={{ overflowY: 'scroll' }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row">
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} Customer</h1>
              </div>

              <div className="formGroup">
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Name
                    <input
                      type="text"
                      name="customer_name"
                      className="numberInput"
                      value={formData?.customer_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Mobile Number
                    <input
                      type="number"
                      name="customer_mobile"
                      className="numberInput"
                      value={formData?.customer_mobile || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_mobile: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Select Group:
                    <select
                      id="group"
                      value={formData?.group || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, group: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {group && group.length > 0 &&
                        group.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.customer_group}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Date Of Birth
                    <input
                      type="date"
                      name="dob"
                      className="numberInput"
                      value={formData?.dob || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Address
                    <input
                      type="text"
                      name="address"
                      className="numberInput"
                      value={formData?.address || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
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
};

export default AddCustomer;
