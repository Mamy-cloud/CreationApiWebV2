import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from dotenv import load_dotenv
import os
load_dotenv()


# -------------------------
# CONFIGURATION POSTGRESQL TEST
# -------------------------

# ⚠️ Mets ici ta base de test (pas ta base production)
SQLALCHEMY_DATABASE_URL = os.getenv("DATA_URL_POSTGRESQL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# -------------------------
# OVERRIDE DEPENDANCE DB
# -------------------------

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[connect_to_db] = override_get_db

client = TestClient(app)


# -------------------------
# TEST
# -------------------------

def test_create_table_public_schema():

    # Nettoyage avant test
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS public.essai CASCADE"))
        conn.commit()

    payload = {
        "schema_name": "public",
        "table_name": "essai",
        "columns": [
            {
                "column_name": "fer",
                "type_of_column": "INTEGER"
            }
        ]
    }

    response = client.post("/admin/create_table", json=payload)

    print(response.json())  # utile si erreur

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "CREATE TABLE" in response.json()["sql"]

    # Vérifie que la table existe vraiment dans PostgreSQL
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'essai'
            """)
        )
        table = result.fetchone()

    assert table is not None