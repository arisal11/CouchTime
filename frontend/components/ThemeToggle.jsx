import { useEffect, useState } from "react";

// Light/dark toggle rendered as a tiny window: curtains part to reveal the sun
// in light mode and close over the moon in dark mode.
function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("couchtime:theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode (close curtains)" : "Switch to light mode (open curtains)"}
      title={isLight ? "Close the curtains" : "Open the curtains"}
    >
      <span className="tt-window">
        <span className="tt-sky" />
        <span className="tt-orb" />
        <span className="tt-curtain tt-left" />
        <span className="tt-curtain tt-right" />
      </span>
    </button>
  );
}

export default ThemeToggle;
