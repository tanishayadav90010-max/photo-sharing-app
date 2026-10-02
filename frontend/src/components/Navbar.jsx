import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          PhotoShare
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>
            Feed
          </NavLink>
          <NavLink to="/create">Create Post</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
