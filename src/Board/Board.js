import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../Board/Board.css';

const BOARD_SIZE = 15;
const DIRECTIONS = {
  up: -BOARD_SIZE,
  down: BOARD_SIZE,
  left: -1,
  right: 1,
};
const OPPOSITE_DIRECTIONS = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// Custom hook for interval
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id;
    if (delay !== null) {
      id = setInterval(() => savedCallback.current(), delay);
    }
    return () => clearInterval(id);
  }, [delay]);
}

export default function Board() {
  const initialPosition = Math.floor(Math.random() * (BOARD_SIZE ** 2)) + 1;
  const [snake, setSnake] = useState([initialPosition]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [direction, setDirection] = useState(initialPosition > middle ? 'up' : 'down');
  const [foodPosition, setFoodPosition] = useState(generateRandomPosition(snake));

  // Handle snake movement
  const moveSnake = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const newPosition = snake[0] + DIRECTIONS[direction];
    if (isGameOver(newPosition, snake, direction)) {
      setGameStatus('end');
      return;
    }

    if (newPosition === foodPosition) {
      setScore(score + 1);
      setFoodPosition(generateRandomPosition(snake));
      setSnake([newPosition, ...snake]);
    } else {
      setSnake([newPosition, ...snake.slice(0, -1)]);
    }
  }, [snake, direction, gameStatus, foodPosition, score]);

  useInterval(moveSnake, 100);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    const newDirection = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }[e.key];

    if (!newDirection || (snake.length > 1 && isOppositeDirection(newDirection, direction))) {
      return;
    }

    setDirection(newDirection);
  }, [direction, snake]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset game
  const resetGame = () => {
    const initialSnakePosition = Math.floor(Math.random() * (BOARD_SIZE ** 2)) + 1;
    const middle = BOARD_SIZE ** 2 / 2;
    setSnake([initialSnakePosition]);
    setFoodPosition(generateRandomPosition([initialSnakePosition]));
    setScore(0);
    setGameStatus('playing');
    setDirection(initialSnakePosition > middle ? 'up' : 'down');
  };

  return (
    <>
      <h3 style={{ fontFamily: "Didot, serif" }}>Score: {score}</h3>
      {gameStatus === 'end' ? <button className="reset" onClick={resetGame}>New Game</button> : <div className='reset'></div>}
      <div>
        {[...Array(BOARD_SIZE)].map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {[...Array(BOARD_SIZE)].map((_, columnIndex) => {
              const position = rowIndex * BOARD_SIZE + columnIndex + 1;
              return (
                <div
                  className="cell"
                  key={position}
                  id={
                    snake.includes(position)
                      ? 'snake'
                      : position === foodPosition
                      ? 'food'
                      : ''
                  }
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// Helper functions
function generateRandomPosition(snake) {
  let position;
  do {
    position = Math.floor(Math.random() * (BOARD_SIZE ** 2)) + 1;
  } while (snake.includes(position));
  return position;
}

function isGameOver(position, snake, direction) {
  if (position <= 0 || position > BOARD_SIZE ** 2) return true;
  if (snake.includes(position)) return true;
  if ((position % BOARD_SIZE === 0 && direction === 'left') || (position % BOARD_SIZE === 1 && direction === 'right')) return true;
  return false;
}

function isOppositeDirection(newDir, currentDir) {
  return OPPOSITE_DIRECTIONS[newDir] === currentDir;
}
