# model_delete_table_postgre.py
from pydantic import BaseModel, Field

class DeleteTablePostgre(BaseModel):
    schema_name: str = Field(..., description="Nom du schéma")
    table_name: str = Field(..., description="Nom de la table")

    model_config = {
        "extra": "forbid"
    }