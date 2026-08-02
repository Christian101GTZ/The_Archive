/**
 * Navbar.jsx — Top navigation bar
 *
 * The bar shown on every page. It has the logo/title on the left and the links
 * on the right. The links change based on login state: logged-in users see
 * Create Post and Log Out, while visitors see Log In and Sign Up.
 */
// Link renders a plain navigation link; NavLink is like Link but knows when it
// points at the page you're currently on, so we can style the "active" tab.
import { Link, NavLink } from "react-router-dom";
// Custom hook that gives us the logged-in user and auth actions (see AuthContext).
import { useAuth } from "../context/AuthContext";

// Builds the className function every NavLink needs. It returns "nav-link" plus
// any extra classes, and tacks on "active" when this link is the current page.
// This keeps us from repeating the same isActive ternary on every single link.
function navLinkClass(...extra) {
  return ({ isActive }) =>
    ["nav-link", ...extra, isActive && "active"].filter(Boolean).join(" ");
}

// The brand/logo on the left. Clicking it takes you back to the home page.
function NavBrand() {
  return (
    <Link to="/" className="nav-brand">
      {/* Decorative emoji logo; aria-hidden hides it from screen readers. */}
      <span className="nav-logo" aria-hidden="true">
        💿
      </span>

      <div>
        <h1>The Archive Project</h1>
        <p>Community-driven media preservation</p>
      </div>
    </Link>
  );
}

// Links shown when someone IS logged in: create a post, their email, log out.
function AuthLinks({ user, onLogout }) {
  return (
    <>
      <NavLink to="/submit" className={navLinkClass("submit-link")}>
        Create Post
      </NavLink>

      {/* Display the current user's email address. */}
      <span className="nav-user">{user.email}</span>

      {/* Button that triggers the logout handler passed in from the parent. */}
      <button
        type="button"
        className="nav-link logout-button"
        onClick={onLogout}
      >
        Log Out
      </button>
    </>
  );
}

// Links shown when NO one is logged in: log in or sign up.
function GuestLinks() {
  return (
    <>
      <NavLink to="/login" className={navLinkClass()}>
        Log In
      </NavLink>

      <NavLink to="/signup" className={navLinkClass("submit-link")}>
        Sign Up
      </NavLink>
    </>
  );
}

function Navbar() {
  // Pull the current user (null when logged out) and the signOut function from
  // our auth context.
  const { user, signOut } = useAuth();

  // Runs when the "Log Out" button is clicked.
  async function handleLogout() {
    // Ask the auth system to sign the user out; it hands back an error if it fails.
    const { error } = await signOut();

    // If something went wrong, log it to the console so we can debug it.
    if (error) {
      console.error("Unable to log out:", error.message);
    }
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <NavBrand />

        {/* Right-hand navigation links. */}
        <div className="nav-links">
          {/* Home/Browse link. "end" keeps it active only on the exact "/" path,
              not on every route that starts with "/". */}
          <NavLink to="/" end className={navLinkClass()}>
            Browse
          </NavLink>

          {/* Swap the menu depending on whether someone is logged in. */}
          {user ? (
            <AuthLinks user={user} onLogout={handleLogout} />
          ) : (
            <GuestLinks />
          )}
        </div>
      </nav>
    </header>
  );
}

// Make this component available to import elsewhere (e.g. in App.jsx).
export default Navbar;
