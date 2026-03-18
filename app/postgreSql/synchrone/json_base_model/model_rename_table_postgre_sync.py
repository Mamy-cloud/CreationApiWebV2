from pydantic import BaseModel, Field

class RenameTableModelPostgreSync(BaseModel):
    new_name: str = Field(..., example="customers")