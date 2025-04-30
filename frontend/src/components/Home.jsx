import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/posts');
        setPosts(res.data); // Save posts in state
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl mt-8">
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
              <li key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6">
                {/* Post Title */}
                <h3 className="text-3xl font-semibold text-gray-900 mb-2 hover:text-pink-500 transition">
                  {post.title}
                </h3>
                
                {/* Post Author & Date */}
                <p className="text-sm text-gray-500 mb-4">
                  By {post.author} | {new Date(post.date).toLocaleDateString()}
                </p>
                
                {/* Post Description */}
                <p className="text-lg text-gray-700 mb-4">{post.description}</p>
                
                {/* Post Media */}
                {post.media && (
                  <div className="mt-4">
                    <img
                      src={`http://localhost:3001/${post.media}`} // Correct media path
                      alt="Post Media"
                      className="w-full h-auto rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
