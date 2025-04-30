import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikes, setUserLikes] = useState(new Set()); // Track the posts that the user has liked
  const [commentText, setCommentText] = useState(''); // Store the comment input text
  const [showComments, setShowComments] = useState(null); // Track which post's comments are being displayed

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Header profile fetch error:', err);
      }
    };

    fetchPosts();
    fetchProfile();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (postId) => {
    if (!profile) return alert('You must be logged in to like posts');

    try {
      const res = await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        { userId: profile._id }  // Send the userId from the logged-in profile
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
        user: profile.username,  // Ensure the correct username is saved with the comment
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

  // Utility function to format date
  const formatDate = (date) => {
    const newDate = new Date(date); // Ensure it's a valid date object
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return newDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen px-0">
      <div className="w-full px-4 md:px-12 lg:px-24 mt-8">
        <h2 className="text-4xl font-semibold mb-6 text-gray-800 text-center">All Posts</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {filteredPosts.length === 0 ? (
          <p className="text-gray-600 text-center">No posts available.</p>
        ) : (
          <ul>
            {filteredPosts.map((post) => (
              <li key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-all">
                {/* Post Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={profile && profile.username === post.author
                      ? profile.profilePic
                        ? `http://localhost:3001/${profile.profilePic}`
                        : 'https://via.placeholder.com/50'
                      : 'https://via.placeholder.com/50'
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p> {/* Format date */}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-3xl font-semibold text-gray-900 mb-2 hover:text-pink-500 transition">{post.title}</h3>
                <p className="text-lg text-gray-700 mb-4 line-clamp-3">{post.description}</p>

                {/* Media */}
                {post.media && (
                  <div className="mt-4">
                    {post.media.includes('.jpg') || post.media.includes('.png') || post.media.includes('.jpeg') ? (
                      <img
                        src={`http://localhost:3001/${post.media}`}
                        alt="Post Media"
                        className="w-full h-auto rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      />
                    ) : (
                      <video controls className="w-full h-auto rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <source src={`http://localhost:3001/${post.media}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {/* Actions */}
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
                  <div className="text-gray-500">
                    {showComments === post._id && (
                      <div className="mt-4">
                        {post.comments.map((comment, index) => (
                          <div key={index} className="mb-4 p-4 border-b">
                            <p className="font-semibold text-gray-900">{comment.user}</p>
                            <p className="text-gray-600">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {showComments === post._id && (
                      <div className="mt-4">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment"
                          rows="3"
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        ></textarea>
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                        >
                          Post Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
