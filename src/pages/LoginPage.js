import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userType = localStorage.getItem('user_type');
      if (userType === 'admin') {
        window.location.assign(`/admin`);
      } else if (userType === 'user') {
        window.location.assign(`/user`);
      }
    }
  }, []);

  const handleUsernameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the login request and get the user type
      const response = await axios.post('http://localhost:9000/users/loginUser', {
        name,
        password,
      });
      console.log(response.data); // Assuming the response contains a success message or user data

      // Store the user type and token in local storage
      const { userType, token } = response.data;
      localStorage.setItem('user_type', userType);     
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);

      if (userType === 'admin') {
        window.location.assign('/admin');
      } else if (userType === 'user') {
        window.location.assign('/user');
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={name} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
