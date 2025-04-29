import React, { useState, useEffect } from 'react';
import { MdPostAdd } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');  // This will be set to logged-in user's name
  const [media, setMedia] = useState(null); // For storing media
  const [preview, setPreview] = useState(null); // To store the preview of the selected image
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [profile, setProfile] = useState(null); // Profile data for logged-in user
  const [posts, setPosts] = useState([]);  // To store the list of posts

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setAuthor(res.data.fullName);  // Set author to logged-in user's name
      } catch (err) {
        console.error('Error loading profile in dashboard:', err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/posts');
        setPosts(res.data);  // Set fetched posts
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };

    fetchProfile();
    fetchPosts();  // Fetch the posts when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    if (media) {
      formData.append('media', media);
    }

    // Include the profile picture URL with the post
    formData.append('profilePic', profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`);

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
      setAuthor('');
      setMedia(null);
      setPreview(null);  // Clear preview after submitting

      // Re-fetch posts after a successful submission
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  // Filter posts to display only the ones authored by the logged-in user
  const userPosts = posts.filter(post => post.author === author);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    // Generate a preview URL for the selected file
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result); // Set the preview of the image
      };
      fileReader.readAsDataURL(file); // Convert file to data URL for preview
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Profile Info */}
        {profile && (
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-pink-500 object-cover hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out"
              />
              <span className="text-lg font-medium text-gray-300">{profile.fullName}</span>
            </div>
          </div>
        )}

        {/* Post Form */}
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          <MdPostAdd /> {editMode ? 'Edit Post' : 'Create New Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="media" className="block text-sm font-medium text-gray-700">
              Upload Media <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                id="media"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
              />
              <FiImage className="text-xl text-gray-600" />
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mt-4">
              <img 
                src={preview} 
                alt="Preview"
                className="w-full h-auto rounded-lg border-2 border-gray-300 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {editMode ? 'Update Post' : 'Create Post'}
          </button>
        </form>

        {/* My Posts List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center text-blue-700 mb-4">My Posts</h3>
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={post.profilePic}
                      alt="Post Author"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-700">{post.author}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                  <p className="text-gray-600">{post.description}</p>
                  {post.media && (
                    <div className="mt-4">
                      <img src={`http://localhost:3001${post.media}`} alt="Post Media" className="w-full h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No posts yet. Start creating!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
