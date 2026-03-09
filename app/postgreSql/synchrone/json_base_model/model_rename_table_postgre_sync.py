from pydantic import BaseModel, Field

class RenameTableModelPostgreSync(BaseModel):
    schema_name: str = Field(..., example="public")
    old_name: str = Field(..., example="users")
    new_name: str = Field(..., example="customers")