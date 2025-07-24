from pydantic import BaseModel

class UserLogin(BaseModel):
    phone: str
    password: str

class UserCreate(BaseModel):
    name: str
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    phone: str

    class Config:
        orm_mode = True
