from pydantic import BaseModel, Field

class ModelVerifyLogPostgre(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password_hash: str = Field(..., min_length=6, max_length=128)