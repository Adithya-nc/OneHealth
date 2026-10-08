import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-replace-in-prod')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')
    MOCK_MODE = os.getenv('MOCK_MODE', 'True') == 'True'
