from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

from app.models import Transaction, User

from app.routes.transactions import (
    router as transaction_router
)

from app.routes.auth import (
    router as auth_router
)


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="AI Payment Risk Manager",
    description=(
        "AI-powered payment transaction "
        "risk analysis system"
    ),
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(
    transaction_router
)

app.include_router(
    auth_router
)


@app.get("/")
def home():

    return {
        "message":
            "AI Payment Risk Manager API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }