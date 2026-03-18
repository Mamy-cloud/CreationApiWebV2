from typing import List
from pydantic import BaseModel, Field, field_validator
import re


class ColumnRename(BaseModel):
    old_name: str = Field(..., description="Nom actuel de la colonne", example="name")
    new_name: str = Field(..., description="Nouveau nom de la colonne", example="full_name")

    @field_validator("old_name", "new_name")
    @classmethod
    def validate_column_name(cls, v: str) -> str:
        pattern = r"^[a-zA-Z_][a-zA-Z0-9_]*$"
        if not re.match(pattern, v):
            raise ValueError(f"Nom de colonne invalide : {v}")
        return v


class RenameColumnsModelPostgreSync(BaseModel):
    columns: List[ColumnRename] = Field(
        ...,
        description="Liste des colonnes à renommer"
    )

    @field_validator("columns")
    @classmethod
    def validate_not_empty(cls, v: List[ColumnRename]):
        if not v:
            raise ValueError("La liste des colonnes ne peut pas être vide")
        return v