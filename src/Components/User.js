import React, { useEffect, useState } from "react";

const Home = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    // Retrieve the username from wherever it is stored
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.assign("/sign-in")
  };

  return (
    <div>
      <h2>Welcome to the Home Page, {name}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
