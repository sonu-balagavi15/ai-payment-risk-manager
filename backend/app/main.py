from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.transactions import router as transaction_router
from app.routes.risk import router as risk_router


app = FastAPI(
    title="AI Payment Risk Manager",
    description="AI-powered payment fraud and risk analysis system",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

origins = [
    "https://frontend-flame-nine-49.vercel.app",
    "https://frontend-git-main-sonu-balagavi15s-projects.vercel.app",
    "https://frontend-7pij27lt9-sonu-balagavi15s-projects.vercel.app",
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


# =========================================================
# ROUTES
# =========================================================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    transaction_router,
    prefix="/transactions",
    tags=["Transactions"]
)

app.include_router(
    risk_router,
    prefix="/risk",
    tags=["Risk Analysis"]
)


# =========================================================
# ROOT
# =========================================================

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