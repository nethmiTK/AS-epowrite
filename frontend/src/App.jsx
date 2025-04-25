import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Header from "./components/Header";

import "./index.css";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/users/profile", { withCredentials: true })
      .then((res) => {
        console.log(res.data);  // Log the response data to verify user data
        setUser(res.data);  // Set the user state
      })
      .catch(() => setUser(null)); // If no user, set user to null
  }, []);

  const headerRoutes = ["/home", "/dashboard"];

  return (
    <div className="App">
      {headerRoutes.includes(location.pathname) && <Header user={user} />}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
