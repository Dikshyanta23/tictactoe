import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContextValue";
import PlayerForm from "./PlayerForm";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";
import { Game } from "./GameContextValue";

const formatTime = (game: Game): string => {
  if (game.status === "unstarted") return "00:00";

  const timeToShow = game.totalTime;
  const seconds = Math.floor(timeToShow / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const GameList: React.FC = () => {
  const { games, addGame, gameStats } = useContext(GameContext)!;
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const { theme } = useTheme();

  const handleFormSubmit = (data: {
    playerName: string;
    age: number;
    email: string;
    startFirst: boolean;
  }) => {
    addGame(data.playerName, data.age, data.email, data.startFirst);
    setShowForm(false);
  };

  const statsStyles = {
    statsContainer: {
      marginTop: "32px",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: theme === "dark" ? "#2d3748" : "#e2e8f0",
      width: "100%",
      maxWidth: "400px",
    },
    statsTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "12px",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      textAlign: "center" as const,
    },
    statItem: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    statLabel: {
      fontSize: "14px",
      color: theme === "dark" ? "#a0aec0" : "#4a5568",
      marginTop: "4px",
    },
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    newGameButton: {
      padding: "8px 24px",
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      marginBottom: "16px",
      transition: "background-color 0.3s ease",
      ":hover": {
        backgroundColor: "#2563eb",
      },
    },
    gameList: {
      width: "100%",
      maxWidth: "400px",
    },
    gameItem: {
      backgroundColor: theme === "dark" ? "#2d3748" : "#e2e8f0", // Darker shade for light mode
      padding: "8px 16px",
      borderRadius: "8px",
      marginBottom: "8px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background-color 0.3s ease",
      ":hover": {
        backgroundColor: theme === "dark" ? "#4a5568" : "#cbd5e1",
      },
    },
    gameName: {
      fontSize: "18px",
      fontWeight: "600",
      textTransform: "capitalize" as const,
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    gameStatus: {
      fontSize: "14px",
      color: theme === "dark" ? "#a0aec0" : "#4a5568",
    },
  };

  return (
    <div style={styles.container}>
      <ThemeToggle />
      <h1 style={styles.title}>Tic Tac Toe Games</h1>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={styles.newGameButton}>
          Create New Game
        </button>
      ) : (
        <PlayerForm onSubmit={handleFormSubmit} setShowForm={setShowForm} />
      )}

      <div style={styles.gameList}>
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            style={styles.gameItem}
          >
            <h2 style={styles.gameName}>{game.playerName}</h2>
            <p style={styles.gameStatus}>{game.status}</p>
            <p>Game Time: {formatTime(game)}</p>
          </div>
        ))}
      </div>
      <div style={statsStyles.statsContainer}>
        <h3 style={statsStyles.statsTitle}>Game Statistics</h3>
        <div style={statsStyles.statsGrid}>
          <div style={statsStyles.statItem}>
            <span style={statsStyles.statValue}>{gameStats.totalGames}</span>
            <span style={statsStyles.statLabel}>Total Games</span>
          </div>
          <div style={statsStyles.statItem}>
            <span style={statsStyles.statValue}>{gameStats.gamesWon}</span>
            <span style={statsStyles.statLabel}>Games Won</span>
          </div>
          <div style={statsStyles.statItem}>
            <span style={statsStyles.statValue}>{gameStats.gamesLost}</span>
            <span style={statsStyles.statLabel}>Games Lost</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameList;
