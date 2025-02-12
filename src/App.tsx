import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameList from "./components/GameList";
import Board from "./components/Board";
import { GameProvider } from "./components/GameContext";
import { ThemeProvider } from "./components/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/game/:gameId" element={<Board />} />
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
