from psycopg2 import sql, connect
import re
from typing import List, Dict


def postgre_sync_request_create_schema_query(schema_name: str):
    """
    Génère une requête sécurisée pour créer un schéma.
    """
    return sql.SQL("CREATE SCHEMA {}").format(
        sql.Identifier(schema_name)
    )

#----------------------liste schema et table-----------------------------
def postgre_sync_get_schema_table(cursor):
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

def postgre_sync_request_create_table_sql(schema_name: str, table_name: str, columns: list[dict]) -> str:
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
def request_get_table_PostgreSql_sync_safe(schema_name: str, table_name: str):
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

# -------------------- post table_rename ----------------------------------


def request_post_rename_table_postgre_sync(
    schema_name: str,
    old_name: str,
    new_name: str
):
    """
    Génère une requête SQL sécurisée pour renommer une table PostgreSQL
    en évitant toute injection SQL.
    """

    # 🔒 Validation supplémentaire (optionnelle mais recommandée)
    pattern = r"^[a-zA-Z_][a-zA-Z0-9_]*$"

    for value, field in [
        (schema_name, "schema_name"),
        (old_name, "old_name"),
        (new_name, "new_name")
    ]:
        if not re.match(pattern, value):
            raise ValueError(f"Nom invalide pour {field} : {value}")

    # ✅ Requête sécurisée avec psycopg2.sql
    query = sql.SQL("ALTER TABLE {}.{} RENAME TO {}").format(
        sql.Identifier(schema_name),
        sql.Identifier(old_name),
        sql.Identifier(new_name)
    )

    return query

# -------------------- add columns to table --------------------

def request_post_add_columns_postgre_sync(schema_name: str, table_name: str, columns: list):

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
def request_post_add_row_postgre_sync(schema_name: str, table_name: str, tuple_data: tuple):
    """
    Génère une requête SQL INSERT INTO schema.table (...) VALUES (...)
    - schema_name, table_name : path params
    - tuple_data : (columns, rows_as_lists)
    """
    columns, rows = tuple_data

    col_str = ", ".join(columns)

    values_str = ", ".join(
        "(" + ", ".join("NULL" if val is None else repr(val) for val in row) + ")"
        for row in rows
    )

    sql_query = f'INSERT INTO "{schema_name}"."{table_name}" ({col_str}) VALUES {values_str};'
    return sql_query

#--------------------------------rename column----------------------------



def request_rename_columns_postgre_sync(
    schema_name: str,
    table_name: str,
    rename_list: List[Dict[str, str]]
):
    """
    Génère une liste de requêtes SQL sécurisées pour renommer
    plusieurs colonnes dans PostgreSQL.

    :param schema_name: nom du schema
    :param table_name: nom de la table
    :param rename_list: liste [{"old_name": "...", "new_name": "..."}]
    :return: liste de requêtes SQL psycopg2
    """

    pattern = r"^[a-zA-Z_][a-zA-Z0-9_]*$"

    def validate(name: str, field: str):
        if not isinstance(name, str) or not re.match(pattern, name):
            raise ValueError(f"Nom invalide pour {field} : {name}")

    # 🔒 Validation schema/table
    validate(schema_name, "schema_name")
    validate(table_name, "table_name")

    queries = []

    for item in rename_list:
        old_col = item.get("old_name")
        new_col = item.get("new_name")

        if not old_col or not new_col:
            raise ValueError(f"Format invalide : {item}")

        validate(old_col, "old_column")
        validate(new_col, "new_column")

        query = sql.SQL("ALTER TABLE {}.{} RENAME COLUMN {} TO {}").format(
            sql.Identifier(schema_name),
            sql.Identifier(table_name),
            sql.Identifier(old_col),
            sql.Identifier(new_col)
        )

        queries.append(query)

    return queries

#---------------------------put modify value row----------------------------------
# Request_PostgreSql.py

# Request_PostgreSql.py
from psycopg2 import sql
from typing import List, Tuple, Dict, Any

def request_update_row_postgre_sync(
    schema_name: str,
    table_name: str,
    row_id: int,
    columns: List[Dict[str, Any]]
) -> Tuple[sql.SQL, list]:
    
    if not columns:
        raise ValueError("Aucune colonne à mettre à jour")

    # Construire la clause SET de manière sécurisée
    set_clause = sql.SQL(", ").join(
        sql.SQL("{} = %s").format(sql.Identifier(col["column_name"]))
        for col in columns
    )

    # Construire la requête complète
    query = sql.SQL("UPDATE {}.{} SET {} WHERE id = %s").format(
        sql.Identifier(schema_name),
        sql.Identifier(table_name),
        set_clause
    )

    # Préparer les valeurs
    values = [col["new_value"] for col in columns] + [row_id]

    return query, values

#----------------rename schema----------------------------


def request_rename_schema_postgre_sync(conn, old_name: str, new_name: str):
    try:
        with conn.cursor() as cursor:
            query = sql.SQL("ALTER SCHEMA {} RENAME TO {}").format(
                sql.Identifier(old_name),
                sql.Identifier(new_name)
            )
            cursor.execute(query)
        conn.commit()
        return {"message": "Schema renommé avec succès"}
    
    except Exception as e:
        conn.rollback()
        raise Exception(f"Erreur : {str(e)}")
    
#---------------supprimer la table------------------------

def request_delete_table_postgre_sync(schema_name: str, table_name: str):
    if not schema_name or not table_name:
        raise ValueError("schema_name and table_name are required")

    return sql.SQL("DROP TABLE IF EXISTS {}.{} CASCADE").format(
        sql.Identifier(schema_name),
        sql.Identifier(table_name)
    )

#------------------------supprimer une ou plusieurs colonnes---------------



def request_delete_columns_postgre_sync(schema_name: str, table_name: str, columns: List[str]) -> str:
    """
    Génère une requête SQL sécurisée pour supprimer une ou plusieurs colonnes
    dans PostgreSQL, en filtrant les noms pour éviter l'injection SQL.

    Args:
        schema_name (str): nom du schéma PostgreSQL
        table_name (str): nom de la table
        columns (List[str]): liste de colonnes à supprimer

    Returns:
        str: requête SQL ALTER TABLE
    """

    # Regex autorisant uniquement lettres, chiffres et underscore
    valid_name_regex = re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')

    # Vérification du schéma et table
    if not isinstance(schema_name, str) or not valid_name_regex.match(schema_name):
        raise ValueError(f"Nom de schéma invalide : {schema_name}")
    if not isinstance(table_name, str) or not valid_name_regex.match(table_name):
        raise ValueError(f"Nom de table invalide : {table_name}")

    # Vérification que columns est une liste de strings
    if not isinstance(columns, list) or not all(isinstance(c, str) for c in columns):
        raise ValueError("columns doit être une liste de chaînes de caractères")
    if not columns:
        raise ValueError("La liste des colonnes à supprimer est vide.")

    # Vérification et filtrage des colonnes
    for col in columns:
        if not valid_name_regex.match(col):
            raise ValueError(f"Nom de colonne invalide : {col}")

    # Construction sécurisée de la requête
    columns_sql = ",\n  ".join([f'DROP COLUMN IF EXISTS "{col}"' for col in columns])
    query = f'ALTER TABLE "{schema_name}"."{table_name}"\n  {columns_sql};'

    return query