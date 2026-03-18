from pydantic import BaseModel

class RenameSchemaModelPostgre(BaseModel):
    schema_name: str
    new_schema_name: str