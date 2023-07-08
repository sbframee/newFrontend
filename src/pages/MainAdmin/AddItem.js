import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddItem = ({ onSave, popupInfo }) => {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState('');
  const [group, setGroup] = useState([]);
  const [imageFile, setImageFile] = useState(null); 

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    axios
      .get('http://localhost:9000/groups/GetItem_GroupList')
      .then((response) => setGroup(response.data.result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (popupInfo?.type === 'edit') {
      setFormData({ ...popupInfo?.data });
    } else {
      setFormData({
        item_group: '',
        item_price: '', // Initialize the price field
      });
    }
  }, [popupInfo?.data, popupInfo?.type]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formDataWithImage = new FormData(); // Create a new FormData instance
      formDataWithImage.append('image', imageFile); // Append the image file to the FormData
      formDataWithImage.append('item_group', formData.item_group);
      formDataWithImage.append('item_name', formData.item_name);
      formDataWithImage.append('price', formData.item_price);

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
          'http://localhost:9000/items/postItem',
          formDataWithImage, 
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
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
                <h1>{popupInfo?.type === 'edit' ? 'Edit' : 'Add'} Item</h1>
              </div>

              <div className="formGroup">
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Name
                    <input
                      type="text"
                      name="item_name"
                      className="numberInput"
                      value={formData?.item_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, item_name: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Select Group:
                    <select
                      id="item_group"
                      value={formData?.item_group || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, item_group: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {group &&
                        group.length > 0 &&
                        group.map((item) => (
                          <option key={item.item_group} value={item.item_group}>
                            {item.item_group}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Price:
                    <input
                      type="text"
                      name="item_price"
                      className="numberInput"
                      value={formData?.item_price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, item_price: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row" style={{ width: '100%' }}>
                  <label className="selectLabel" style={{ width: '100%' }}>
                    Image:
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <i style={{ color: 'red' }}>
                {errMessage === '' ? '' : 'Error: ' + errMessage}
              </i>
              <button type="submit" className="submit">
                {popupInfo?.type === 'edit' ? 'Update' : 'Save'}
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

export default AddItem;
