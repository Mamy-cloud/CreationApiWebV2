
from .postgreSql.json_base_model.create_table_model import CreateTableRequest, ColumnItem
from pydantic import ValidationError

# Exemple de données valides
test_data_valid = {
  "schema_name": "select",
  "table_name": "essai",
  "columns": [
    {
      "column_name": "fer",
      "type_of_column": "INTEGER"
    }
  ]
}


# Vérification des données valides
try:
    valid_model = CreateTableRequest(**test_data_valid)
    print("Valid model:", valid_model)
except ValidationError as e:
    print("Validation error:", e)

# Vérification des données invalides
""" try:
    invalid_model = CreateTableRequest(**test_data_invalid)
except ValidationError as e:
    print("Validation error:", e) """