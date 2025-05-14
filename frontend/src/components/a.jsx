// AdminPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Check, FileText, Flag } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const A = () => {
  const [posts, setPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState({});
  const [editedPostData, setEditedPostData] = useState({});
  const [showMoreMap, setShowMoreMap] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchReportedPosts();
    fetchDeletedPosts();
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const filteredPosts = posts
    .filter(post => !post.isDeleted)
    .filter(post => post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts');
      setPosts(res.data);
    } catch (err) {
      toast.error('Error fetching posts');
    }
  };

  const fetchReportedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts/reported');
      setReportedPosts(res.data);
    } catch (err) {
      toast.error('Error fetching reported posts');
    }
  };

  const fetchDeletedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts/deleted');
      setDeletedPosts(res.data);
    } catch (err) {
      toast.error('Error fetching deleted posts');
    }
  };

  const handleRestore = async (postId) => {
    console.log('Restoring post with ID: ', postId); // Log the postId to verify
    if (window.confirm('Restore this post?')) {
      try {
        const res = await axios.patch(`http://localhost:3001/api/posts/${postId}/restore`);
        if (res.status === 404) {
          toast.error('Post not found');
          return;
        }
        setDeletedPosts(deletedPosts.filter(post => post._id !== postId));
        setPosts(prev => [...prev, res.data]);
        toast.success('Post restored successfully');
      } catch (err) {
        toast.error('Error restoring post');
      }
    }
  };

  const handleSoftDelete = async (postId) => {
    if (window.confirm('Are you sure you want to soft delete this post?')) {
      try {
        await axios.patch(`http://localhost:3001/api/posts/${postId}/softdelete`);
        setPosts(posts.filter(post => post._id !== postId));
        setReportedPosts(reportedPosts.filter(post => post._id !== postId));
        toast.info('Post deleted');
      } catch (err) {
        toast.error('Error soft deleting post');
      }
    }
  };

  const handleEditToggle = (post) => {
    setEditMode(prev => ({ ...prev, [post._id]: !prev[post._id] }));
    setEditedPostData(prev => ({
      ...prev,
      [post._id]: { title: post.title, description: post.description },
    }));
  };

  const handleEditChange = (postId, field, value) => {
    setEditedPostData(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value,
      },
    }));
  };

  const handleEditSave = async (postId) => {
    try {
      const updatedData = editedPostData[postId];
      const res = await axios.put(`http://localhost:3001/api/posts/${postId}`, updatedData);
      setPosts(posts.map(post => post._id === postId ? res.data : post));
      setReportedPosts(reportedPosts.map(post => post._id === postId ? res.data : post));
      setEditMode(prev => ({ ...prev, [postId]: false }));
      toast.success('Post updated successfully');
    } catch (err) {
      toast.error('Error updating post');
    }
  };

  const toggleShowMore = (postId) => {
    setShowMoreMap(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const renderPostCard = (post, isReported = false) => (
    <div key={post._id} className={`p-6 rounded-lg shadow-md ${isReported ? 'bg-red-50 border border-red-300' : 'bg-white dark:bg-gray-800'}`}>
      <div className="mb-3">
        <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{post.author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
      </div>

      {editMode[post._id] ? (
        <>
          <input
            type="text"
            value={editedPostData[post._id]?.title || ''}
            onChange={(e) => handleEditChange(post._id, 'title', e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <textarea
            value={editedPostData[post._id]?.description || ''}
            onChange={(e) => handleEditChange(post._id, 'description', e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            rows={3}
          />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{post.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {post.description.length > 200 ? (
              showMoreMap[post._id] ? (
                <>
                  {post.description}{' '}
                  <button
                    onClick={() => toggleShowMore(post._id)}
                    className="text-blue-600 hover:underline text-sm dark:text-blue-400"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {post.description.slice(0, 200)}...{' '}
                  <button
                    onClick={() => toggleShowMore(post._id)}
                    className="text-blue-600 hover:underline text-sm dark:text-blue-400"
                  >
                    Show more
                  </button>
                </>
              )
            ) : (
              post.description
            )}
          </p>
        </>
      )}

      {post.media && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(post.media) && (
        <img
          src={`http://localhost:3001/${post.media}`}
          alt="Post"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex gap-2 mt-4">
        {editMode[post._id] ? (
          <button onClick={() => handleEditSave(post._id)} title="Save" className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
            <Check size={18} />
          </button>
        ) : (
          <button onClick={() => handleEditToggle(post)} title="Edit" className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
            <Pencil size={18} />
          </button>
        )}
        <button onClick={() => handleSoftDelete(post._id)} title="Delete" className="p-2 bg-red-600 text-white rounded-full hover:bg-blue-700">
          <Trash2 size={18} />
        </button>
      </div>

      {isReported && post.reports?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-3 rounded border mt-4">
          <h4 className="text-md font-semibold text-red-700 dark:text-red-400 mb-2">Reports:</h4>
          {post.reports.map((report, index) => (
            <div key={index} className="border-t py-2">
              <p className="text-sm dark:text-gray-300"><strong>Reporter:</strong> {report.reporterName}</p>
              <p className="text-sm dark:text-gray-300"><strong>Reason:</strong> {report.reason}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(report.reportedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} px-4 py-10 pt-32`}>
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-300">Welcome, Admin</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-300 dark:text-gray-900 dark:hover:bg-blue-400"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white border dark:bg-gray-800 dark:border-gray-600'} transition-all duration-300 hover:shadow-md`} onClick={() => setActiveTab('all')}>
            <FileText size={18} /> All Posts
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'reported' ? 'bg-yellow-500 text-white' : 'bg-white border dark:bg-gray-800 dark:border-gray-600'} transition-all duration-300 hover:shadow-md`} onClick={() => setActiveTab('reported')}>
            <Flag size={18} /> Reported Posts
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'restored' ? 'bg-green-500 text-white' : 'bg-white border dark:bg-gray-800 dark:border-gray-600'} transition-all duration-300 hover:shadow-md`} onClick={() => setActiveTab('restored')}>
            <Flag size={18} /> Restored Posts
          </button>
        </div>

        {activeTab === 'all' && (
          <>
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="space-y-6">
              {filteredPosts.map((post) => renderPostCard(post))}
            </div>
          </>
        )}

        {activeTab === 'reported' && (
          <>
            <input
              type="text"
              placeholder="Search reported posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="space-y-6">
              {reportedPosts
                .filter(post => !post.isDeleted)
                .filter(post => post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((post) => renderPostCard(post, true))}
            </div>
          </>
        )}

        {activeTab === 'restored' && (
          <>
            <input
              type="text"
              placeholder="Search restored posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="space-y-6">
              {deletedPosts
                .filter(post => post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((post) => (
                  <div key={post._id} className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{post.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Author: {post.authorName}</p>
                    <p className="mb-2 text-gray-800 dark:text-gray-300">{post.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                    <div className="mt-3">
                      <button
                        onClick={() => handleRestore(post._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default A;
