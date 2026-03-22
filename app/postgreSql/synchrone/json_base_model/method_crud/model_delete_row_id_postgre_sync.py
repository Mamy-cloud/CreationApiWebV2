from pydantic import BaseModel, Field

class ModelDeleteRowPostgre(BaseModel):
    row_id: int = Field(..., description="ID de la ligne à supprimer dans PostgreSQL")