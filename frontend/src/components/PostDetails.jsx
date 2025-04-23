// src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PostDetails = () => {
  const { id } = useParams(); // Get post ID from the route
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  // Fetch post by ID
  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to posts
      </button>

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author} | {new Date(post.date).toLocaleDateString()}
      </p>
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {post.description}
      </p>
    </div>
  );
};

export default PostDetails;
