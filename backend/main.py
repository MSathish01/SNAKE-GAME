from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCORES_FILE = "scores.json"

class Score(BaseModel):
    score: int

def get_high_score_from_file():
    if not os.path.exists(SCORES_FILE):
        return 0
    try:
        with open(SCORES_FILE, "r") as f:
            data = json.load(f)
            return data.get("high_score", 0)
    except (json.JSONDecodeError, ValueError):
        return 0

def save_high_score_to_file(score: int):
    with open(SCORES_FILE, "w") as f:
        json.dump({"high_score": score}, f)

@app.get("/highscore")
def get_highscore():
    return {"high_score": get_high_score_from_file()}

@app.post("/highscore")
def update_highscore(score_data: Score):
    current_high = get_high_score_from_file()
    if score_data.score > current_high:
        save_high_score_to_file(score_data.score)
        return {"message": "New high score!", "high_score": score_data.score}
    return {"message": "Score not higher than current high score", "high_score": current_high}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
