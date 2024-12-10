import { useState, useRef, useEffect } from 'react';

function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status = winner ? `${winner} - ПОБЕДИТЕЛЬ - ${winner}` : `ХОД: ${xIsNext ? 'X' : 'O'}`;
  if (!winner && squares.every(Boolean)) status = 'НИЧЬЯ';
  const gridContainerRef = useRef(null); // Используем useRef для получения ссылки на DOM-элемент

  useEffect(() => {
    if (winner) {
      gridContainerRef.current.classList.add('salute');
    } else {
      gridContainerRef.current.classList.remove('salute');
    }
  }, [winner]);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O');
    onPlay(nextSquares);
  }

  return (
    <>
      <div className='status'>{status}</div>
      <div ref={gridContainerRef} className='grid-container'>
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            className={value === 'X' ? 'x' : value === 'O' ? 'o' : ''}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? 'Ход #' + move : 'СТАРТ';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}
