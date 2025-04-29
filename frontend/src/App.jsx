import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";
import Profile from "./components/Profile"; // Make sure this route exists

import Header from "./components/Header";
import HamburgerMenu from "./components/HamburgerMenu";

import "./index.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const isPublicRoute = location.pathname === "/" || location.pathname === "/register";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (!isPublicRoute) navigate("/");
          return;
        }

        const res = await axios.get("http://localhost:3001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
        setUser(null);
        if (!isPublicRoute) navigate("/");
      }
    };

    fetchProfile();
  }, [location.pathname, isPublicRoute, navigate]);

  return (
    <div className="App">
      {!isPublicRoute && <Header />}
      {!isPublicRoute && <HamburgerMenu user={user} />}
      
      <div className={`content-wrapper transition-all duration-300 ${!isPublicRoute ? "ml-64" : ""} px-4 pt-6`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
