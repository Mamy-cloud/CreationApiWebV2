# protection_hash_password_postgre.py

import bcrypt

def hash_password(password: str) -> str:
    """
    Hache un mot de passe en utilisant bcrypt.
    
    Args:
        password (str): mot de passe en clair.
    
    Returns:
        str: hash sécurisé à stocker en base de données.
    """
    # Génère le hash avec un salt aléatoire
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Convertit en string pour stockage dans PostgreSQL
    return hashed.decode('utf-8')


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """
    Vérifie si un mot de passe correspond au hash stocké dans la base.
    
    Args:
        plain_password (str): mot de passe envoyé par l'utilisateur.
        stored_hash (str): hash récupéré depuis PostgreSQL via psycopg2.
    
    Returns:
        bool: True si le mot de passe correspond, False sinon.
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), stored_hash.encode('utf-8'))