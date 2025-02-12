import React from "react";
import { useTheme } from "./ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
        color: theme === "dark" ? "#ffffff" : "#000000",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "absolute",
        top: "20px",
        right: "20px",
      }}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
