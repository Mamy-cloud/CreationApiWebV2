from psycopg2 import sql

#-----------------------creation auto db if not exist------------------------
def request_create_db_login_if_not_exist(cur):
    SCHEMA_NAME_POSTGRE_LOGIN = "login_schema_db_create_api"
    TABLE_NAME_POSTGRE_LOGIN = "login_table_db_create_api"

    query = sql.SQL("""
        DO $$
        BEGIN
            -- 🔹 Création du schéma si non existant
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.schemata
                WHERE schema_name = {schema}
            ) THEN
                EXECUTE format('CREATE SCHEMA %I', {schema});
            END IF;

            -- 🔹 Création de la table si non existante
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = {schema}
                AND table_name = {table}
            ) THEN
                EXECUTE format(
                    'CREATE TABLE %I.%I (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW()
                    )',
                    {schema}, {table}
                );
            END IF;
        END
        $$;
    """).format(
        schema=sql.Literal(SCHEMA_NAME_POSTGRE_LOGIN),
        table=sql.Literal(TABLE_NAME_POSTGRE_LOGIN)
    )

    cur.execute(query)