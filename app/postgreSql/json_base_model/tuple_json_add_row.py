import json

def json_to_tuple(json_data: str):
    """
    Transforme un JSON en tuple :
    (schema_name, table_name, columns, rows)

    - json_data : chaîne JSON
    - ignore automatiquement la colonne 'id' si elle est présente
    """

    data = json.loads(json_data)

    schema_name = data["schema_name"]
    table_name = data["table_name"]
    columns = data["columns"]
    rows = data["rows"]

    # Supprimer automatiquement 'id' si présent
    if "id" in columns:
        columns = [col for col in columns if col != "id"]

    # Construire les tuples de valeurs dans l'ordre des colonnes
    rows_as_tuples = [
        tuple(row.get(col, None) for col in columns)
        for row in rows
    ]

    return (schema_name, table_name, columns, rows_as_tuples)