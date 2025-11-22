import React, { useRef, useEffect, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SPEED = 200;
const MIN_SPEED = 50;
const SPEED_DECREMENT = 5;

const GameBoard = ({ onScoreUpdate, onGameOver, isPlaying }) => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    const directionRef = useRef({ x: 0, y: 0 });
    const lastMoveDirection = useRef({ x: 0, y: 0 });
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    // Touch handling
    const touchStartRef = useRef(null);

    const spawnFood = useCallback(() => {
        const x = Math.floor(Math.random() * (CANVAS_WIDTH / TILE_SIZE));
        const y = Math.floor(Math.random() * (CANVAS_HEIGHT / TILE_SIZE));
        return { x, y };
    }, []);

    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(spawnFood());
        setDirection({ x: 0, y: 0 });
        directionRef.current = { x: 0, y: 0 };
        lastMoveDirection.current = { x: 0, y: 0 };
        setSpeed(INITIAL_SPEED);
    }, [spawnFood]);

    const changeDirection = useCallback((newDir) => {
        // Prevent reversing based on the LAST MOVED direction
        const last = lastMoveDirection.current;
        const isOpposite =
            (newDir.x === 1 && last.x === -1) ||
            (newDir.x === -1 && last.x === 1) ||
            (newDir.y === 1 && last.y === -1) ||
            (newDir.y === -1 && last.y === 1);

        if (isOpposite) {
            console.log('Blocked reverse direction:', newDir, 'Last:', last);
            return;
        }

        directionRef.current = newDir;
        setDirection(newDir);
    }, []);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    changeDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    changeDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    changeDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    changeDirection({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, changeDirection]);

    // Handle Touch Swipe
    const handleTouchStart = (e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = (e) => {
        if (!touchStartRef.current || !isPlaying) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const diffX = touchEnd.x - touchStartRef.current.x;
        const diffY = touchEnd.y - touchStartRef.current.y;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > 30) { // Threshold
                if (diffX > 0) changeDirection({ x: 1, y: 0 });
                else changeDirection({ x: -1, y: 0 });
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > 30) {
                if (diffY > 0) changeDirection({ x: 0, y: 1 });
                else changeDirection({ x: 0, y: -1 });
            }
        }
        touchStartRef.current = null;
    };

    // Game loop
    useEffect(() => {
        if (!isPlaying) {
            resetGame();
            return;
        }

        const moveSnake = () => {
            if (directionRef.current.x === 0 && directionRef.current.y === 0) return;

            // Update last move direction
            lastMoveDirection.current = directionRef.current;

            setSnake((prevSnake) => {
                const newHead = {
                    x: prevSnake[0].x + directionRef.current.x,
                    y: prevSnake[0].y + directionRef.current.y,
                };

                // Collision detection
                if (
                    newHead.x < 0 ||
                    newHead.x >= CANVAS_WIDTH / TILE_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= CANVAS_HEIGHT / TILE_SIZE
                ) {
                    onGameOver(prevSnake.length - 1);
                    return prevSnake;
                }

                for (let segment of prevSnake) {
                    if (newHead.x === segment.x && newHead.y === segment.y) {
                        onGameOver(prevSnake.length - 1);
                        return prevSnake;
                    }
                }

                const newSnake = [newHead, ...prevSnake];

                if (newHead.x === food.x && newHead.y === food.y) {
                    const newScore = newSnake.length - 1;
                    onScoreUpdate(newScore);
                    setFood(spawnFood());
                    // Increase speed
                    setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_DECREMENT));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, speed);
        return () => clearInterval(gameInterval);
    }, [isPlaying, food, spawnFood, onGameOver, onScoreUpdate, resetGame, speed]);

    // Render
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear with semi-transparent background for trail effect (optional, keeping solid for now)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Grid (Subtle)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= CANVAS_WIDTH; i += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let i = 0; i <= CANVAS_HEIGHT; i += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(CANVAS_WIDTH, i);
            ctx.stroke();
        }

        // Draw Snake
        snake.forEach((segment, index) => {
            // Gradient for snake
            const gradient = ctx.createLinearGradient(
                segment.x * TILE_SIZE,
                segment.y * TILE_SIZE,
                (segment.x + 1) * TILE_SIZE,
                (segment.y + 1) * TILE_SIZE
            );
            if (index === 0) {
                // Head
                gradient.addColorStop(0, '#34d399');
                gradient.addColorStop(1, '#10b981');
                ctx.shadowColor = '#34d399';
                ctx.shadowBlur = 15;
            } else {
                // Body
                gradient.addColorStop(0, '#10b981');
                gradient.addColorStop(1, '#059669');
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = gradient;

            // Rounded rectangles for segments
            const radius = 4;
            const x = segment.x * TILE_SIZE;
            const y = segment.y * TILE_SIZE;
            const size = TILE_SIZE - 2; // Slight gap

            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size, size, radius);
            ctx.fill();
        });

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw Food
        const foodX = food.x * TILE_SIZE + TILE_SIZE / 2;
        const foodY = food.y * TILE_SIZE + TILE_SIZE / 2;

        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#f43f5e';

        ctx.beginPath();
        ctx.arc(foodX, foodY, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight for food
        ctx.fillStyle = '#fda4af';
        ctx.beginPath();
        ctx.arc(foodX - 2, foodY - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

    }, [snake, food]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                {/* 3D Container Effect applied in parent, this is the board */}
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="rounded-xl shadow-2xl bg-slate-900 border border-slate-700 max-w-[90vw] h-auto touch-none"
                    style={{
                        boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />
            </div>

            {/* Mobile D-Pad Controls */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
                <div></div>
                <button
                    className="w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center active:bg-emerald-500/50 transition-colors"
                    onClick={() => changeDirection({ x: 0, y: -1 })}
                >
                    <span className="text-2xl">⬆️</span>
                </button>
                <div></div>

                <button
                    className="w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center active:bg-emerald-500/50 transition-colors"
                    onClick={() => changeDirection({ x: -1, y: 0 })}
                >
                    <span className="text-2xl">⬅️</span>
                </button>
                <button
                    className="w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center active:bg-emerald-500/50 transition-colors"
                    onClick={() => changeDirection({ x: 0, y: 1 })}
                >
                    <span className="text-2xl">⬇️</span>
                </button>
                <button
                    className="w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-600 flex items-center justify-center active:bg-emerald-500/50 transition-colors"
                    onClick={() => changeDirection({ x: 1, y: 0 })}
                >
                    <span className="text-2xl">➡️</span>
                </button>
            </div>
        </div>
    );
};

export default GameBoard;
