import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Square from "./Square";
import GameControls from "./GameControls";
import { useGameContext } from "./UseGameContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";

const Board = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const { gameId } = useParams<{ gameId: string }>();
  const {
    games,
    handleClick,
    handleUndo,
    handleRedo,
    handleReset,
    updateGame,
  } = useGameContext();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const game = games.find((g) => g.id === gameId);
  useEffect(() => {
    if (game) {
      if (game.status === "unstarted") {
        // Update the game's start time when first entering the board
        updateGame(game.id, {
          status: "incomplete",
          startTime: Date.now(),
        });
      }
      const timer = setInterval(() => {
        const elapsed = Date.now() - game.startTime;
        setCurrentTime(elapsed);

        updateGame(game.id, {
          totalTime: elapsed,
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game, updateGame]);
  if (!game) return <div>Game not found</div>;

  const formatTime = (ms: number | null): string => {
    if (!ms) return "00:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const gameTime = formatTime(currentTime);

  const isDraw = game.gameArray.every((cell) => cell !== null) && !game.winner;
  const isGameOver = isDraw || game.winner !== null;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      transition: "background-color 0.3s ease",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    subtitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: theme === "dark" ? "#e5e5e5" : "#333333",
    },
    timeDisplay: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: theme === "dark" ? "#e5e5e5" : "#333333",
    },
    turnIndicator: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: game.playerXTurn
        ? theme === "dark"
          ? "#60a5fa"
          : "#2563eb"
        : theme === "dark"
        ? "#f87171"
        : "#dc2626",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
      marginBottom: "20px",
    },
    winnerMessage: {
      marginTop: "16px",
      fontSize: "18px",
      fontWeight: "600",
      color: theme === "dark" ? "#4ade80" : "#16a34a",
    },
    drawMessage: {
      marginTop: "16px",
      fontSize: "18px",
      fontWeight: "600",
      color: theme === "dark" ? "#f87171" : "#dc2626",
    },
    backButton: {
      marginTop: "16px",
      padding: "8px 24px",
      backgroundColor: theme === "dark" ? "#4b5563" : "#6b7280",
      color: "#ffffff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <ThemeToggle />
      <h1 style={styles.title}>Tic Tac Toe Game</h1>
      <h2 style={styles.subtitle}>
        Welcome, {game.playerName}! Have a good game...
      </h2>

      <div style={styles.timeDisplay}>Time: {gameTime}</div>

      {!game.winner && !isDraw && (
        <h2 style={styles.turnIndicator}>
          {game.startFirst
            ? game.playerXTurn
              ? "Your Turn"
              : "AI's Turn"
            : game.playerXTurn
            ? "AI's Turn"
            : "Your Turn"}
        </h2>
      )}

      <div style={styles.grid}>
        {game.gameArray.map((value, index) => (
          <Square
            key={index}
            value={value}
            index={index}
            onClick={() => handleClick(game.id, index)}
            playerXTurn={game.playerXTurn}
            isGameOver={!!game.winner || isDraw}
          />
        ))}
      </div>

      {game.winner && (
        <h2 style={styles.winnerMessage}>
          🎉{" "}
          {game.startFirst
            ? game.winner === "X"
              ? "You Win!"
              : "AI Wins!"
            : game.winner === "X"
            ? "AI Wins!"
            : "You Win!"}
        </h2>
      )}

      {isDraw && !game.winner && (
        <h2 style={styles.drawMessage}>It's a Draw! 🤝</h2>
      )}

      <GameControls
        onUndo={() => handleUndo(game.id)}
        onRedo={() => handleRedo(game.id)}
        onReset={() => handleReset(game.id)}
        canUndo={game.currentMove > 0}
        canRedo={game.currentMove < game.history.length - 1}
        isGameOver={isGameOver}
      />

      <button onClick={() => navigate("/")} style={styles.backButton}>
        Back to Game List
      </button>
    </div>
  );
};

export default Board;
