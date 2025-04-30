import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">All Posts</h2>
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {filteredPosts.length === 0 ? (
          <p className="text-gray-600">No posts available.</p>
        ) : (
          <ul>
            {filteredPosts.map((post) => (
              <li key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  By {post.author} | {new Date(post.date).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-700">{post.description}</p>
                {post.media && (
                  <div className="mt-4">
                    <img
                      src={`http://localhost:3001${post.media}`}
                      alt="Post Media"
                      className="w-full h-auto rounded-lg shadow-md"
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
