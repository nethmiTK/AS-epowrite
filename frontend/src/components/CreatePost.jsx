import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [author, setAuthor] = useState('');
  const [authorname, setAuthorname] = useState('');

  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const profileRes = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(profileRes.data.email);
        setAuthorname(profileRes.data.fullName);

        const postRes = await axios.get('http://localhost:3001/api/posts');
        setPosts(postRes.data.filter(post => post.author === profileRes.data.fullName));
      } catch (err) {
        console.error('Error:', err);
        toast.error("Failed to load profile or posts.");
      }
    };
    fetchProfileAndPosts();
  }, [author]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }
    setMedia(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setMedia(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description); // Save description as HTML
    formData.append('author', author); // author is user's email
    formData.append('authorName', authorname); // authorname is user's full name
    if (media) formData.append('media', media);

    try {
      if (selectedPostId) {
        await axios.put(`http://localhost:3001/api/posts/${selectedPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Post updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Successfully posted!');
      }

      setTitle('');
      setDescription('');
      setMedia(null);
      setPreview(null);
      setSelectedPostId(null);

      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
    } catch (err) {
      console.error('Error posting:', err);
      toast.error("Something went wrong while posting.");
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setPreview(`http://localhost:3001/${post.media}`);
    setSelectedPostId(post._id);
    setMedia(null);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
      setSelectedPostId(null);
      toast.success("🗑 Post deleted.");
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 sm:px-6 lg:px-8 pt-40">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md mb-10 max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 p-2 w-full border rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 bg-blend-hard-light">Description</label>
            <ReactQuill
              id="description"
              value={description}
              onChange={setDescription}
              className="bg-white rounded-md h-64" // Increased height
              theme="snow"
            />
          </div>

          {preview && (
            <div className="mb-4 relative">
              <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-lg border shadow" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                aria-label="Remove image"
              >
                ❌
              </button>
            </div>
          )}

          {!preview && (
            <div className="mb-4">
              <label htmlFor="media" className="block text-sm font-semibold text-gray-800">Upload Image</label>
              <input
                type="file"
                id="media"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-2"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {selectedPostId ? 'Update Post' : 'Create Post'}
          </button>
        </form>

        {/* POSTS LIST (Optional for future UI development) */}
        {posts.map((post) => (
          <div key={post._id}>
            {/* Render post details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;