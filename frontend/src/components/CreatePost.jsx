import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePost = () => {
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
          <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 p-2 w-full border rounded-md shadow-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-2 p-2 w-full border rounded-md shadow-sm"
                rows="4"
              ></textarea>
            </div>

            {preview && (
              <div className="mb-4">
                <img src={preview} alt="Preview" className="max-w-full h-auto rounded-md" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-500 mt-2"
                >
                  Remove Image
                </button>
              </div>
            )}

            {!preview && (
              <div className="mb-4">
                <label htmlFor="media" className="block text-sm font-semibold text-gray-800">Upload Image</label>
                <input
                  type="file"
                  id="media"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mt-2"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {selectedPostId ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        )}
 

             

            
         
        </div>
      </div>
   
  );
};

export default CreatePost;
