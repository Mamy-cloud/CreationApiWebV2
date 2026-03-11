// schema_json.js

export function buildSchemaJsonPostgre(schemaName) {
    if (!schemaName || !schemaName.trim()) {
        throw new Error("Le nom du schéma est vide");
    }

    return {
        schema_name: schemaName.trim()
    };
}