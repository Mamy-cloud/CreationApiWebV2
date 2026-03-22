from pydantic import BaseModel, field_validator
from typing import List
from app.postgreSql.synchrone.json_base_model.type_data import SQL_TYPES, map_type_to_postgres


# -------------------------
# Modèle pour une colonne
# -------------------------
class ColumnItem(BaseModel):
    column_name: str
    type_of_column: str

    """ @field_validator("type_of_column")
    @classmethod
    def validate_column_type(cls, value: str) -> str:
        # Récupération de tous les types SQL autorisés
        valid_types = [
            item for sublist in SQL_TYPES.values()
            for item in sublist
        ]

        if value not in valid_types:
            raise ValueError(
                f"Type de colonne invalide : {value}. "
                f"Types valides: {valid_types}"
            )

        return value """
    @field_validator("type_of_column")
    @classmethod
    def validate_column_type(cls, value: str) -> str:

        valid_types = [
            item for sublist in SQL_TYPES.values()
            for item in sublist
        ]

        if value not in valid_types:
            raise ValueError(
                f"Type de colonne invalide : {value}. "
                f"Types valides: {valid_types}"
            )

        # transformation ici
        return map_type_to_postgres(value)


# -------------------------
# Modèle pour création table
# -------------------------
class CreateTableModelPostgreSync(BaseModel):
    schema_name: str
    table_name: str
    columns: List[ColumnItem]

    @field_validator("columns")
    @classmethod
    def validate_columns(cls, value: List[ColumnItem]) -> List[ColumnItem]:

        if not value:
            raise ValueError("La liste des colonnes ne peut pas être vide.")

        for col in value:
            mapped_type = map_type_to_postgres(col.type_of_column)

            if not mapped_type:
                raise ValueError(
                    f"Type de colonne invalide pour "
                    f"{col.column_name}: {col.type_of_column}"
                )

        return value