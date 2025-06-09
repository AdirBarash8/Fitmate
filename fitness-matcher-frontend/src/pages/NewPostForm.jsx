import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

function NewPostForm({ onPostCreated }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await axios.post('/forum/posts', { content });
      onPostCreated(res.data.post);
      setContent('');
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 border rounded"
        rows="3"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
}

export default NewPostForm;
