from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import zxcvbn
import random
import string
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafePass Backend MVP")
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # разрешаем все методы: GET, POST, OPTIONS
    allow_headers=["*"],      # разрешаем все заголовки
)
# -------------------------------
# Request models
# -------------------------------
class PasswordRequest(BaseModel):
    password: str

# -------------------------------
# API: Проверка пароля
# -------------------------------
@app.post("/api/check")
def check_password(req: PasswordRequest):
    password = req.password
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    
    result = zxcvbn.zxcvbn(password)

    return {
        "score": result['score'],  # 0-4
        "guesses": result['guesses'],
        "guesses_log10": result['guesses_log10'],
        "crack_times_seconds": result['crack_times_seconds'],
        "feedback": result['feedback']
    }

# -------------------------------
# API: Генерация пароля
# -------------------------------
@app.get("/api/generate")
def generate_password(length: int = 12):
    if length < 6 or length > 32:
        raise HTTPException(status_code=400, detail="Length must be between 6 and 32")
    
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    password = ''.join(random.choice(chars) for _ in range(length))
    return {"password": password}
