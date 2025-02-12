type Board = (string | null)[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

type MoveStrategy = (gameArray: Board, symbol: string) => number;

const strategyWeights = {
  winningMove: 100,
  blockingMove: 90,
  centerMove: 50,
  cornerMove: 30,
  sideMove: 10,
};

const positionScores = {
  center: 4,
  corners: [0, 2, 6, 8],
  sides: [1, 3, 5, 7],
};

const moveStrategies: Record<string, MoveStrategy> = {
  winningMove: (gameArray: Board, symbol: string): number => {
    return findWinningMove(gameArray, symbol);
  },

  blockingMove: (gameArray: Board, symbol: string): number => {
    const opponent = symbol === "X" ? "O" : "X";
    return findWinningMove(gameArray, opponent);
  },

  centerMove: (gameArray: Board): number => {
    return gameArray[positionScores.center] === null
      ? positionScores.center
      : -1;
  },

  cornerMove: (gameArray: Board): number => {
    const availableCorners = positionScores.corners.filter(
      (corner) => gameArray[corner] === null
    );
    return availableCorners.length > 0
      ? availableCorners[Math.floor(Math.random() * availableCorners.length)]
      : -1;
  },

  sideMove: (gameArray: Board): number => {
    const availableSides = positionScores.sides.filter(
      (side) => gameArray[side] === null
    );
    return availableSides.length > 0
      ? availableSides[Math.floor(Math.random() * availableSides.length)]
      : -1;
  },
};

const findWinningMove = (gameArray: Board, symbol: string): number => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const line = [gameArray[a], gameArray[b], gameArray[c]];

    if (
      line.filter((cell) => cell === symbol).length === 2 &&
      line.filter((cell) => cell === null).length === 1
    ) {
      return combination[line.indexOf(null)];
    }
  }
  return -1;
};

export const findBestMove = (gameArray: Board, aiSymbol: string): number => {
  // Create an array of strategies sorted by weight
  const sortedStrategies = Object.entries(strategyWeights)
    .sort(([, a], [, b]) => b - a)
    .map(([strategy]) => strategy);

  // Try each strategy in order of weight
  for (const strategy of sortedStrategies) {
    const move = moveStrategies[strategy](gameArray, aiSymbol);
    if (move !== -1) {
      return move;
    }
  }

  // If no moves found (shouldn't happen in normal gameplay)
  return -1;
};
