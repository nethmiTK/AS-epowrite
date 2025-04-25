import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError(true);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchPost();
    fetchProfile();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-red-500 text-lg">
        Post not found.
      </div>
    );
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white text-lg">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-800 to-gray-900 text-white shadow-md flex justify-between items-center backdrop-blur-lg border-b border-white/10">
        <h1 className="text-2xl font-extrabold tracking-wide text-purple-200 drop-shadow-sm">✍️ EpoWrite</h1>

        {profile && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={
                  profile.pp.startsWith("http")
                    ? profile.pp
                    : `http://localhost:3001${profile.pp}`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover hover:scale-105 transition-transform duration-200"
              />
              <span className="text-sm font-medium text-purple-200">{profile.fullName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-700 transition duration-300 shadow-md"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </header>

      {/* Post Content */}
      <main className="max-w-3xl mx-auto p-6 mt-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">
          <h2 className="text-4xl font-bold text-purple-100 mb-3">{post.title}</h2>
          <p className="text-sm text-purple-300 mb-4">
            By <span className="font-semibold">{post.author}</span> |{" "}
            {new Date(post.date).toLocaleDateString()}
          </p>
          <p className="text-lg text-purple-100 leading-relaxed whitespace-pre-line">
            {post.description}
          </p>

          <div className="mt-6">
            <Link
              to="/home"
              className="inline-block text-purple-300 hover:text-purple-500 underline transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
