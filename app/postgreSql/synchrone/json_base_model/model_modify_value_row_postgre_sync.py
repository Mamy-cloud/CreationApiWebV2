from typing import List, Optional, Any
from pydantic import BaseModel

class ColumnRowItem(BaseModel):
    column_name: str
    new_value: Optional[Any]

class ModifyValueRowModelPostgreSync(BaseModel):
    schema_name: str
    table_name: str
    row_id: int
    columns: List[ColumnRowItem]