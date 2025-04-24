import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";

import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
 
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />

      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
