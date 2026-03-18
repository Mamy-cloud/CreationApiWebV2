from typing import ClassVar, Set
from pydantic import BaseModel, field_validator
import re

class RenameSchemaModelPostgre(BaseModel):
    schema_name: str
    new_schema_name: str

    # Interdire les schemas système (ClassVar pour dire que ce n'est pas un champ)
    SYSTEM_SCHEMAS: ClassVar[Set[str]] = {"pg_catalog", "information_schema", "pg_toast"}

    @field_validator("schema_name")
    @classmethod
    def validate_schema_name(cls, v):
        v = v.strip()
        if v in cls.SYSTEM_SCHEMAS or v.startswith("pg_"):
            print(f"⚠️ Le schema '{v}' est un schema système et ne peut pas être renommé")
            raise ValueError(f"Le schema '{v}' est un schema système et ne peut pas être renommé.")
        return v

    @field_validator("new_schema_name")
    @classmethod
    def validate_new_schema_name(cls, v):
        v = v.strip()
        # doit commencer par lettre ou _, puis lettres, chiffres ou _
        if not re.match(r"^[a-zA-Z_][a-zA-Z0-9_]*$", v):
            raise ValueError(
                "Nom du schema invalide. Utilisez uniquement lettres, chiffres et underscore, et commencez par une lettre ou _."
            )
        return v