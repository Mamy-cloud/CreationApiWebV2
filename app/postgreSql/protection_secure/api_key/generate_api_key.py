import secrets
import hashlib
from datetime import datetime, timedelta

def generate_api_key():
    api_key = secrets.token_urlsafe(32)
    return api_key
