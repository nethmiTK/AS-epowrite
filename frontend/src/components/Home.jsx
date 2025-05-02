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
                      <h2 className="text-lg font-semibold">{post.author}</h2>
                      <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
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

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <button onClick={() => handleLike(post._id)} className="hover:text-blue-600">
                    {isLiked ? '💙' : '🤍'} Like ({post.likes.length})
                  </button>
                  <button onClick={() => handleShowComments(post._id)} className="hover:text-blue-600">
                    💬 Comments ({post.comments.length})
                  </button>
                  <button onClick={() => handleShare(post._id)} className="hover:text-blue-600">
                    🔗 Share
                  </button>
                </div>

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
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
