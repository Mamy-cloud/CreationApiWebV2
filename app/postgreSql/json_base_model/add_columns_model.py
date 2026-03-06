from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List
from app.postgreSql.json_base_model.type_data import SQL_TYPES, map_type_to_postgres

# Liste plate de tous les types autorisés
ALL_SQL_TYPES = [t for sublist in SQL_TYPES.values() for t in sublist]


class ColumnDefinition(BaseModel):
    column_name: str = Field(..., example="fer")
    type_of_column: str = Field(..., example="INTEGER")

    @field_validator("type_of_column")
    @classmethod
    def check_type(cls, v: str) -> str:
        # Convertit si besoin (ex: URL -> TEXT)
        pg_type = map_type_to_postgres(v)

        if pg_type not in ALL_SQL_TYPES:
            raise ValueError(
                f"Type invalide : {v}. Types autorisés : {ALL_SQL_TYPES}"
            )

        return pg_type


class AddColumnsRequest(BaseModel):
    schema_name: str = Field(..., example="public")
    table_name: str = Field(..., example="produits")
    columns: List[ColumnDefinition]

    @model_validator(mode="after")
    def check_columns_not_empty(self):
        if not self.columns:
            raise ValueError("Au moins une colonne doit être définie")
        return self