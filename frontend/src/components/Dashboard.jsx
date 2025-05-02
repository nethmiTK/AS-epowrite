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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(null);

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
      setIsModalOpen(false); // Close the modal after submit
    } catch (err) {
      console.error('Error posting:', err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setPreview(`http://localhost:3001/${post.media}`);
    setSelectedPostId(post._id);
    setMedia(null);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
      setSelectedPostId(null);
      setShowOptions(null); // Close options after delete
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleOptionsToggle = (postId) => {
    setShowOptions(prev => (prev === postId ? null : postId));
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

        {/* Modal for editing a post */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity- flex justify-center items-center z-20 transition-opacity duration-300 opacity-92">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-300 translate-y-0 opacity-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
              >
                X
              </button>
              <h3 className="text-xl font-semibold mb-4">Edit Post</h3>

              {/* Image preview with the option to remove it */}
              {preview && (
                <div className="mb-4">
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg mb-2" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-500 mt-2"
                  >
                    Remove Image
                  </button>
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
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  rows="6" // Increased height for the description
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} // Back button to close the modal
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
                <p className="font-semibold text-lg text-gray-800">{post.author}</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionsToggle(post._id);
                  }}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  ...
                </button>
                {showOptions === post._id && (
                  <div className="absolute top-10 right-4 bg-white border shadow-lg rounded-lg">
                    <button
                      onClick={() => handleEdit(post)}
                      className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

                            {/* Post content */}
                            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>
              {post.media && isImage(post.media) && (
                <img
                  src={`http://localhost:3001/${post.media}`}
                  alt="Post"
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}

              {/* Actions */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <button onClick={() => handleLike(post._id)} className="hover:text-blue-600">
                  {userLikes.has(post._id) ? '💙' : '🤍'} Like ({post.likes.length})
                </button>
                <button onClick={() => handleShowComments(post._id)} className="hover:text-blue-600">
                  💬 Comments ({post.comments.length})
                </button>
                <button onClick={() => handleShare(post._id)} className="hover:text-blue-600">
                  🔗 Share
                </button>
              </div>

              {/* Comments section */}
              {showComments === post._id && (
                <div className="mt-4">
                  <div className="space-y-2">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded">
                        <strong>{comment.user}:</strong> {comment.comment}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-grow p-2 border rounded mr-2"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Post
                    </button>
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

