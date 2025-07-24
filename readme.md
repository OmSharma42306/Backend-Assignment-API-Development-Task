# KPA Backend API

This is a backend service for managing form submissions such as **Wheel Specifications**. The project is built using **FastAPI** and is fully Dockerized for easy deployment.

---

## 🚀 Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: PostgreSQL (NeonDB)
- **ORM**: SQLAlchemy
- **Schema Validation**: Pydantic
- **Environment Configuration**: `python-dotenv`
- **Containerization**: Docker
- **API Docs**: Swagger UI (auto-generated)

---

---

# Bonus Features Implemented

✅ Dockerized FastAPI backend

✅ Environment-based config using .env

✅ Swagger/OpenAPI documentation out of the box

✅ Input validation and error handling via Pydantic

✅ Modular file structure using routers, schemas, db modules

---

## 📦 Project Setup

### 🔧 Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/OmSharma42306/Backend-Assignment-API-Development-Task.git
   cd kpa-backend

2. **Create and activate virtual environment**
    
    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt

4. **Create a .env file:**
    DB_URL=postgresql+psycopg2://user:password@host:port/dbname

5. **Run The App **
    uvicorn main:app --reload

6. **Access API docs**

    Swagger UI: [http://localhost:8000/docs]

    Redoc: [http://localhost:8000/redoc]


# 🐳 Docker Usage

1. **Build the Docker image**
    
    ```bash
    docker build -t kpa-backend-app .

2. **Run the container**
    
    ```
    docker run -p 8000:8000 -e DB_URL="" kpa-backend-app


# Flutter App Setup

1. ```
    cd KPA-ERP-FE

2. ```
    flutter pub get

3. ```
    flutter run