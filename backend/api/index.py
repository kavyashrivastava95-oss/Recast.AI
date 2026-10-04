import sys
import os

# Add backend directory to sys.path so app modules are resolvable in Vercel Serverless runtime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

# Export FastAPI instance for Vercel Python runtime
__all__ = ["app"]
