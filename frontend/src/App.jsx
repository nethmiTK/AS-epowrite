import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Header from "./components/Header"; // Import Header

import "./index.css";

function App() {
  const location = useLocation();

  // Define routes where the header should be shown
  const headerRoutes = ["/home", "/dashboard"];

  return (
    <div className="App">
      {/* Conditionally render Header for specific routes */}
      {headerRoutes.includes(location.pathname) && <Header />}

      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
