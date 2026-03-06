""" from typing import List, Dict, Any
from pydantic import BaseModel, field_validator
from datetime import datetime, date, time
from app.postgreSql.json_base_model.type_data import map_type_to_postgres, DEFAULT_VALUES, SQL_TYPES


class AddRowsRequest(BaseModel):

    schema_name: str
    table_name: str
    columns: List[str]
    rows: List[Dict[str, Any]]

    @field_validator("columns")
    @classmethod
    def remove_id_from_columns(cls, v: List[str]) -> List[str]:
        
        return [col for col in v if col != "id"]

    def cast_values(self, row: Dict[str, Any]) -> Dict[str, Any]:
        
        new_row = {}

        for key in self.columns:
            val = row.get(key)

            # Par défaut TEXT (comme dans ton code)
            pg_type = map_type_to_postgres("TEXT")

            if val is None:
                new_row[key] = DEFAULT_VALUES[pg_type]
                continue

            try:
                if pg_type in SQL_TYPES["numeric"]:
                    new_row[key] = int(val) if str(val).isdigit() else float(val)

                elif pg_type in SQL_TYPES["boolean"]:
                    new_row[key] = str(val).lower() in ["true", "1", "yes"]

                elif pg_type in SQL_TYPES["datetime"]:
                    if pg_type == "DATE":
                        new_row[key] = date.fromisoformat(val)
                    elif pg_type == "TIME":
                        new_row[key] = time.fromisoformat(val)
                    elif pg_type == "TIMESTAMP":
                        new_row[key] = datetime.fromisoformat(val)

                else:
                    new_row[key] = str(val)

            except Exception:
                new_row[key] = DEFAULT_VALUES[pg_type]

        return new_row

    def to_tuple(self) -> tuple:
        

        rows_as_lists = [
            [self.cast_values(row)[col] for col in self.columns]
            for row in self.rows
        ]

        return (
            self.schema_name,
            self.table_name,
            self.columns,
            rows_as_lists
        ) """

from typing import List, Dict, Any
from pydantic import BaseModel, field_validator
from datetime import datetime, date, time
from app.postgreSql.json_base_model.type_data import map_type_to_postgres, SQL_TYPES


class AddRowsRequest(BaseModel):

    schema_name: str
    table_name: str
    columns: List[str]
    rows: List[Dict[str, Any]]

    @field_validator("columns")
    @classmethod
    def remove_id_from_columns(cls, v: List[str]) -> List[str]:
        return [col for col in v if col != "id"]

    def cast_values(self, row: Dict[str, Any]) -> Dict[str, Any]:
        new_row = {}

        for key in self.columns:
            val = row.get(key)

            # Par défaut TEXT
            pg_type = map_type_to_postgres("TEXT")

            if val is None:
                # Laisser None pour générer NULL dans SQL
                new_row[key] = None
                continue

            try:
                if pg_type in SQL_TYPES["numeric"]:
                    new_row[key] = int(val) if str(val).isdigit() else float(val)

                elif pg_type in SQL_TYPES["boolean"]:
                    new_row[key] = str(val).lower() in ["true", "1", "yes"]

                elif pg_type in SQL_TYPES["datetime"]:
                    if pg_type == "DATE":
                        new_row[key] = date.fromisoformat(val)
                    elif pg_type == "TIME":
                        new_row[key] = time.fromisoformat(val)
                    elif pg_type == "TIMESTAMP":
                        new_row[key] = datetime.fromisoformat(val)

                else:
                    new_row[key] = str(val)

            except Exception:
                new_row[key] = None

        return new_row

    def to_tuple(self) -> tuple:
        rows_as_lists = [
            [self.cast_values(row)[col] for col in self.columns]
            for row in self.rows
        ]

        return (
            self.schema_name,
            self.table_name,
            self.columns,
            rows_as_lists
        )