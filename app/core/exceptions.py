from fastapi import HTTPException
class UserAlreadyExistsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="User already exists"
        )
class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail="Invalid email or password"
        )
class InvalidTokenException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )