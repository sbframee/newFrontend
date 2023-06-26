import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";

const LoginPage = () => {
  const [user_name, setName] = useState('');
  const [user_password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRoll = localStorage.getItem('user_roll');
      if (userRoll === 'admin') {
        window.location.assign(`/admin`);
      } else if (userRoll === 'user') {
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
        user_name,
        user_password,
      });
      console.log(response.data);

      const { userRoll, token } = response.data;
      localStorage.setItem('user_roll', userRoll);     
      localStorage.setItem('token', token);
      localStorage.setItem('username', user_name);

      if (userRoll === 'admin') {
        window.location.assign('/admin');
        setIsLoading(false);
      } else if (userRoll === 'user') {
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
            name="username"
            id="username"
            value={user_name} 
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
          name="user_password"
          id="user_password"         
          value={user_password} 
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
