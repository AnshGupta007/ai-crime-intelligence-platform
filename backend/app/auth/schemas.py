from pydantic import BaseModel


class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    username: str
    password: str
    role: str  # SCRB, SP, IO
    district_id: int | None = None
    station_id: int | None = None


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserOut(BaseModel):
    user_id: int
    username: str
    role: str
    district_id: int | None = None
    station_id: int | None = None
