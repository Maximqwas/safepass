from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from password_strength import PasswordStats  # импортируем
import random
import string
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafePass Backend MVP")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    password: str

@app.post("/api/check")
def check_password(req: PasswordRequest):
    password = req.password
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")

    stats = PasswordStats(password)
    strength = stats.strength()  # значение от 0.0 до ~1.0  :contentReference[oaicite:2]{index=2}
    # Преобразуем в шкалу 0..100
    score_percent = int(strength * 100)

    suggestions = []
    warning = None
    message = None

    if len(password) < 8:
        suggestions.append("Пароль повинен бути не менше 8 символів")

    if score_percent < 50:
        warning = "Пароль занадто слабкий!"
        suggestions.append("Збільште довжину пароля до 12+ символів")
        suggestions.append("Уникайте повторюваних символів")
        suggestions.append("Не використовуйте особисту інформацію")
    elif score_percent < 75:
        suggestions.append("Збільште довжину пароля")
    else:
        message = "Пароль сильний!"

    # Проверки на наличие символов
    if not any(c.isupper() for c in password):
        suggestions.append("Додайте велику літеру")
    if not any(c.islower() for c in password):
        suggestions.append("Додайте малу літеру")
    if not any(c.isdigit() for c in password):
        suggestions.append("Додайте цифру")
    if not any(c in "!@#$%^&*()" for c in password):
        suggestions.append("Додайте спеціальний символ")

    return {
        "score_percent": score_percent,
        "entropy_bits": stats.entropy_bits,
        "alphabet_size": stats.alphabet_cardinality,
        "feedback": {
            "suggestions": suggestions,
            "warning": warning,
            "message": message
        }
    }

@app.get("/api/generate")
def generate_password(length: int = 12):
    if length < 6 or length > 32:
        raise HTTPException(status_code=400, detail="Length must be between 6 and 32")
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    password = ''.join(random.choice(chars) for _ in range(length))
    return {"password": password}
