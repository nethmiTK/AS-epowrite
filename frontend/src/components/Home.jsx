import React, { useState, useEffect } from "react";
import axios from "axios";
import HamburgerMenu from '../components/HamburgerMenu'; // Adjust the path as needed

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Filter posts based on the search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="flex-1 p-6 ml-64">
        {/* Hamburger Menu */}
        <HamburgerMenu toggleSidebar={toggleSidebar} />

        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">{editMode ? "Edit Post" : "Create a New Post"}</h1>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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
              rows="6"
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
              {editMode ? "Update Post" : "Create Post"}
            </button>
          </form>

          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Display Filtered Posts */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
            {filteredPosts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              <ul className="space-y-4">
                {filteredPosts.map((post) => (
                  <li key={post._id} className="border p-4 rounded">
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-500">By {post.author} | {new Date(post.date).toLocaleDateString()}</p>
                    <p>{post.description}</p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
