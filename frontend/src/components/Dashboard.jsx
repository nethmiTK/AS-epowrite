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
  const [commentText, setCommentText] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [showComments, setShowComments] = useState(null);

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
  }, [author]);

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
        user: author,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
    formData.append('description', description);
    formData.append('author', author);
    if (media) formData.append('media', media);

    try {
      if (selectedPostId) {
        await axios.put(`http://localhost:3001/api/posts/${selectedPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setNotification('✅ Post updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setNotification('✅ Successfully posted!');
      }

      setTitle('');
      setDescription('');
      setMedia(null);
      setPreview(null);
      setShowForm(false);
      setSelectedPostId(null);

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
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 sm:px-6 lg:px-8 pt-40">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setTitle('');
                setDescription('');
                setMedia(null);
                setPreview(null);
                setSelectedPostId(null);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Create Post'}
          </button>
        </div>

        {notification && (
          <div className="mb-4 p-3 bg-green-100 border border-green-600 text-green-600 rounded text-sm">
            {notification}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg space-y-4 w-full"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's on your mind?"
              required
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {preview && <img src={preview} alt="Preview" className="w-full mt-4 rounded-lg" />}
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Submit
            </button>
          </form>
        )}

        <div className="w-full mt-8 space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <p className="font-semibold text-lg text-gray-800">{post.author}</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-lg text-gray-700 mb-4">{post.description}</p>

              {post.media && isImage(post.media) && (
                <img
                  src={`http://localhost:3001/${post.media}`}
                  alt="Post Media"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-6 text-gray-500">
                  <button
                    className={`flex items-center gap-2 ${userLikes.has(post._id) ? 'text-pink-500' : 'hover:text-pink-500'} transition`}
                    onClick={() => handleLike(post._id)}
                  >
                    Like ({post.likes.length})
                  </button>
                  <button
                    className="flex items-center gap-2 hover:text-pink-500 transition"
                    onClick={() => handleShowComments(post._id)}
                  >
                    Comments ({post.comments.length})
                  </button>
                </div>
                <button
                  className="flex items-center gap-2 hover:text-pink-500 transition"
                  onClick={() => handleShare(post._id)}
                >
                  Share
                </button>
              </div>

              {showComments === post._id && (
                <div className="mt-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Comment
                  </button>
                  {post.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg mt-4">
                      <p className="font-semibold">{comment.user}</p>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  ))}
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
