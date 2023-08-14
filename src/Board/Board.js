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
  const rand = Math.floor(Math.random() * (15 * 15));
  const board = [];
  for (let index = 1; index <= BOARD_SIZE; index++) {
    board.push(index);
  }
  const squares = board.map(_ => board);
  const [snake, setSnake] = useState([rand]);
  const [score, setScore] = useState(0);
  const [game, setGame] = useState("playing");
  const [direction, setDirection] = useState(rand < 120 ? "down" : "up");
  const [prevDir, setPrevDir] = useState(rand < 120 ? "down" : "up");
  const [interv, setInterv] = useState();

  const randomPos = useCallback((reason = null) => {
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
  }, [snake])

  const [foodCell, setFoodCell] = useState(randomPos());

  useInterval(() => {
    moveSnake();
  }, 123);

  const movement = useCallback(e => {
    if (e.key === "ArrowDown") {
      if (direction !== "up" || snake.length === 1) {
        setDirection("down");
      }
    } else if (e.key === "ArrowUp") {
      if (direction !== "down" || snake.length === 1) {
        setDirection("up");
      }
    } else if (e.key === "ArrowRight") {
      if (direction !== "left" || snake.length === 1) {
        setDirection("right");
      }
    } else if (e.key === "ArrowLeft") {
      if (direction !== "right" || snake.length === 1) {
        setDirection("left");
      }
    }
  }, [direction, snake]);

  useEffect(() => {
    window.addEventListener('keydown', movement);
    return () => {
      window.removeEventListener('keydown', movement);
    }
  }, [movement]);

  function start() {
    const rand = randomPos();
    setSnake([rand]);
    setFoodCell(randomPos("eat"));
    setScore(0);
    setGame("playing");
    setDirection(rand < 120 ? "down" : "up");
  }

  const moveSnake = useCallback((shnake = null) => {
    if (interv === false && shnake === null) return;

    let pos = direction;
    let sanke = JSON.parse(JSON.stringify(snake));

    if (shnake) {
      sanke = shnake;
    }

    if (game === "playing") {
      let coord = sanke[0];
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
          const newSnake = [...sanke];
          setScore(score + 1);
          newSnake.unshift(coord);
          setSnake(newSnake);
          setFoodCell(randomPos("eat"));
        }
        else {
          if (sanke.includes(coord)) {
            setGame("end");
            return;
          }
          const newSnake = [...sanke];
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
  }, [game, snake, interv, direction, foodCell, randomPos, score])

  useEffect(() => {
    if (direction !== prevDir) {
      setInterv(false);
      moveSnake(snake);
      setPrevDir(direction);
      setInterv(true);
    }
  }, [prevDir, direction, snake, moveSnake])

  return (
    <>
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
    </>
  )
}
