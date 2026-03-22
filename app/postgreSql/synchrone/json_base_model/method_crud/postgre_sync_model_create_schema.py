from pydantic import BaseModel

class PostgreSyncSchemaCreate(BaseModel):
    schema_name: str