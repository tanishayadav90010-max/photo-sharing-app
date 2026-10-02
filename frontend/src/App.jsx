import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Feed from "./components/Feed.jsx";
import CreatePost from "./components/CreatePost.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
