import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("/forum/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (postId) => {
    await axios.post(`/forum/posts/${postId}/like`);
    fetchPosts();
  };

  const createPost = async (content) => {
    await axios.post("/forum/posts", { content });
    fetchPosts();
  };

  return (
    <ForumContext.Provider value={{ posts, likePost, createPost }}>
      {children}
    </ForumContext.Provider>
  );
};
