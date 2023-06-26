import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSupplier = ({ onSave, popupInfo }) => {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    axios
    .get('http://localhost:9000/groups/GetSupplier_GroupList')  // Update the endpoint here
    .then((response) => setGroup(response.data.result))
    .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        supplier_group: '',
        supplier_name: '',
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.supplier_name) {
      setErrorMessage('Please insert Supplier name');
      return;
    }

    try {
      let response;

      if (popupInfo?.type === 'edit') {
        response = await axios.put(
          'http://localhost:9000/suppliers/putSuppliers',
          [formData],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
     
       response = await axios.post(
        'http://localhost:9000/suppliers/postSupplier',
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
                <h1>{popupInfo?.type === 'edit' ? "Edit" : "Add"} Supplier</h1>
              </div>

              <div className="formGroup">
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Name
                    <input
                      type="text"
                      name="supplier_name"
                      className="numberInput"
                      value={formData?.supplier_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier_name: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Select Group:
                    <select
                      id="supplier_group"
                      value={formData?.supplier_group || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier_group: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {group && group.length > 0 &&
                        group.map((item) => (
                          <option key={item.supplier_group} value={item.supplier_group}>
                            {item.supplier_group}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              </div>
              <i style={{ color: 'red' }}>
                {errMessage === '' ? '' : 'Error: ' + errMessage}
              </i>
              <button type="submit" className="submit">
                {popupInfo?.type === 'edit' ? "Update" : "Save"}
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

export default AddSupplier;
