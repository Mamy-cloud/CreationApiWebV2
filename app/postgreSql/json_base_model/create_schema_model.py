from pydantic import BaseModel

class SchemaCreate(BaseModel):
    schema_name: str