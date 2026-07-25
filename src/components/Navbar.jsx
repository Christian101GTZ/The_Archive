import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <span className="nav-logo" aria-hidden="true">
            🗃️
          </span>

          <div>
            <h1>The Archive Project</h1>
            <p>Preserving media, history, and culture</p>
          </div>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/submit"
            className={({ isActive }) =>
              isActive ? "nav-link submit-link active" : "nav-link submit-link"
            }
          >
            Submit Artifact
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;