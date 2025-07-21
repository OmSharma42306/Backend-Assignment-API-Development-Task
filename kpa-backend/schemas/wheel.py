from pydantic import BaseModel
from datetime import date
from typing import Dict

class WheelFormCreate(BaseModel):
    formNumber: str
    submittedBy: str
    submittedDate: date
    fields: Dict[str, str]

