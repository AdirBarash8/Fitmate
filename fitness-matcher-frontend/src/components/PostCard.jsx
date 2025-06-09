import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = async () => {
    try {
      await axios.post(`/forum/posts/${post._id}/like`);
      setLikes(likes + 1);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  return (
    <div className="border rounded p-4 shadow">
      <p className="text-lg">{post.content}</p>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
        <span>👍 {likes} Likes</span>
        <button onClick={handleLike} className="text-blue-500 hover:underline">
          Like
        </button>
      </div>
    </div>
  );
}

export default PostCard;
