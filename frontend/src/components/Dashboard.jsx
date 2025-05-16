import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [preview, setPreview] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [notification, setNotification] = useState('');
  const [author, setAuthor] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [showComments, setShowComments] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const profileRes = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(profileRes.data.email); // Set author to email
        setAuthorName(profileRes.data.fullName || profileRes.data.name || profileRes.data.email); // Prefer full name

        const postRes = await axios.get('http://localhost:3001/api/posts');
        const sortedPosts = postRes.data
          .filter(post => post.author === profileRes.data.email)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchProfileAndPosts();
  }, [author]);

  const toggleExpanded = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('🗑 Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Error deleting post');
    }
  };

  const handleLike = async (postId) => {
    if (!author) return alert('You must be logged in to like posts');
    try {
      const res = await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        { userId: author }
      );
      setPosts(posts.map(post =>
        post._id === postId ? res.data : post
      ));

      setUserLikes(prev => {
        const newLikes = new Set(prev);
        if (newLikes.has(postId)) {
          newLikes.delete(postId);
        } else {
          newLikes.add(postId);
        }
        return newLikes;
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/${postId}/comment`, {
        comment: commentText,
        user: authorName,
      });
      setPosts(posts.map(post =>
        post._id === postId ? res.data : post
      ));
      setCommentText('');
    } catch (err) {
      console.error('Error commenting on the post:', err);
    }
  };

  const handleShowComments = (postId) => {
    setShowComments(prev => prev === postId ? null : postId);
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert('Post link copied to clipboard!');
  };

  const isImage = (url) => {
    return url.match(/\.(jpg|jpeg|png|gif)$/);
  };

  // Only allow one image to be selected at a time
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMedia([file]);
    const reader = new FileReader();
    reader.onloadend = () => setPreview([reader.result]);
    reader.readAsDataURL(file);
    toast.info('Image selected.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author); // Always use email
    media.forEach((file, idx) => formData.append('media', file));

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
      setMedia([]);
      setPreview([]);
      setShowForm(false);
      setSelectedPostId(null);

      const updated = await axios.get('http://localhost:3001/api/posts');
      const sorted = updated.data
        .filter(post => post.author === author)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sorted);
      setTimeout(() => setNotification(''), 3000);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error posting:', err);
      toast.error('Error updating/creating post');
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setPreview(post.media ? [`http://localhost:3001/${post.media}`] : []);
    setSelectedPostId(post._id);
    setMedia([]);
    setIsModalOpen(true);
  };

  const handleOptionsToggle = (postId) => {
    setShowOptions(prev => (prev === postId ? null : postId));
  };

  // Function to generate profile picture (first letter of author's email)
  const generateProfilePicture = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 sm:px-6 lg:px-8 pt-40">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

        {notification && (
          <div className="mb-4 p-3 bg-green-100 border border-green-600 text-green-600 rounded text-sm">
            {notification}
          </div>
        )}

        {/* Modal for editing a post */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 text-xl"
                aria-label="Close edit modal"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold mb-4">Edit Post</h3>

              {/* Image preview with remove icon */}
              {preview.length > 0 && (
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <img src={preview[0]} alt="Preview" className="h-32 w-32 object-cover rounded-lg border shadow" />
                    <button
                      type="button"
                      onClick={() => { setMedia([]); setPreview([]); toast.info('Image removed.'); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 text-xs flex items-center justify-center"
                      aria-label="Remove image"
                      style={{ transform: 'translate(50%, -50%)' }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  className="bg-white rounded-md h-40"
                  theme="snow"
                />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  accept="image/*"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 mt-4"
                >
                  Back
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Post list */}
        <div className="w-full mt-8 space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6 relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                  {generateProfilePicture(post.author)}
                </div>
                <p className="font-semibold text-lg text-gray-800">{post.authorName}</p> 
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}{post.isDeleted && (
                  <span className="text-red-500 font-semibold">(🚫 Reported and disabled🙅 Removed by admin .)</span>
                )}</p>
 
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionsToggle(post._id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  &#8226;&#8226;&#8226;
                </button>

                {/* Options */}
                {showOptions === post._id && (
                  <div className="absolute top-12 right-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-700 mt-2" dangerouslySetInnerHTML={{
                  __html: expandedPosts.has(post._id)
                      ? post.description
                      : post.description.length > 150
                          ? `${post.description.slice(0, 150)}...`
                          : post.description
              }}></p>

              {post.description.length > 150 && (
                <button
                  onClick={() => toggleExpanded(post._id)}
                  className="text-blue-600 hover:underline mt-1 text-sm"
                >
                  {expandedPosts.has(post._id) ? 'See Less' : 'See More'}
                </button>
              )}

              {/* Media preview */}
              {post.media && isImage(post.media) && (
                <img
                  src={`http://localhost:3001/${post.media}`}
                  alt="Post media"
                  className="mt-4 rounded-lg object-cover"
                  style={{ width: '450px', height: '400px' }}
                />
              )}

              <div className="mt-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`p-2 rounded-full ${
                    userLikes.has(post._id) ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  ❤️ {post.likes.length}
                </button>
                <button
                  onClick={() => handleShowComments(post._id)}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700"
                >
                  💬 {post.comments.length}
                </button>
                <button
                  onClick={() => handleShare(post._id)}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700"
                >
                  🔗 Share
                </button>
              </div>

              {showComments === post._id && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>

                  <div className="mt-4 space-y-4">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-base font-bold">
                          {comment.user ? comment.user.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{comment.user}</p>
                          <p className="text-gray-700 text-sm">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
