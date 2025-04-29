import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [media, setMedia] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from the backend when component mounts
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

  // Handle form submission to create a new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    if (media) {
      formData.append('media', media);
    }

    try {
      const res = await axios.post('http://localhost:3001/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([res.data, ...posts]);
      setTitle('');
      setDescription('');
      setAuthor('');
      setMedia(null);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-pink-700">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <textarea
            placeholder="Post Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="4"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="file"
            name="media"
            onChange={(e) => setMedia(e.target.files[0])}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-pink-500 hover:bg-pink-400 text-white rounded-lg"
          >
            Create Post
          </button>
        </form>
      </div>

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
                <p className="text-sm text-gray-500">By {post.author} | {new Date(post.date).toLocaleDateString()}</p>
                <p className="mt-2 text-gray-700">{post.description}</p>
                {post.media && (
                  <div className="mt-4">
                    <img
                      src={`http://localhost:3001${post.media}`} // Correct image URL
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
