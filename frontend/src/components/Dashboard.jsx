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
  const [selectedPostId, setSelectedPostId] = useState(null);

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

  const handleEdit = (post) => {
    setShowForm(true);
    setTitle(post.title);
    setDescription(post.description);
    setPreview(`http://localhost:3001${post.media}`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
      setSelectedPostId(null);
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Profile Header */}

        {/* Create Post Button */}
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

        {/* Create Post Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="border border-black p-4 rounded space-y-4 mb-8 w-full"
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
              rows="6"
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
                className="mt-2 w-full max-h-96 object-contain border border-gray-400 rounded"
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

        {/* My Posts Section */}
        <div className="space-y-6 w-full">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="border border-black rounded p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
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

                  {/* Options menu (⋯) */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setSelectedPostId(selectedPostId === post._id ? null : post._id)
                      }
                      className="text-xl font-bold px-2 hover:bg-gray-100 rounded"
                    >
                      ⋯
                    </button>

                    {selectedPostId === post._id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-10">
                        <button
                          onClick={() => handleEdit(post)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-bold mb-1">{post.title}</h2>
                <p className="text-sm mb-3 whitespace-pre-wrap">{post.description}</p>
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
    </div>
  );
};

export default Dashboard;
