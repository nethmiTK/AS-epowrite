import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPosts = await axios.get('http://localhost:3001/api/posts');
        setPosts(resPosts.data);

        const token = localStorage.getItem('token');
        if (token) {
          const resProfile = await axios.get('http://localhost:3001/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(resProfile.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const isImage = (filename) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // includes both date and time
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (postId) => {
    if (!profile) return alert('You must be logged in to like posts');
    try {
      const res = await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        { userId: profile.fullName }
      );

      setPosts(posts.map(post => post._id === postId ? res.data : post));
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

  const handleCommentChange = (postId, text) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/${postId}/comment`, {
        comment: text,
        user: profile.fullName,
      });
      setPosts(posts.map(post => post._id === postId ? res.data : post));
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error commenting on post:', err);
    }
  };

  const handleShowComments = (postId) => {
    setShowComments(prev => prev === postId ? null : postId);
  };

  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => alert('Post link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };

  const generateProfilePicture = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U'; // Default avatar as the first letter of the username
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 pt-40 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm"
        />

        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isLiked = userLikes.has(post._id);
            const authorInitial = post.author ? post.author.charAt(0).toUpperCase() : 'U';

            return (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {authorInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{post.author}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.description}</p>

                {post.media && isImage(post.media) && (
                  <img
                    src={`http://localhost:3001/${post.media}`}
                    alt="Post"
                    className="w-full h-auto rounded-lg mb-4"
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
                    className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    💬 {post.comments.length}
                  </button>
                  <button
                    onClick={() => handleShare(post._id)}
                    className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    📤 Share
                  </button>
                </div>

                {/* Comments */}
                {showComments === post._id && (
                  <div className="mt-4 space-y-4">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        {/* Profile Picture */}
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                          {generateProfilePicture(comment.user)}
                        </div>

                        {/* Commenter's Name and Comment */}
                        <div>
                          <div className="font-semibold text-sm">{comment.user}</div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center mt-4">
                      <input
                        type="text"
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        placeholder="Add a comment"
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
