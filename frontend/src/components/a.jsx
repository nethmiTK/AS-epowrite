import React, { useState, useEffect } from 'react';
import axios from 'axios';

const A = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">📝 All Blog Posts</h1>

        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600">No posts found.</p>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.media && (
                  <img
                    src={`http://localhost:3001${post.media}`}
                    alt="Post"
                    className="w-full h-60 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-700 mt-2">{post.description}</p>

                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      src={
                        post.author?.pp?.startsWith('http')
                          ? post.author.pp
                          : `http://localhost:3001${post.author?.pp}`
                      }
                      alt="Author"
                      className="w-10 h-10 rounded-full border object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{post.author?.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default A;
