import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    const { error } = await signOut();

    if (error) {
      console.error("Unable to log out:", error.message);
    }
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <span className="nav-logo" aria-hidden="true">
            🗃️
          </span>

          <div>
            <h1>The Archive Project</h1>
            <p>Community-driven media preservation</p>
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
            Browse
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link submit-link active"
                    : "nav-link submit-link"
                }
              >
                Create Post
              </NavLink>

              <span className="nav-user">
                {user.email}
              </span>

              <button
                type="button"
                className="nav-link logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Log In
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link submit-link active"
                    : "nav-link submit-link"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;