from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.transactions import router as transactions_router

app = FastAPI(
    title="AI Payment Risk Manager",
    version="1.0.0",
    description="AI-powered payment fraud and risk analysis system",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-flame-nine-49.vercel.app",
        "https://frontend-git-main-sonu-balagavi15s-projects.vercel.app",
        "https://frontend-7pij27lt9-sonu-balagavi15s-projects.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Payment Risk Manager API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# IMPORTANT:
# Do NOT add /auth here because auth.py already contains /auth paths.
app.include_router(auth_router)

# Same for transactions
app.include_router(transactions_router)