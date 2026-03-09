import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def postgre_sync_connect_to_db(database_url=None):
    if database_url is None:
        database_url = os.getenv("DATA_URL_POSTGRESQL")
        if not database_url:
            raise ValueError("Aucune URL de base de données fournie ni dans .env")

    # Psycopg2 < 2.9 ne gère pas channel_binding=require
    if "channel_binding=require" in database_url:
        database_url = database_url.replace("&channel_binding=require", "")

    conn = psycopg2.connect(
        database_url,
        cursor_factory=RealDictCursor,  # pour obtenir des dicts au lieu de tuples
        sslmode="require"               # nécessaire pour Neon
    )
    return conn

""" import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

# Pour recevoir l'URL depuis FastAPI
DATABASE_URL = None  # mis à jour par set_db_url

def connect_to_db(database_url=None):

    if database_url is None:
        database_url = DATABASE_URL #or os.getenv("DATA_URL_POSTGRESQL")
        if not database_url:
            raise ValueError("Aucune URL de base de données fournie ni dans .env")

    # Psycopg2 < 2.9 ne gère pas channel_binding=require
    if "channel_binding=require" in database_url:
        database_url = database_url.replace("&channel_binding=require", "")

    conn = psycopg2.connect(
        database_url,
        cursor_factory=RealDictCursor,  # retourne des dicts
        sslmode="require"               # nécessaire pour Neon
    )
    return conn """