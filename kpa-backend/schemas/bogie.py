from pydantic import BaseModel
from datetime import date
from typing import Dict

class BogieFormCreate(BaseModel):
    formNumber: str
    inspectionBy: str
    inspectionDate: date
    bogieDetails: Dict[str, str]
    bogieChecksheet: Dict[str, str]
    bmbcChecksheet: Dict[str, str]
