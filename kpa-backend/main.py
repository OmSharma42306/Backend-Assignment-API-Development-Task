from fastapi import FastAPI
from db.database import Base,engine
from routers import user,borgie,wheel

app = FastAPI()

Base.metadata.create_all(bind=engine)


app.include_router(user.router)
app.include_router(borgie.router)
app.include_router(wheel.router)