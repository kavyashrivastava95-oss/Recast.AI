import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    app_name: str = "Recast AI - Autonomous Enterprise Data Migration Agent"
    version: str = "1.0.0"
    port: int = int(os.getenv("PORT", "8001"))
    host: str = os.getenv("HOST", "0.0.0.0")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    enable_gpu_ocr: bool = os.getenv("ENABLE_GPU_OCR", "false").lower() == "true"
    salt_secret: str = os.getenv("SALT_SECRET", "recast_enterprise_aes256_salt_token")

settings = Settings()
