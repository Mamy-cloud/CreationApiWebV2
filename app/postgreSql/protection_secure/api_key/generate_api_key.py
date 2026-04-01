import secrets
import hashlib

def generate_hashed_api_key() -> str:
    """
    Génère une clé API aléatoire sécurisée et retourne directement son hash SHA-256.
    
    Returns:
        str: hash hexadécimal de la clé API
    """
    # Génération de la clé API et hashage en une seule étape
    api_key_hash = hashlib.sha256(secrets.token_urlsafe(32).encode('utf-8')).hexdigest()
    return api_key_hash