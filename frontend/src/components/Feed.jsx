import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Could not load posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError("Could not load posts. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <p className="message">Loading posts...</p>;
  if (error) return <p className="message error-text">{error}</p>;

  if (posts.length === 0) {
    return (
      <div className="empty">
        <h2>No posts available</h2>
        <p>Be the first to share a photo.</p>
        <Link to="/create" className="button-link">
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <article className="card post" key={post._id}>
          <img src={post.image} alt={post.caption || "Shared photo"} />
          {post.caption && <p className="caption">{post.caption}</p>}
        </article>
      ))}
    </div>
  );
}

export default Feed;
