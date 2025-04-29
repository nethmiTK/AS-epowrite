import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiUser, FiMail } from "react-icons/fi";
import { MdPostAdd } from "react-icons/md";
import HamburgerMenu from '../components/HamburgerMenu';  // Import HamburgerMenu
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch user's profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);  // Set the user's profile
      } catch (err) {
        console.error('Error loading profile in home page:', err);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [navigate]);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = { title, description, author };
      if (editMode) {
        await axios.put(`http://localhost:3001/api/posts/${editPostId}`, newPost);
        setEditMode(false);
      } else {
        await axios.post("http://localhost:3001/api/posts", newPost);
      }
      setTitle("");
      setDescription("");
      setAuthor("");
      fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setAuthor(post.author);
    setEditMode(true);
    setEditPostId(post._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-md border-r">
        {/* Pass profile data to HamburgerMenu */}
        <HamburgerMenu user={profile} /> {/* Pass the profile as user */}
        
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdPostAdd /> New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded shadow"
          />
        </div>

        {/* User Greeting */}
        {profile && (
          <h2 className="text-xl font-semibold mb-4">Welcome, {profile.fullName}!</h2>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">📝 All Posts</h2>
          {filteredPosts.length === 0 ? (
            <p className="text-gray-600">No posts available.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPosts.map((post) => (
                <li key={post._id} className="bg-white p-4 rounded shadow border">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    By {post.author} | {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-700">
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                    {post.description.length > 100 && (
                      <Link
                        to={`/posts/${post._id}`}
                        className="text-blue-600 hover:underline ml-2"
                      >
                        Read More
                      </Link>
                    )}
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center gap-1 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
