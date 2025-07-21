from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas.wheel import WheelFormCreate

router = APIRouter(prefix="/api",tags=["Forms"])


@router.post("/forms/wheel-specifications", status_code=201)
def create_wheel_form(form: WheelFormCreate, db: Session = Depends(get_db)):
    new_form = models.WheelSpecificationForm(
        form_number=form.formNumber,
        submitted_by=form.submittedBy,
        submitted_date=form.submittedDate,
        fields=form.fields
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return {
        "success": True,
        "message": "Wheel specification submitted successfully.",
        "data": {
            "formNumber": new_form.form_number,
            "submittedBy": new_form.submitted_by,
            "submittedDate": new_form.submitted_date,
            "status": "Saved"
        }
    }
