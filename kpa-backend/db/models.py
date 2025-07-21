from sqlalchemy import Column,Integer,String,JSON
from db.database import Base
from sqlalchemy import Date

class User(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    phone = Column(String,nullable=False,unique=True)
    password = Column(String,nullable=False)

class WheelSpecificationForm(Base):
    __tablename__ = "wheel_specifications"

    id = Column(Integer, primary_key=True, index=True)
    form_number = Column(String, unique=True, index=True)
    submitted_by = Column(String)
    submitted_date = Column(Date)
    fields = Column(JSON)  # Use JSON for flexible nested fields


class BogieChecksheetForm(Base):
    __tablename__ = "bogie_checksheet_forms"

    id = Column(Integer, primary_key=True, index=True)
    form_number = Column(String, unique=True, index=True)
    inspection_by = Column(String)
    inspection_date = Column(Date)
    bogie_details = Column(JSON)
    bogie_checksheet = Column(JSON)
    bmbc_checksheet = Column(JSON)

