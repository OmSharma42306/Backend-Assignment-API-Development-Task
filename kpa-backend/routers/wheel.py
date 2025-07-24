from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas.wheel import WheelFormCreate
from typing import Optional
from fastapi import Query

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



@router.get("/forms/wheel-specifications")
def get_wheel_form(
    formNumber: Optional[str] = Query(None),
    submittedBy: Optional[str] = Query(None),
    submittedDate: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.WheelSpecificationForm)

    if formNumber:
        query = query.filter(models.WheelSpecificationForm.form_number == formNumber)
    if submittedBy:
        query = query.filter(models.WheelSpecificationForm.submitted_by == submittedBy)
    if submittedDate:
        query = query.filter(models.WheelSpecificationForm.submitted_date == submittedDate)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No matching wheel forms found.")

    return {
        "success": True,
        "message": "Filtered results retrieved successfully.",
        "data": [
            {
                "formNumber": form.form_number,
                "submittedBy": form.submitted_by,
                "submittedDate": form.submitted_date,
                "fields": form.fields
            } for form in results
        ]
    }
