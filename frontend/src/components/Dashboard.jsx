import React, { useState, useEffect, useCallback } from 'react';
import { MdPostAdd } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setAuthor(res.data.fullName);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    if (media) formData.append('media', media);
    if (profile?.pp) {
      formData.append(
        'profilePic',
        profile.pp.startsWith('http')
          ? profile.pp
          : `http://localhost:3001${profile.pp}`
      );
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:3001/api/posts/${editPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setEditMode(false);
      } else {
        await axios.post('http://localhost:3001/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setTitle('');
      setDescription('');
      setMedia(null);
      setPreview(null);
      await fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (post) => {
    setEditMode(true);
    setEditPostId(post._id);
    setTitle(post.title);
    setDescription(post.description);
    setPreview(`http://localhost:3001${post.media}`);
  };

  const userPosts = posts.filter((post) => post.author === author);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-300">
        {/* Profile Info */}
        {profile && (
          <div className="flex items-center gap-4 mb-8">
            <img
              src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-pink-500 object-cover hover:scale-110 transition-all"
            />
            <div>
              <span className="text-xl font-semibold text-gray-800">{profile.fullName}</span>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-center text-pink-500 mb-6 flex items-center justify-center gap-2">
          <MdPostAdd /> {editMode ? 'Edit Post' : 'Create Post'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="4"
            required
          />

          <label className="block text-sm font-medium text-gray-600">Upload Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <FiImage className="text-xl text-gray-700" />
          </div>

          {preview && (
            <div className="mt-6">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg border-2 border-gray-300"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-400 transition"
          >
            {editMode ? 'Update Post' : 'Create Post'}
          </button>
        </form>

        {/* My Posts */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-pink-500 text-center mb-6">My Posts</h3>
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 text-lg">{post.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{post.description}</p>

                  {post.media && (
                    <div className="mt-4">
                      <img
                        src={`http://localhost:3001${post.media}`}
                        alt="Post Media"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-pink-500 hover:text-pink-400"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
