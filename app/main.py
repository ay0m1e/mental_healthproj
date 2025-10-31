from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Mental Health API")

@app.get("/health")
def health():
    return {"status" : "ok"}