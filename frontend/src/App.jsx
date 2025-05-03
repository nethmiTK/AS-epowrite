import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";
import Profile from "./components/Profile";

import Header from "./components/Header";
import HamburgerMenu from "./components/HamburgerMenu";
import A from './components/a'; // Adjust the path as needed
import CreatePost from "./components/CreatePost";

import "./index.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Hide header and hamburger on these routes
  const hideHeaderRoutes = ["/", "/register", "/a"];
  const isHeaderHidden = hideHeaderRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (!isHeaderHidden) navigate("/");
          return;
        }

        const res = await axios.get("http://localhost:3001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
        setUser(null);
        if (!isHeaderHidden) navigate("/");
      }
    };

    fetchProfile();
  }, [location.pathname, isHeaderHidden, navigate]);

  return (
    <div className="App">
      {!isHeaderHidden && <Header />}
      {!isHeaderHidden && <HamburgerMenu user={user} />}

      <div className="content-wrapper transition-all duration-300 px-4 pt-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/a" element={<A />} />
          <Route path="/create-post" element={<CreatePost />} />

          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
