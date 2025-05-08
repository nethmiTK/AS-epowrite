// AdminPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Check, AlertTriangle, FileText, Flag } from 'lucide-react';

const A = () => {
  const [posts, setPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState({});
  const [editedPostData, setEditedPostData] = useState({});
  const [showMoreMap, setShowMoreMap] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // all, reported, alert

  useEffect(() => {
    fetchPosts();
    fetchReportedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchReportedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/posts/reported');
      setReportedPosts(res.data);
    } catch (err) {
      console.error('Error fetching reported posts:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3001/api/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
        setReportedPosts(reportedPosts.filter(post => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleEditToggle = (post) => {
    setEditMode((prev) => ({ ...prev, [post._id]: !prev[post._id] }));
    setEditedPostData((prev) => ({
      ...prev,
      [post._id]: { title: post.title, description: post.description },
    }));
  };

  const handleEditChange = (postId, field, value) => {
    setEditedPostData((prev) => ({
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
      setEditMode((prev) => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const toggleShowMore = (postId) => {
    setShowMoreMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alertPosts = reportedPosts.filter(post => post.reports.length > 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderPostCard = (post, isReported = false) => (
    <div key={post._id} className={`p-6 rounded-lg shadow-md ${isReported ? 'bg-red-50 border border-red-300' : 'bg-white'}`}>
      <div className="mb-3">
        <p className="font-semibold text-lg text-gray-800">{post.author}</p>
        <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
      </div>

      {editMode[post._id] ? (
        <>
          <input
            type="text"
            value={editedPostData[post._id]?.title || ''}
            onChange={(e) => handleEditChange(post._id, 'title', e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <textarea
            value={editedPostData[post._id]?.description || ''}
            onChange={(e) => handleEditChange(post._id, 'description', e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            rows={3}
          />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-2">
            {post.description.length > 200 ? (
              showMoreMap[post._id] ? (
                <>
                  {post.description}{' '}
                  <button
                    onClick={() => toggleShowMore(post._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {post.description.slice(0, 200)}...{' '}
                  <button
                    onClick={() => toggleShowMore(post._id)}
                    className="text-blue-600 hover:underline text-sm"
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
          className="w-full h-auto rounded-lg mb-4"
        />
      )}

      <div className="flex gap-2 mt-4">
        {editMode[post._id] ? (
          <button
            onClick={() => handleEditSave(post._id)}
            title="Save"
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            <Check size={18} />
          </button>
        ) : (
          <button
            onClick={() => handleEditToggle(post)}
            title="Edit"
            className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
          >
            <Pencil size={18} />
          </button>
        )}
        <button
          onClick={() => handleDelete(post._id)}
          title="Delete"
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Report Section */}
      {isReported && post.reports?.length > 0 && (
        <div className="bg-white p-3 rounded border mt-4">
          <h4 className="text-md font-semibold text-red-700 mb-2">Reports:</h4>
          {post.reports.map((report, index) => (
            <div key={index} className="border-t py-2">
              <p className="text-sm"><strong>Reporter:</strong> {report.reporterName}</p>
              <p className="text-sm"><strong>Reason:</strong> {report.reason}</p>
              <p className="text-xs text-gray-500">{formatDate(report.reportedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 pt-32 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Welcome, Admin</h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setActiveTab('all')}
          >
            <FileText size={18} /> All Posts
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'reported' ? 'bg-yellow-500 text-white' : 'bg-white border'}`}
            onClick={() => setActiveTab('reported')}
          >
            <Flag size={18} /> Reported Posts
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'alert' ? 'bg-red-600 text-white' : 'bg-white border'}`}
            onClick={() => setActiveTab('alert')}
          >
            <AlertTriangle size={18} /> Alert Posts
          </button>
        </div>

        {activeTab === 'all' && (
          <>
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm"
            />
            <div className="space-y-6">
              {filteredPosts.map((post) => renderPostCard(post))}
            </div>
          </>
        )}

        {activeTab === 'reported' && (
          <div className="space-y-6">
            {reportedPosts.map((post) => renderPostCard(post, true))}
          </div>
        )}

        {activeTab === 'alert' && (
          <div className="space-y-6">
            {alertPosts.map((post) => renderPostCard(post, true))}
          </div>
        )}
      </div>
    </div>
  );
};

export default A;
