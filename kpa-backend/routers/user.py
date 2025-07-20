from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas import user as user_schema


router = APIRouter(prefix="/user",tags=["User"])

@router.post("/register",response_model=user_schema.UserOut)
def register_user(user:user_schema.UserCreate, db : Session=Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone Already Registerd!")
    
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/profile/{id}",response_model=user_schema.UserOut)
def get_user(id:int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not Found!")
    return user