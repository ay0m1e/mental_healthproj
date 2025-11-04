from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Mental Health API")

@app.get("/health")
def health():
    return {"status" : "ok"}

class MoodIn(BaseModel):
    mood: str
    
AFFIRM = {
    "happy": "Keep shining, your joy inspires others.",
    "sad": "It’s okay to feel low. You’re stronger than you think.",
    "angry": "Take a deep breath. Calm creates clarity.",
    "stressed": "Pause. You deserve rest and peace.",
    "neutral": "A balanced day is a good day."
}

@app.post("/api/mood")
def get_affirmation(payload: MoodIn):
    return {"affirmation": AFFIRM.get(payload.mood.lower(), "Stay mindful today")}