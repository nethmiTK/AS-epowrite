import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [author, setAuthor] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const quillRef = useRef();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const profileRes = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(profileRes.data.fullName);

        const postRes = await axios.get('http://localhost:3001/api/posts');
        setPosts(postRes.data.filter(post => post.author === profileRes.data.fullName));
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchProfileAndPosts();
  }, [author]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setMedia(null);
    setPreview(null);
  };

  const handleEditorChange = (value) => {
    setDescription(value);
  };

  const handleFocus = () => {
    const editor = quillRef.current.getEditor();
    const length = editor.getLength();  // Get the length of the current text
    editor.setSelection(length, length); // Move the cursor to the end
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove HTML tags from title and description
    const plainTitle = title.replace(/<[^>]+>/g, ''); // Remove all HTML tags from the title
    const plainDescription = description.replace(/<[^>]+>/g, ''); // Remove all HTML tags from the description

    const formData = new FormData();
    formData.append('title', plainTitle); // Use plain text title here
    formData.append('description', plainDescription); // Use plain text description here
    formData.append('author', author);
    if (media) formData.append('media', media);

    try {
      if (selectedPostId) {
        await axios.put(`http://localhost:3001/api/posts/${selectedPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Post updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Successfully posted!');
      }

      setTitle('');
      setDescription('');
      setMedia(null);
      setPreview(null);
      setSelectedPostId(null);

      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
    } catch (err) {
      toast.error('❌ Failed to post!');
      console.error('Error posting:', err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setPreview(`http://localhost:3001/${post.media}`);
    setSelectedPostId(post._id);
    setMedia(null);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      const updated = await axios.get('http://localhost:3001/api/posts');
      setPosts(updated.data.filter(post => post.author === author));
      setSelectedPostId(null);
      toast.info('🗑️ Post deleted!');
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('❌ Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6 pt-32 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 sm:p-8 rounded-lg shadow-lg mb-10 max-w-lg mx-auto"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {selectedPostId ? 'Edit Post' : 'Create a New Post'}
          </h2>

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 p-3 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
              Description
            </label>
            <ReactQuill
              id="description"
              value={description}
              onChange={handleEditorChange}
              className="mt-2 bg-white rounded-md shadow-sm"
              onFocus={handleFocus}  // Call handleFocus on focus
              theme="snow"
              placeholder="Write your post content here..."
              style={{ height: '200px', marginBottom: '50px' }}
              ref={quillRef}
            />
          </div>

          {preview && (
            <div className="mb-6 relative">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-md shadow-md" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <FaTrashAlt className="w-4 h-4" />
              </button>
            </div>
          )}

          {!preview && (
            <div className="mb-6">
              <label htmlFor="media" className="block text-sm font-semibold text-gray-800">
                Upload Image
              </label>
              <input
                type="file"
                id="media"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-2 p-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {selectedPostId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
