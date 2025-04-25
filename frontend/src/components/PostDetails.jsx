import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError(true);
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <div className="p-6 text-center text-red-500">Post not found.</div>;
  if (!post) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">
        By {post.author} | {new Date(post.date).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed">{post.description}</p>
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PostDetails;
