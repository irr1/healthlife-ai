from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.api.deps import get_current_user
from app.models.user import User as UserModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, AuthResponse, Token
from app.schemas.user import UserCreate, User
from app.crud import user as crud_user
from app.core.security import create_access_token, create_refresh_token, verify_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    """
    Register a new user

    - **email**: Valid email address
    - **password**: Password (min 8 characters)
    - **full_name**: Optional full name
    - **age**, **gender**, **height**: Optional profile information
    - **current_weight**, **goal_weight**: Optional health metrics
    - **activity_level**: Optional activity level
    - **goals**: Optional list of health goals

    Returns access token, refresh token, and user information
    """
    # Check if user already exists
    existing_user = await crud_user.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    db_user = await crud_user.create_user(db, user_in)
    await db.commit()

    # Generate tokens
    access_token = create_access_token(subject=str(db_user.id))
    refresh_token = create_refresh_token(subject=str(db_user.id))

    # Return response with tokens and user info
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user={
            "id": db_user.id,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "is_active": db_user.is_active,
        }
    )


@router.post("/login", response_model=Token)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Token:
    """
    Login with email and password

    - **email**: User email address
    - **password**: User password

    Returns JWT access token and refresh token
    """
    # Authenticate user
    user = await crud_user.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshRequest,
    db: AsyncSession = Depends(get_db)
) -> Token:
    """
    Refresh access token using refresh token

    - **refresh_token**: Valid refresh token

    Returns new access token and refresh token
    """
    # Verify refresh token
    user_id = verify_token(request.refresh_token, token_type="refresh")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user still exists and is active
    user = await crud_user.get_user_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Generate new tokens
    access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)

    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: UserModel = Depends(get_current_user)
) -> User:
    """
    Get current user information

    Requires authentication header: `Authorization: Bearer <access_token>`

    Returns current user profile
    """
    return current_user
