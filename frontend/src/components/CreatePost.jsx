import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Ask our backend for a signed upload token
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();
      if (!authRes.ok) {
        throw new Error(auth.message || "Could not get upload permission");
      }

      // 2. Upload the image straight to ImageKit
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", auth.publicKey);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        { method: "POST", body: formData }
      );
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploaded.message || "Image upload failed");
      }

      // 3. Save the ImageKit URL + caption in MongoDB (through Express)
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploaded.url, caption }),
      });
      if (!postRes.ok) {
        const data = await postRes.json();
        throw new Error(data.message || "Could not save post");
      }

      // 4. Show the feed
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Create Post</h2>

      <label className="field">
        <span>Photo</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {preview && <img className="preview" src={preview} alt="Selected preview" />}

      <label className="field">
        <span>Caption</span>
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={300}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}

export default CreatePost;
