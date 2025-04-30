import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const profileRes = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(profileRes.data.fullName);

        const postRes = await axios.get('http://localhost:3001/api/posts');
        setPosts(postRes.data.filter(post => post.author === profileRes.data.fullName));
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchProfileAndPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    if (media) formData.append('media', media);

    try {
      await axios.post('http://localhost:3001/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNotification('✅ Successfully posted!');
      setTitle('');
      setDescription('');
      setMedia(null);
      setPreview(null);
      setShowForm(false);
      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error('Error posting:', err);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* My Profile Header */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-gray-700">{author}</p>
      </div>

      {/* Post Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
        >
          {showForm ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-4 p-3 border border-green-600 text-green-600 rounded text-sm">
          {notification}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-black p-4 rounded space-y-4 mb-8"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full p-2 border border-black rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows="5"
            className="w-full p-2 border border-black rounded"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-full max-h-80 object-contain border border-gray-400 rounded"
            />
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            Post
          </button>
        </form>
      )}

      {/* Posts Section */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="border border-black rounded p-4">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <h2 className="text-lg font-bold mb-1">{post.title}</h2>
              <p className="text-sm mb-3">{post.description}</p>
              {post.media && (
                <img
                  src={`http://localhost:3001${post.media}`}
                  alt="post"
                  className="w-full max-h-96 object-cover border border-gray-300 rounded"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
