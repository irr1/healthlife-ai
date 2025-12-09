from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.crud import user as crud_user
from app.core.security import verify_token

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Legacy session getter - use get_db instead"""
    async for session in get_db():
        yield session


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get current authenticated user from JWT access token

    This dependency can be used in any endpoint that requires authentication:

    ```python
    @router.get("/protected")
    async def protected_route(current_user: User = Depends(get_current_user)):
        return {"user_id": current_user.id}
    ```

    Raises:
        HTTPException: If token is invalid or user not found

    Returns:
        User: Current authenticated user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Verify token and extract user_id
    user_id = verify_token(token, token_type="access")
    if user_id is None:
        raise credentials_exception

    # Get user from database
    user = await crud_user.get_user_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active superuser

    Use this dependency for admin-only endpoints

    Raises:
        HTTPException: If user is not a superuser

    Returns:
        User: Current superuser
    """
    # TODO: Add is_superuser field to User model
    # For now, just return the current user
    # In production, add: if not current_user.is_superuser: raise HTTPException(...)
    return current_user
