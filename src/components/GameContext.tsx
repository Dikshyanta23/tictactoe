import React, { useState, useRef, useEffect } from "react";
import { GameContext, GameStats } from "./GameContextValue";
import { Game } from "./GameContextValue";
import { findBestMove } from "./AIPlayer";

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      playerName: "Rupesh",
      age: 12,
      email: "rupeshg@gmail.com",
      startFirst: true,
      gameArray: Array(9).fill(null),
      playerXTurn: true,
      winner: null,
      history: [Array(9).fill(null)],
      currentMove: 0,
      status: "unstarted",
      startTime: Date.now(),
      endTime: null,
      totalTime: 0,
    },
    {
      id: "2",
      playerName: "Rohan",
      age: 14,
      email: "rohang@gmail.com",
      startFirst: false,
      gameArray: Array(9).fill(null),
      playerXTurn: true,
      winner: null,
      history: [Array(9).fill(null)],
      currentMove: 0,
      status: "unstarted",
      startTime: Date.now(),
      endTime: null,
      totalTime: 0,
    },
  ]);

  const [gameStats, setGameStats] = useState<GameStats>(() => ({
    totalGames: games.length, // Initialize with 2 since you have 2 initial games
    gamesWon: 0,
    gamesLost: 0,
  }));

  const gamesRef = useRef(games);
  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  const makeAIMove = (gameId: string) => {
    const game = gamesRef.current.find((g) => g.id === gameId);
    if (!game || game.gameArray.every((cell) => cell !== null) || game.winner)
      return;

    const aiSymbol = game.startFirst ? "O" : "X";
    const aiMove = findBestMove(game.gameArray, aiSymbol);

    if (aiMove !== -1 && game.gameArray[aiMove] === null) {
      const newArray = [...game.gameArray];
      newArray[aiMove] = aiSymbol;

      const winner = checkWinner(newArray);
      // const isGameEnding = winner || newArray.every((cell) => cell !== null);

      const newHistory = [
        ...game.history.slice(0, game.currentMove + 1),
        newArray,
      ];

      setGames((prevGames) =>
        prevGames.map((g) => {
          if (g.id === gameId) {
            // Calculate correct turn based on who should play next
            const nextPlayerTurn = game.startFirst
              ? newArray.filter((cell) => cell !== null).length % 2 === 0
              : newArray.filter((cell) => cell !== null).length % 2 === 1;

            return {
              ...g,
              gameArray: newArray,
              playerXTurn: nextPlayerTurn,
              winner,
              history: newHistory,
              currentMove: newHistory.length - 1,
              status: winner ? "complete" : "incomplete",
            } as Game;
          }
          return g;
        })
      );
    }
  };

  const addGame = (
    playerName: string,
    age: number,
    email: string,
    startFirst: boolean
  ) => {
    const newGame: Game = {
      id: String(games.length + 1),
      playerName,
      age,
      email,
      startFirst,
      gameArray: Array(9).fill(null),
      playerXTurn: true,
      winner: null,
      history: [Array(9).fill(null)],
      currentMove: 0,
      status: "unstarted",
      startTime: Date.now(),
      endTime: null,
      totalTime: 0,
    };

    setGames((prevGames) => {
      const updatedGames = [...prevGames, newGame];
      setGameStats({ ...gameStats, totalGames: gameStats.totalGames + 1 });

      if (!startFirst) {
        setTimeout(() => {
          makeAIMove(newGame.id);
        }, 500);
      }

      return updatedGames;
    });
  };

  const updateGame = (id: string, updatedGame: Partial<Game>) => {
    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.id === id) {
          const newGame = { ...game, ...updatedGame };

          // Check if the game just completed
          if (newGame.status === "complete" && game.status !== "complete") {
            const isWin = newGame.winner === (game.startFirst ? "X" : "O");
            if (isWin) {
              setGameStats({ ...gameStats, gamesWon: gameStats.gamesWon + 1 });
            } else {
              setGameStats({
                ...gameStats,
                gamesLost: gameStats.gamesLost + 1,
              });
            }
          }
          return newGame;
        }
        return game;
      })
    );
  };

  const handleClick = (id: string, index: number) => {
    const game = games.find((g) => g.id === id);
    if (!game || game.gameArray[index] || game.winner) return;
    const playerSymbol = game.startFirst ? "X" : "O";

    const isPlayerTurn = game.startFirst
      ? game.playerXTurn === (playerSymbol === "X")
      : game.playerXTurn === (playerSymbol === "O");
    if (!isPlayerTurn) return;

    const newArray = [...game.gameArray];
    newArray[index] = playerSymbol;

    const winner = checkWinner(newArray);
    const newHistory = [
      ...game.history.slice(0, game.currentMove + 1),
      newArray,
    ];

    const isGameEnding = winner || newArray.every((cell) => cell !== null);

    updateGame(id, {
      gameArray: newArray,
      playerXTurn: !game.playerXTurn,
      winner,
      history: newHistory,
      currentMove: newHistory.length - 1,
      status: isGameEnding ? "complete" : "incomplete",
      endTime: isGameEnding ? Date.now() : null,
      totalTime: Date.now() - game.startTime,
    });

    if (!winner && !newArray.every((cell) => cell !== null)) {
      setTimeout(() => {
        makeAIMove(id);
      }, 500);
    }
  };

  const handleUndo = (id: string) => {
    const game = games.find((g) => g.id === id);
    if (!game || game.currentMove === 0) return;

    // Undo both AI and player moves (go back 2 moves if possible)
    const prevMove = Math.max(0, game.currentMove - 2);
    const isXTurn = prevMove % 2 === 0;
    const correctTurn = game.startFirst ? isXTurn : !isXTurn;

    updateGame(id, {
      gameArray: game.history[prevMove],
      currentMove: prevMove,
      playerXTurn: correctTurn,
      winner: null,
      status: "incomplete",
    });
  };

  const handleRedo = (id: string) => {
    const game = games.find((g) => g.id === id);
    if (!game || game.currentMove >= game.history.length - 2) return;

    // Redo both player and AI moves
    const nextMove = Math.min(game.history.length - 1, game.currentMove + 2);
    const isXTurn = nextMove % 2 === 0;
    const correctTurn = game.startFirst ? isXTurn : !isXTurn;

    updateGame(id, {
      gameArray: game.history[nextMove],
      currentMove: nextMove,
      playerXTurn: correctTurn,
      winner: checkWinner(game.history[nextMove]),
      status: "incomplete",
    });
  };

  const handleReset = (id: string) => {
    const game = games.find((g) => g.id === id);
    if (!game) return;

    // If the game was complete before reset, update stats
    if (game.status === "complete") {
      const isWin = game.winner === (game.startFirst ? "X" : "O");
      if (isWin) {
        setGameStats({ ...gameStats, gamesWon: gameStats.gamesWon - 1 });
      } else {
        setGameStats({ ...gameStats, gamesLost: gameStats.gamesLost - 1 });
      }
    }

    setGames((prevGames) => {
      const updatedGames = prevGames.map((g) =>
        g.id === id
          ? {
              ...g,
              gameArray: Array(9).fill(null),
              playerXTurn: true,
              winner: null,
              history: [Array(9).fill(null)],
              currentMove: 0,
              status: "unstarted" as const,
              startTime: Date.now(),
              endTime: null,
              totalTime: 0,
            }
          : g
      );

      if (!game.startFirst) {
        setTimeout(() => {
          makeAIMove(id);
        }, 500);
      }

      return updatedGames;
    });
  };

  const checkWinner = (newArray: (string | null)[]) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        newArray[a] &&
        newArray[a] === newArray[b] &&
        newArray[a] === newArray[c]
      ) {
        return newArray[a]; // "X" or "O"
      }
    }
    return null;
  };

  return (
    <GameContext.Provider
      value={{
        games,
        addGame,
        updateGame,
        gameStats,
        handleClick,
        handleUndo,
        handleRedo,
        handleReset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
