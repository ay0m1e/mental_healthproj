from fastapi import FastAPI
from pydantic import BaseModel
from .database import Base, engine, SessionLocal
from .models import MoodEntry
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
# The FastAPI instance is the core application object shared by all routes.
# Think of this as the meeting point where routers, middleware, etc. get plugged in.
app = FastAPI(title="Mental Health API")

app.add_middleware(
    #This lets the website (which runs from 127.0.0.1:5500 when i use the Live Server extension)
    #send requests to the backend (127.0.0.1:8000).
    #Without this, the browser would block my fetch() calls.
    CORSMiddleware,
    allow_origins=["*"], # accept requests from any domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Auto-create tables on boot so local teammates do not have to run migrations.
# In production we would gate this behind alembic migrations, but this keeps dev fast.
Base.metadata.create_all(bind=engine)


def get_db():
    """Provide a scoped SQLAlchemy session per request and close it afterward."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    """Simple readiness probe for uptime checks and CI smoke tests."""
    return {"status": "ok"}


class MoodIn(BaseModel):
    """Typed request body so FastAPI can validate mood submissions for us."""
    mood: str


# In-memory source of truth for affirmations. Easy to tweak copy here;
# later we can move this to a database table.
def generate_affirmation_llm(mood: str):
    """Generate an emotional affirmation using Groq's Llama 3 8B model."""
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        prompt = (
            f"Write a short, warm, natural affirmation for a young person who's feeling {mood}. "
            f"Use simple, everyday language — empathetic, uplifting, and genuine. "
            f"No exaggerated slang, no emojis, no em-dashes, no gender references. "
            f"Keep it under 25 words with British standard spellings and make it sound like real encouragement from a peer."
        )
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=60,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("Groq LLM error:", e)
        return "You are enough, even when life feels overwhelming."


@app.post("/api/mood")
def get_affirmation(data: MoodIn, db: Session = Depends(get_db)):
    """
    Accept a mood from the client, log it for dashboards, then send back
    the matching affirmation. Dependencies inject the DB session so adding
    analytics writes stays localized to this function.
    """
    mood = data.mood.lower().strip()
    ai_message = generate_affirmation_llm(mood)

    # Store the raw mood so we can build weekly/monthly trend charts later.
    entry = MoodEntry(mood=mood)
    db.add(entry)
    db.commit()

    return {"affirmation": ai_message}
