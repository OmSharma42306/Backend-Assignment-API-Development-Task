from fastapi import FastAPI
from db.database import Base,engine
from routers import user,borgie,wheel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(user.router)
app.include_router(borgie.router)
app.include_router(wheel.router)