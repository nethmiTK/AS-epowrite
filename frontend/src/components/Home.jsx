import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportedPosts, setReportedPosts] = useState({});

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch posts
      const resPosts = await axios.get('http://localhost:3001/api/posts');
      // Filter out posts that are marked as deleted
      const activePosts = resPosts.data.filter(post => !post.isDeleted);
      setPosts(activePosts);

      // Fetch profile if token exists
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
}, []);  // The empty dependency array ensures this effect runs only once when the component mounts

  const isImage = (filename) => /.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (postId) => {
    if (!profile) return toast.warn('You must be logged in to like posts');
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/${postId}/like`, {
        userId: profile.fullName
      });

      setPosts(posts.map(post => post._id === postId ? res.data : post));
      setUserLikes(prev => {
        const newLikes = new Set(prev);
        newLikes.has(postId) ? newLikes.delete(postId) : newLikes.add(postId);
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
      toast.success('Comment added!');
    } catch (err) {
      console.error('Error commenting on post:', err);
      toast.error('Failed to add comment');
    }
  };

  const handleShowComments = (postId) => {
    setShowComments(prev => prev === postId ? null : postId);
  };

  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => toast.info('Post link copied to clipboard!'))
      .catch(err => toast.error('Failed to copy link'));
  };

  const generateProfilePicture = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const toggleDescription = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleReportSubmit = async (postId) => {
    if (!reportReason) return toast.warn('Please select a reason');
    if (!profile) return toast.warn('You must be logged in to report posts');

    try {
      await axios.post(`http://localhost:3001/api/posts/${postId}/report`, {
        reportedBy: profile._id,
        reporterName: profile.fullName,
        reason: reportReason,
      });

      setReportedPosts(prev => ({ ...prev, [postId]: reportReason }));
      setShowReportModal(null);
      setReportReason('');
      toast.success('Post reported successfully!');
    } catch (err) {
      console.error('Error reporting post:', err);
      toast.error('Failed to report post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-10 px-4 sm:px-6 lg:px-8 text-gray-800">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm text-base sm:text-lg"
        />

        <div className="space-y-6">
          {filteredPosts.reverse().map((post) => {
            const isLiked = userLikes.has(post._id);
            const authorInitial = post.author ? post.author.charAt(0).toUpperCase() : 'U';

            return (
              <div key={post._id} className="bg-white p-5 sm:p-6 rounded-lg shadow-md relative">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {authorInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg text-gray-800">{post.authorName}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold mb-2">{post.title}</h2>

                <p className="text-gray-700 mb-2 text-justify text-sm sm:text-base" dangerouslySetInnerHTML={{
                  __html: expandedPosts.has(post._id)
                      ? post.description
                      : post.description.length > 150
                          ? `${post.description.slice(0, 150)}...`
                          : post.description
                }}></p>
                
                {post.description.length > 150 && (
                  <button
                    onClick={() => toggleDescription(post._id)}
                    className="text-blue-500 hover:underline text-sm sm:text-base mb-4"
                  >
                    {expandedPosts.has(post._id) ? 'Show Less' : 'Show More'}
                  </button>
                )}

                {post.media && isImage(post.media) && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`http://localhost:3001/${post.media}`}
                      alt="Post"
                      className="rounded-lg max-w-[300px] w-full h-auto"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`px-3 py-1 rounded-full text-sm ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    ❤️ {post.likes.length}
                  </button>
                  <button
                    onClick={() => handleShowComments(post._id)}
                    className="px-3 py-1 rounded-full text-sm bg-gray-200 hover:bg-gray-300"
                  >
                    💬 {post.comments.length}
                  </button>
                  <button
                    onClick={() => handleShare(post._id)}
                    className="px-3 py-1 rounded-full text-sm bg-gray-200 hover:bg-gray-300"
                  >
                    📤 Share
                  </button>
                  <button
                    onClick={() => setShowReportModal(post._id)}
                    className="px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    🚨 Report
                  </button>
                </div>

                {showComments === post._id && (
                  <div className="mt-4 space-y-4">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                          {generateProfilePicture(comment.user)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{comment.user}</div>
                          <p className="text-gray-700 text-sm">{comment.comment}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center mt-3 flex-wrap gap-2">
                      <input
                        type="text"
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        placeholder="Add a comment"
                        className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Show Reported Card */}
                {reportedPosts[post._id] && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
                    ⚠️ You reported this post for: <strong>{reportedPosts[post._id]}</strong>
                  </div>
                )}

                {/* Report Modal */}
                {showReportModal === post._id && (
                  <div className="fixed inset-0 bg-purple bg-opacity-50 flex justify-center items-center z-50 animate-fade-in style={{ opacity: isVisible ? 0.5 : 0 }}">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
                      <h3 className="text-lg font-semibold mb-4">Report Post</h3>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                      >
                        <option value="">Select a reason</option>
                        <option value="Spam">Spam</option>
                        <option value="Harassment">Harassment</option>
                        <option value="False Information">False Information</option>
                        <option value="Hate Speech">Hate Speech</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowReportModal(null)}
                          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReportSubmit(post._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Submit
                        </button>
                      </div>
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
