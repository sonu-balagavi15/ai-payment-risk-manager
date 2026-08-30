from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError

from app.database import SessionLocal
from app.models import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


SECRET_KEY = "ai-payment-risk-manager-secret-key"

ALGORITHM = "HS256"


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


security = HTTPBearer()


class RegisterRequest(BaseModel):

    name: str
    email: str
    password: str


class LoginRequest(BaseModel):

    email: str
    password: str


def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(user_id: int):

    payload = {
        "user_id": user_id
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials =
        Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get(
            "user_id"
        )

        if user_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    db: Session = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if user is None:

            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    finally:

        db.close()


@router.post("/register")
def register_user(
    data: RegisterRequest
):

    db: Session = SessionLocal()

    try:

        existing_user = (
            db.query(User)
            .filter(
                User.email == data.email
            )
            .first()
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        hashed_password = hash_password(
            data.password
        )

        user = User(
            name=data.name,
            email=data.email,
            password=hashed_password
        )

        db.add(user)

        db.commit()

        db.refresh(user)

        return {
            "message":
                "Registration successful",

            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }

    finally:

        db.close()


@router.post("/login")
def login_user(
    data: LoginRequest
):

    db: Session = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(
                User.email == data.email
            )
            .first()
        )

        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not verify_password(
            data.password,
            user.password
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            user.id
        )

        return {

            "message":
                "Login successful",

            "access_token":
                access_token,

            "token_type":
                "bearer",

            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }

    finally:

        db.close()


@router.get("/me")
def get_me(
    current_user: User =
        Depends(get_current_user)
):

    return {

        "id": current_user.id,

        "name": current_user.name,

        "email": current_user.email

    }