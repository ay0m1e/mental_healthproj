from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

# Think of this file as our schema contract. Any analytic task or admin UI
# will read/write through these models, so document intent here.
class MoodEntry(Base):
    __tablename__ = "mood_entries"

    # Autoincrement id keeps inserts simple and doubles as ordering key.
    id = Column(Integer, primary_key=True, index=True)

    # We limit mood length to 20 chars so the DB rejects unexpected payloads.
    mood = Column(String(20), nullable=False)

    # Server-side timestamp lets us chart trends without trusting client clocks.
    created_at = Column(DateTime, default=datetime.utcnow)
    
