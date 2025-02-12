// Square.tsx with inline styles for hover
import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

interface SquareProps {
  value: string | null;
  index: number;
  onClick: () => void;
  playerXTurn: boolean;
  isGameOver: boolean;
}

const Square: React.FC<SquareProps> = ({
  value,
  onClick,
  playerXTurn,
  isGameOver,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getMarkerColor = (marker: "X" | "O") => {
    if (marker === "X") {
      return theme === "dark" ? "#60a5fa" : "#2563eb"; // Blue colors
    } else {
      return theme === "dark" ? "#f87171" : "#dc2626"; // Red colors
    }
  };

  const styles = {
    square: {
      width: "100px",
      height: "100px",
      backgroundColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "48px",
      fontWeight: "bold",
      cursor: isGameOver ? "default" : "pointer",
      transition: "background-color 0.3s ease",
      position: "relative" as const,
      color: value === "X" ? getMarkerColor("X") : getMarkerColor("O"),
    },
    hoverContent: {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.5,
      pointerEvents: "none" as const,
      color: playerXTurn ? getMarkerColor("X") : getMarkerColor("O"),
      fontSize: "48px",
      fontWeight: "bold",
    },
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={styles.square}
    >
      {value}
      {!isGameOver && !value && isHovered && (
        <div style={styles.hoverContent}>{playerXTurn ? "X" : "O"}</div>
      )}
    </div>
  );
};

export default Square;
