from pydantic import BaseModel
from typing import Dict, Optional, Any


class ModifyValueRowRequest(BaseModel):
    schema_name: str
    table_name: str
    row_id: int
    column_updates: Dict[str, Optional[Any]]