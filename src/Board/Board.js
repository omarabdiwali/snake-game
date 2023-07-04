import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../Board/Board.css';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Board() {
  const BOARD_SIZE = 15;
  const rand = randomPos();
  const board = [];
  for (let index = 1; index <= BOARD_SIZE; index++) {
    board.push(index);
  }
  const squares = board.map(row => board);
  const [snake, setSnake] = useState([rand]);
  const [foodCell, setFoodCell] = useState(randomPos());
  const [score, setScore] = useState(0);
  const [game, setGame] = useState("playing");
  const [direction, setDirection] = useState(rand < 120 ? "down" : "up");

  useInterval(() => {
    moveSnake(direction);
  }, 125);

  // useEffect(() => {
  //   window.addEventListener("keydown", getKey);
  //   return () => {
  //     window.addEventListener("keydown", getKey);
  //   }
  // }, [getKey]);

  const getKey = e => {
      if (e.key == "ArrowDown" && (direction !== "up" || snake.length == 1)) {
        setDirection("down");
      } else if (e.key == "ArrowUp" && (direction !== "down" || snake.length == 1)) {
        setDirection("up")
      } else if (e.key == "ArrowRight" && (direction !== "left" || snake.length == 1)) {
        setDirection("right");
      } else if (e.key == "ArrowLeft" && (direction !== "right" || snake.length == 1)) {
        setDirection("left");
      }
    }

  function randomPos(reason = null) {
    let pos = Math.round(Math.random() * (BOARD_SIZE ** 2));
    while (pos === 0) {
      pos = Math.round(Math.random() * (BOARD_SIZE ** 2));
    }
    if (reason != null) {
      const shnake = [...snake];
      while (shnake.includes(pos) || pos === 0) {
        pos = Math.round(Math.random() * (BOARD_SIZE ** 2));
      }
    }
    return pos;
  }

  function start() {
    const rand = randomPos();
    setSnake([rand]);
    setFoodCell(randomPos("eat"));
    setScore(0);
    setGame("playing");
    setDirection(rand < 120 ? "down" : "up");
  }

  function moveSnake(pos) {
    if (game === "playing") {
      let coord = snake[0];
      if (pos === "right") {
        if (coord % BOARD_SIZE === 0) {
          setGame("end");
          return;
        }
        else {
          setDirection("right");
          coord++;
        }
      }
      else if (pos === "left") {
        if (coord % BOARD_SIZE === 1) {
          setGame("end");
          return;
        }
        else {
          setDirection("left");
          coord--;
        }
      }
      else if (pos === "up") {
        if (coord <= BOARD_SIZE) {
          setGame("end");
          return;
        }
        else {
          setDirection("up");
          coord -= BOARD_SIZE;
        }
      }
      else {
        if (coord >= (BOARD_SIZE * (BOARD_SIZE - 1) + 1)) {
          setGame("end");
          return;
        }
        else {
          setDirection("down");
          coord += BOARD_SIZE;
        }
      }
      if (coord >= 1 || coord <= (BOARD_SIZE ** 2)) {
        if (coord === foodCell) {
          const newSnake = [...snake];
          setScore(score + 1);
          newSnake.unshift(coord);
          setSnake(newSnake);
          setFoodCell(randomPos("eat"));
        }
        else {
          if (snake.includes(coord)) {
            setGame("end");
            return;
          }
          const newSnake = [...snake];
          if (newSnake.length === 1) {
            setSnake([coord]);
          }
          else {
            newSnake.unshift(coord);
            newSnake.pop();
            setSnake(newSnake);
          }
        }
      }
    }
  }

  return (
    <div onKeyDown={getKey}>
      <h3 style={{ fontFamily: "Didot, serif" }}>Score: {score}</h3>
      <div>
        {game === "end" ? <button onClick={start}>New Game</button> : ""}
        {squares.map((row, idx) => {
          return (
            <div className="row" key={idx}>
              {row.map((cell, id) => {
                const pos = idx * BOARD_SIZE + cell;
                return (
                  <div className="cell" key={pos} id={snake.includes(pos) ? "snake" : pos === foodCell ? "food" : ""}></div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
