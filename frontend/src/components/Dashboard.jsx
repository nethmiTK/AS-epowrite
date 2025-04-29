import React, { useState } from 'react';
import { MdPostAdd } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [media, setMedia] = useState(null); // For storing media
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    if (media) {
      formData.append('media', media);
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
      setAuthor('');
      setMedia(null);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          <MdPostAdd /> Create New Post
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
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => setMedia(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
              />
              <FiImage className="text-xl text-gray-600" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {editMode ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
