
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const spawnFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(spawnFood());
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };

      // Collision Detection
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsRunning(false);
        return;
      }

      const newSnake = [newHead, ...snake];
      
      // Food Consumption
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(spawnFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [snake, direction, food, isRunning, isGameOver, spawnFood]);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
      case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
      case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
      case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-zinc-950 text-white relative outline-none" tabIndex={0} ref={gameRef}>
      <div className="flex justify-between w-full max-w-[400px] mb-4">
        <div className="text-sm font-medium">Score: <span className="text-purple-400">{score}</span></div>
        <div className="text-sm font-medium">High Score: 1200</div>
      </div>

      <div 
        className="relative bg-zinc-900 border-2 border-white/5 rounded overflow-hidden"
        style={{ 
          width: '320px', 
          height: '320px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {snake.map((segment, i) => (
          <div 
            key={i} 
            className={`${i === 0 ? 'bg-purple-400' : 'bg-purple-600'} rounded-[2px] transition-all`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1 
            }}
          />
        ))}
        <div 
          className="bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <h3 className="text-2xl font-bold mb-2 text-red-500">GAME OVER</h3>
            <p className="text-zinc-400 mb-6 text-sm">You scored {score} points</p>
            <button 
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full font-bold transition"
            >
              Play Again
            </button>
          </div>
        )}

        {!isRunning && !isGameOver && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <button 
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-full font-bold transition shadow-xl scale-110"
            >
              START GAME
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls for mobile */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        <div />
        <ControlBtn icon="fa-chevron-up" onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })} />
        <div />
        <ControlBtn icon="fa-chevron-left" onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })} />
        <ControlBtn icon="fa-chevron-down" onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })} />
        <ControlBtn icon="fa-chevron-right" onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })} />
      </div>
    </div>
  );
};

const ControlBtn: React.FC<{ icon: string; onClick: () => void }> = ({ icon, onClick }) => (
  <button 
    onClick={onClick}
    className="w-10 h-10 bg-white/5 hover:bg-white/10 active:bg-purple-500/30 rounded flex items-center justify-center border border-white/5 transition"
  >
    <i className={`fa-solid ${icon}`}></i>
  </button>
);

export default SnakeGame;
