from pydantic import BaseModel, field_validator
from typing import List
import re

class ModelDeleteColumnsPostgre(BaseModel):
    columns: List[str]

    model_config = {
        "extra": "forbid"  # interdit les champs supplémentaires dans le JSON
    }

    # ✅ Validation pour s'assurer que les noms des colonnes ne contiennent que lettres, chiffres et underscore
    @field_validator("columns", mode="before")
    def check_valid_column_names(cls, v):
        def valid_name(name: str) -> bool:
            return bool(re.match(r'^[A-Za-z_][A-Za-z0-9_]*$', name))

        if not isinstance(v, list) or not v:
            raise ValueError("La liste des colonnes ne peut pas être vide")

        for col in v:
            if not valid_name(col):
                raise ValueError(f"Nom de colonne invalide : {col}")
        return v