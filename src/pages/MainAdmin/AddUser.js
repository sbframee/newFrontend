import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCustomer = ({ onSave, popupInfo }) => {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');
  const [group, setGroup] = useState([]);
  const [role, setRole] = useState([]);

  useEffect(() => {
    fetchGroup();
    fetchRoll();
  }, []);

  const fetchGroup = async () => {
    axios
    .get('http://localhost:9000/groups/GetUser_GroupList')  // Update the endpoint here
    .then((response) => setGroup(response.data.result))
    .catch((error) => console.error(error));
  };

  const fetchRoll = async () => {
    axios
    .get('http://localhost:9000/groups/GetUserRoleList')  // Update the endpoint here
    .then((response) => setRole(response.data.result))
    .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        user_group: '',
        user_name: '',
        user_password: '',
        user_role: '',
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.user_name) {
      setErrorMessage('Please insert User name');
      return;
    }

    try {
      let response;

      if (popupInfo?.type === 'edit') {
        response = await axios.put(
          'http://localhost:9000/users/putUsers',
          [formData],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
     
       response = await axios.post(
        'http://localhost:9000/users/postUser',
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
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} User</h1>
              </div>

              <div className="formGroup">
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Name
                    <input
                      type="text"
                      name="user_name"
                      className="numberInput"
                      value={formData?.user_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, user_name: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Password
                    <input
                      type="password"
                      name="user_password"
                      className="numberInput"
                      value={formData?.user_password || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, user_password: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Select Group:
                    <select
                      id="user_group"
                      value={formData?.user_group || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, user_group: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {group && group.length > 0 &&
                        group.map((item) => (
                          <option key={item.user_group} value={item.user_group}>
                            {item.user_group}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Select Type:
                    <select
                      id="user_role"
                      value={formData?.user_role || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, user_role: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {role && role.length > 0 &&
                        role.map((item) => (
                          <option key={item.user_role} value={item.user_role}>
                            {item.user_role}
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
