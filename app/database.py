from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()



# Central place for DB config. We can swap to Postgres later by changing this one value
# (or better yet, reading from envs once deployment targets are ready).
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLite runs in-process, so we disable the same-thread guard to let FastAPI spawn
# multiple requests concurrently. echo=False keeps logs quiet unless we need SQL traces.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Sessions give each request its own scoped view of the database.
# autoflush/autocommit stay False so we explicitly control when writes happen.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base registers every ORM model. Base.metadata.create_all() walks this registry
# to create the underlying tables when the app boots.
Base = declarative_base()
