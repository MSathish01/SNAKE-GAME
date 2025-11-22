import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './components/GameBoard';

const API_URL = 'http://localhost:8000';

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchHighScore();
  }, []);

  const fetchHighScore = async () => {
    try {
      const response = await axios.get(`${API_URL}/highscore`);
      setHighScore(response.data.high_score);
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  const updateHighScore = async (score) => {
    if (score > highScore) {
      try {
        await axios.post(`${API_URL}/highscore`, { score });
        setHighScore(score);
      } catch (error) {
        console.error('Error updating high score:', error);
      }
    }
  };

  const handleScoreUpdate = (score) => {
    setCurrentScore(score);
  };

  const handleGameOver = (finalScore) => {
    setIsPlaying(false);
    setGameOver(true);
    updateHighScore(finalScore);
  };

  const startGame = () => {
    setCurrentScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex flex-col items-center justify-center font-sans text-white overflow-hidden perspective-1000">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_500px_at_50%_50%,_rgba(52,211,153,0.1),transparent)] animate-pulse"></div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black mb-4 md:mb-8 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10 tracking-tight text-center px-4">
        SNAKE GAME
      </h1>

      <div className="flex gap-4 md:gap-8 mb-6 md:mb-10 text-xl font-bold z-10">
        <div className="bg-white/5 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col items-center min-w-[100px] md:min-w-[140px]">
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">Score</span>
          <span className="text-2xl md:text-4xl text-emerald-400 drop-shadow-lg">{currentScore}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col items-center min-w-[100px] md:min-w-[140px]">
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">High Score</span>
          <span className="text-2xl md:text-4xl text-amber-400 drop-shadow-lg">{highScore}</span>
        </div>
      </div>

      <div className="relative z-10 group perspective-container">
        <div className={`transition-all duration-700 ease-out transform-style-3d ${isPlaying ? 'rotate-x-12 scale-110' : 'rotate-x-0 scale-100'}`}>
          <GameBoard
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
            isPlaying={isPlaying}
          />
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl text-center transform transition-all hover:scale-105">
              {gameOver && (
                <div className="mb-6">
                  <h2 className="text-5xl font-black text-rose-500 mb-2 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">GAME OVER</h2>
                  <p className="text-slate-300">Final Score: {currentScore}</p>
                </div>
              )}
              <button
                onClick={startGame}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg rounded-full transition-all transform hover:scale-110 hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] active:scale-95"
              >
                {gameOver ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-12 text-slate-500 text-sm font-medium tracking-wide z-10 opacity-60">
        USE ARROW KEYS • AVOID WALLS • SPEED INCREASES
      </p>
    </div>
  );
}

export default App;
