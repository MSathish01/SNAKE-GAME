# 🐍 3D Neon Snake Game

A modern, full-stack implementation of the classic Snake game featuring immersive 3D visuals, neon glow aesthetics, and a global high-score system.

## ✨ Features

- **Immersive UI**: Glassmorphism design with dynamic radial gradients and neon glow effects.
- **3D Perspective**: The game board tilts and reacts dynamically to game state for a unique depth effect.
- **Responsive Gameplay**: Fully playable on desktop (keyboard) and mobile (touch swipe & D-pad).
- **Global High Scores**: Integrated Python FastAPI backend to persist and track high scores.
- **Dynamic Difficulty**: Speed increases as you eat more food.

## 🛠️ Tech Stack

### Frontend
- **React 19**: For building the user interface.
- **Vite**: For lightning-fast development and building.
- **Tailwind CSS 4**: For modern, utility-first styling.
- **HTML5 Canvas**: For high-performance rendering of the game loop.

### Backend
- **Python**: Core language.
- **FastAPI**: For building the high-performance REST API.
- **Uvicorn**: ASGI server for production.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)

### 1. Backend Setup

Navigate to the backend directory and start the server:

```bash
cd backend

# Install dependencies (if you haven't already)
# You might need to create a virtual environment first
pip install fastapi uvicorn

# Start the server
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🎮 How to Play

### Desktop
- **Arrow Keys**: Move Up, Down, Left, Right.

### Mobile
- **Swipe**: Swipe anywhere on the board to change direction.
- **On-Screen D-Pad**: Use the directional buttons below the board.

## 📁 Project Structure

```
├── backend/
│   ├── main.py          # FastAPI application & endpoints
│   └── scores.json      # JSON file for storing high scores
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (GameBoard, etc.)
│   │   ├── App.jsx      # Main application logic
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
