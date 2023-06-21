import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
        setIsLoading(false);
      } else if (userType === 'user') {
        window.location.assign('/user');
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-container"
    onKeyDown={(e) => (e.key === "Enter" ? loginHandler() : "")}>
      <div className="form">
      <h1>Login</h1>
      <div className="input-container">
        <label htmlFor="username" className="form-label">
          Username:
        </label>
          <input type="text" className="form-input"
            name="name"
            id="name"
            value={name} 
            onChange={handleUsernameChange}
            autoComplete="off"
            required />
        </div>
        <div className="input-container">
        <label htmlFor="password" className="form-label">
          Password:
        </label>
          <input type="password" 
          className="form-input"
          name="password"
          id="password"         
          value={password} 
          onChange={handlePasswordChange} 
          autoComplete="off"
            required
            />
        </div>
        {!isLoading ? (
          <button className="submit-btn" onClick={loginHandler}>
            Log In
          </button>
        ) : (
          <button className="submit-btn" id="loading-screen">
            <svg viewBox="0 0 100 100">
              <path
                d="M10 50A40 40 0 0 0 90 50A40 44.8 0 0 1 10 50"
                fill="#ffffff"
                stroke="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="1s"
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  values="0 50 51;360 50 51"
                ></animateTransform>
              </path>
            </svg>
          </button>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
