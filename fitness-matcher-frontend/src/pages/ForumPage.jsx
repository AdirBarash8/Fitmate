// pages/ForumPage.js
import { useEffect, useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/forum.css";

const ForumPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    if (user && !user.name) {
      axios.get(`/users/${user.user_id}`)
        .then(res => {
          setUser(prev => ({
            ...prev,
            name: res.data.name || "Anonymous"
          }));
        })
        .catch(err => {
          console.error("❌ Failed to fetch user name:", err);
        });
    }
  }, [user, setUser]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("/forum/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    }

    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      const res = await axios.post("/forum/posts", {
        user_id: user.user_id,
        content: newPost,
        authorName: user.name || "Anonymous"
      });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  const handleLike = async (id) => {
  try {
    const res = await axios.patch(`/forum/posts/${id}/like`);
    const updatedPost = res.data.post;

    setPosts(posts.map(p => p._id === id ? updatedPost : p));
  } catch (err) {
    console.error("Failed to like post:", err);
  }
};


  return (
    <div className="forum-page">
      <h2>💬 Community Forum</h2>

      <div className="new-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with the community..."
        />
        <button onClick={handleCreatePost}>Post</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post._id}>
            <p><strong>{post.authorName || "Anonymous"}:</strong> {post.content}</p>
            <button onClick={() => handleLike(post._id)}>
              {post.likes.includes(user?.user_id.toString()) ? "👎 Unlike" : "👍 Like"} ({post.likes.length})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
