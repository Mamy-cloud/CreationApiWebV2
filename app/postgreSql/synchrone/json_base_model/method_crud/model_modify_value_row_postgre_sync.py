from typing import List, Optional, Any
from pydantic import BaseModel, Field

class ColumnModifyItem(BaseModel):
    column_name: str = Field(..., description="Nom de la colonne à modifier")
    new_value: Optional[Any] = Field(None, description="Nouvelle valeur de la colonne")

class ModifyRowModelPostgreSync(BaseModel):
    row_id: int = Field(..., description="ID de la ligne à modifier")
    columns: List[ColumnModifyItem] = Field(..., description="Liste des colonnes à modifier")