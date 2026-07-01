import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

function Header() {
  return (
    <header className="head">
      <Link to="/" className="brand">
        <span className="brand-mark">📺</span>
        <span className="brand-name">CouchTime</span>
      </Link>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export default Header;
