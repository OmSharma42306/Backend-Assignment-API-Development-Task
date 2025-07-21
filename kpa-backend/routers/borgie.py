from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas.bogie import BogieFormCreate

router = APIRouter(prefix="/api",tags=["Forms"])

@router.post("/forms/bogie-checksheet", status_code=201)
def create_bogie_form(form: BogieFormCreate, db: Session = Depends(get_db)):
    new_form = models.BogieChecksheetForm(
        form_number=form.formNumber,
        inspection_by=form.inspectionBy,
        inspection_date=form.inspectionDate,
        bogie_details=form.bogieDetails,
        bogie_checksheet=form.bogieChecksheet,
        bmbc_checksheet=form.bmbcChecksheet
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return {
        "success": True,
        "message": "Bogie checksheet submitted successfully.",
        "data": {
            "formNumber": new_form.form_number,
            "inspectionBy": new_form.inspection_by,
            "inspectionDate": new_form.inspection_date,
            "status": "Saved"
        }
    }


@router.get("/forms/wheel-specifications")
def get_wheel_form(
    formNumber: str = Query(...),
    submittedBy: str = Query(...),
    submittedDate: str = Query(...),
    db: Session = Depends(get_db)
):
    form = db.query(models.WheelSpecificationForm).filter(
        models.WheelSpecificationForm.form_number == formNumber,
        models.WheelSpecificationForm.submitted_by == submittedBy,
        models.WheelSpecificationForm.submitted_date == submittedDate
    ).first()

    if not form:
        raise HTTPException(status_code=404, detail="Wheel form not found.")

    return {
        "success": True,
        "data": {
            "formNumber": form.form_number,
            "submittedBy": form.submitted_by,
            "submittedDate": form.submitted_date,
            "fields": form.fields
        }
    }