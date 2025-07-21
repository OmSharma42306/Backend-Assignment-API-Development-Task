from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import get_db
from schemas.bogie import BogieFormCreate

router = APIRouter(prefix="/f",tags=["Forms"])

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
