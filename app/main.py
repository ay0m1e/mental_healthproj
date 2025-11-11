from fastapi import FastAPI
from pydantic import BaseModel
from .database import Base, engine, SessionLocal
from .models import MoodEntry
from sqlalchemy.orm import Session
from fastapi import Depends

# The FastAPI instance is the core application object shared by all routes.
# Think of this as the meeting point where routers, middleware, etc. get plugged in.
app = FastAPI(title="Mental Health API")

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
AFFIRMATIONS = {
    "happy": "Keep shining, your joy inspires others.",
    "sad": "It’s okay to feel low. You’re stronger than you think.",
    "angry": "Take a deep breath. Calm creates clarity.",
    "stressed": "Pause. You deserve rest and peace.",
    "neutral": "A balanced day is a good day.",
}


@app.post("/api/mood")
def get_affirmation(data: MoodIn, db: Session = Depends(get_db)):
    """
    Accept a mood from the client, log it for dashboards, then send back
    the matching affirmation. Dependencies inject the DB session so adding
    analytics writes stays localized to this function.
    """
    mood = data.mood.lower()
    message = AFFIRMATIONS.get(mood, "Stay mindful today.")

    # Store the raw mood so we can build weekly/monthly trend charts later.
    entry = MoodEntry(mood=mood)
    db.add(entry)
    db.commit()

    return {"affirmation": message}
