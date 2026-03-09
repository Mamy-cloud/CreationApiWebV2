SQL_TYPES = {
    "numeric": ["INTEGER", "SMALLINT", "BIGINT", "DECIMAL", "REAL", "DOUBLE PRECISION"],
    "char": ["CHAR", "VARCHAR", "TEXT"],
    "boolean": ["BOOLEAN"],
    "datetime": ["DATE", "TIME", "TIMESTAMP"],
    "money": ["MONEY", "NUMERIC"],
    "url": ["URL"]  # ✅ les URL sont stockées en TEXT
}

DEFAULT_VALUES = {
    "INTEGER": "0",
    "SMALLINT": "0",
    "BIGINT": "0",
    "DECIMAL": "0.0",
    "REAL": "0.0",
    "DOUBLE PRECISION": "0.0",
    "CHAR": "''",
    "VARCHAR": "''",
    "TEXT": "''",
    "BOOLEAN": "FALSE",
    "DATE": "CURRENT_DATE",
    "TIME": "CURRENT_TIME",
    "TIMESTAMP": "CURRENT_TIMESTAMP",
    "MONEY": "0",
    "NUMERIC": "0",
    "URL": "''"
}

def map_type_to_postgres(type_name: str) -> str: 
    """Traduit un type affiché dans le front-end vers un type PostgreSQL valide.""" 
    if type_name == "URL": 
        return "TEXT" 
    return type_name