import React from "react";
import { useTheme } from "./ThemeContext";

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isGameOver: boolean; // Add this prop
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  isGameOver,
}) => {
  const { theme } = useTheme();

  const styles = {
    container: {
      display: "flex",
      gap: "16px",
      marginTop: "24px",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      transition: "background-color 0.3s ease",
    },
    undoButton: {
      backgroundColor:
        canUndo && !isGameOver
          ? theme === "dark"
            ? "#eab308" // yellow-600 dark mode
            : "#ca8a04" // yellow-500 light mode
          : theme === "dark"
          ? "#4b5563" // gray-600 dark mode
          : "#9ca3af", // gray-400 light mode
      cursor: canUndo && !isGameOver ? "pointer" : "not-allowed",
      opacity: canUndo && !isGameOver ? 1 : 0.6,
    },
    redoButton: {
      backgroundColor:
        canRedo && !isGameOver
          ? theme === "dark"
            ? "#22c55e" // green-600 dark mode
            : "#16a34a" // green-500 light mode
          : theme === "dark"
          ? "#4b5563" // gray-600 dark mode
          : "#9ca3af", // gray-400 light mode
      cursor: canRedo && !isGameOver ? "pointer" : "not-allowed",
      opacity: canRedo && !isGameOver ? 1 : 0.6,
    },
    resetButton: {
      backgroundColor:
        theme === "dark"
          ? "#dc2626" // red-600 dark mode
          : "#ef4444", // red-500 light mode
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={onUndo}
        disabled={!canUndo || isGameOver}
        style={{
          ...styles.button,
          ...styles.undoButton,
        }}
        title={isGameOver ? "Cannot undo after game is over" : "Undo move"}
      >
        Undo
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo || isGameOver}
        style={{
          ...styles.button,
          ...styles.redoButton,
        }}
        title={isGameOver ? "Cannot redo after game is over" : "Redo move"}
      >
        Redo
      </button>

      <button
        onClick={onReset}
        style={{
          ...styles.button,
          ...styles.resetButton,
        }}
        title="Reset game"
      >
        Reset
      </button>
    </div>
  );
};

export default GameControls;
