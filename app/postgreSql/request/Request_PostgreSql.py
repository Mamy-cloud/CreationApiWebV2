from psycopg2 import sql
import re

def create_schema_query(schema_name: str):
    """
    Génère une requête sécurisée pour créer un schéma.
    """
    return sql.SQL("CREATE SCHEMA {}").format(
        sql.Identifier(schema_name)
    )

#----------------------liste schema et table-----------------------------
def get_schema_table(cursor):
    cursor.execute("""
        SELECT json_agg(schema_data) AS schemas
        FROM (
            SELECT 
                n.nspname AS schema_name,
                (
                    SELECT json_agg(t.tablename)
                    FROM pg_tables t
                    WHERE t.schemaname = n.nspname
                ) AS table_name
            FROM pg_namespace n
            WHERE n.nspname NOT LIKE 'pg_%'
              AND n.nspname != 'information_schema'
        ) AS schema_data;
    """)
    
    row = cursor.fetchone()  # RealDictCursor renvoie un dict
    return row['schemas']    # renvoie directement la liste JSON

#-------------------------------post create table---------------------------------

def safe_identifier(name: str) -> str:
    """
    Sécurise les noms de table et de colonnes.
    Autorise uniquement lettres, chiffres et underscore.
    """
    if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", name):
        raise ValueError(f"Nom invalide : {name}")
    return name


#-------------------------------createTable------------------------------------------

def create_table_sql(schema_name: str, table_name: str, columns: list[dict]) -> str:
    """
    Génère une requête CREATE TABLE simple.
    columns : liste de dicts { "column_name": str, "type": str }
    """
    sql = f'CREATE TABLE {schema_name}.{table_name} (\n'
    sql += '    id SERIAL PRIMARY KEY,\n'

    for col in columns:
        sql += f'    {col["column_name"]} {col["type_of_column"]},\n'

    sql = sql.rstrip(",\n") + "\n);\n"
    return sql

#-----------------------------------get table----------------------------------------


# Request_PostgreSql.py


# Request_PostgreSql.py
def get_table_PostgreSql_safe(schema_name: str, table_name: str):
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', table_name):
        raise ValueError(f"Nom de table invalide : {table_name}")
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', schema_name):
        raise ValueError(f"Nom de schéma invalide : {schema_name}")

    columns_query = f"""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = '{schema_name}' AND table_name = '{table_name}'
        ORDER BY ordinal_position;
    """

    rows_query = f'SELECT * FROM "{schema_name}"."{table_name}";'

    return columns_query, rows_query

# -------------------- post table_name ----------------------------------

def post_rename_table_sql(schema_name: str, old_name: str, new_name: str):
    """
    Retourne la requête SQL sécurisée pour renommer une table
    PostgreSQL dans un schéma spécifique.
    """
    query = sql.SQL("ALTER TABLE {}.{} RENAME TO {}").format(
        sql.Identifier(schema_name),
        sql.Identifier(old_name),
        sql.Identifier(new_name)
    )
    return query

# -------------------- add columns to table --------------------

def post_add_columns(schema_name: str, table_name: str, columns: list):

    add_column_clauses = [
        sql.SQL("ADD COLUMN {} {}").format(
            sql.Identifier(col["column_name"]),
            sql.SQL(col["type_of_column"])
        )
        for col in columns
    ]

    query = sql.SQL("ALTER TABLE {}.{} {}").format(
        sql.Identifier(schema_name),
        sql.Identifier(table_name),
        sql.SQL(", ").join(add_column_clauses)
    )

    return query

#-------------------add rows-------------------------------------
def build_insert_query(tuple_data):
    """
    Génère une requête SQL INSERT INTO schema.table (...) VALUES (...)
    - tuple_data : (schema_name, table_name, columns, rows)
    """
    schema_name, table_name, columns, rows = tuple_data

    col_str = ", ".join(columns)

    values_str = ", ".join(
        "(" + ", ".join(
            "NULL" if val is None else repr(val) for val in row
        ) + ")"
        for row in rows
    )

    sql_query = f'INSERT INTO "{schema_name}"."{table_name}" ({col_str}) VALUES {values_str};'

    return sql_query

#--------------------------------rename column----------------------------
def generate_rename_columns_queries(schema_name: str, table_name: str, rename_map: dict) -> list[str]:
    """
    Génère une liste de requêtes SQL pour renommer une ou plusieurs colonnes
    de manière sécurisée (protège contre l'injection SQL).

    :param schema_name: nom du schema
    :param table_name: nom de la table
    :param rename_map: dictionnaire {ancien_nom: nouveau_nom}
    :return: liste de chaînes SQL
    """
    # Fonction simple pour sécuriser les identifiants (colonne, table, schema)
    def safe_identifier(name: str) -> str:
        if not name.replace("_", "").isalnum():
            raise ValueError(f"Nom invalide : {name}")
        return f'"{name}"'

    schema = safe_identifier(schema_name)
    table = safe_identifier(table_name)

    queries = []
    for old_col, new_col in rename_map.items():
        old = safe_identifier(old_col)
        new = safe_identifier(new_col)
        queries.append(f'ALTER TABLE {schema}.{table} RENAME COLUMN {old} TO {new};')

    return queries