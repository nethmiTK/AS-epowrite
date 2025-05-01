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
  const [commentText, setCommentText] = useState(''); // Store the comment input text
  const [userLikes, setUserLikes] = useState(new Set()); // Track the posts that the user has liked
  const [showComments, setShowComments] = useState(null); // Track which post's comments are being displayed

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
        user: author,  // Ensure the correct username is saved with the comment
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
    setShowComments(prev => prev === postId ? null : postId);  // Toggle the visibility of comments
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert('Post link copied to clipboard!');
  };

  // Helper function to check if the file is an image or video
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
    setMedia(null);  // Remove media from form data when editing
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
        <div className="mb-4">
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
            className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
          >
            {showForm ? 'Cancel' : 'Create Post'}
          </button>
        </div>

        {notification && (
          <div className="mb-4 p-3 border border-green-600 text-green-600 rounded text-sm">
            {notification}
          </div>
        )}

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
              className="w-full p-2 border border-black rounded"
            />
            {preview && <img src={preview} alt="Preview" className="w-full mt-4" />}
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        )}

        <div className="w-full">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>

              <h3 className="text-3xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-lg text-gray-700 mb-4">{post.description}</p>

              {post.media && isImage(post.media) && (
                <img
                  src={`http://localhost:3001/${post.media}`}
                  alt="Post Media"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-6 text-gray-500">
                  <button
                    className={`flex items-center gap-2 ${userLikes.has(post._id) ? 'text-pink-500' : 'hover:text-pink-500'} transition`}
                    onClick={() => handleLike(post._id)}
                  >
                    👍 Like ({post.likes.length})
                  </button>
                  <button
                    className="flex items-center gap-2 hover:text-pink-500 transition"
                    onClick={() => handleShowComments(post._id)}
                  >
                    💬 Comment ({post.comments.length})
                  </button>
                  <button
                    className="flex items-center gap-2 hover:text-pink-500 transition"
                    onClick={() => handleShare(post._id)}
                  >
                    🔗 Share
                  </button>
                </div>

                {showComments === post._id && (
                  <div className="w-full mt-4">
                    <div className="flex flex-col gap-4">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded">
                          <p className="font-semibold">{comment.user}</p>
                          <p>{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        className="w-full p-2 border border-black rounded"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
