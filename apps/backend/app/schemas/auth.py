from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT token payload"""
    sub: str  # subject (user_id)
    exp: int  # expiration time
    type: str  # token type (access or refresh)


class LoginRequest(BaseModel):
    """Login request model"""
    email: EmailStr
    password: str = Field(..., min_length=1)


class RefreshRequest(BaseModel):
    """Refresh token request model"""
    refresh_token: str


class AuthResponse(BaseModel):
    """Authentication response with tokens and user info"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict  # User information
