from typing import List
from pydantic import BaseModel, Field

class ColumnRename(BaseModel):
    old_name_name: str = Field(..., description="Nom actuel de la colonne")
    new_name: str = Field(..., description="Nouveau nom de la colonne")

class RenameColumnsModelPostgreSync(BaseModel):
    schema_name: str = Field(..., description="Nom du schema PostgreSQL")
    table_name: str = Field(..., description="Nom de la table")
    columns: List[ColumnRename] = Field(..., description="Liste des colonnes à renommer")