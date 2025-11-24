from pydantic import BaseModel, EmailStr

class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "user"

class LoginData(BaseModel):
    email: EmailStr
    password: str
