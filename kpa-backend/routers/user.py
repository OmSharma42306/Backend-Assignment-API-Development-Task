from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas import user as user_schema
from fastapi import status

router = APIRouter(prefix="/api/users", tags=["User"])

# Login route
@router.post("/login")
def login_user(credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
    # for demo purpose.
    if credentials.phone == "7760873976" and credentials.password == "to_share@123":
        return {"message": "Login successful", "user_id": 1}
    
    # OR: Check against DB if needed
    user = db.query(models.User).filter(models.User.phone == credentials.phone).first()
    if not user or user.password != credentials.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {"message": "Login successful", "user_id": user.id}
