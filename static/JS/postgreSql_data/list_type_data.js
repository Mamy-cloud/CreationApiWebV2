const SQL_TYPES = {
    "numeric": ["INTEGER", "SMALLINT", "BIGINT", "DECIMAL", "REAL", "DOUBLE PRECISION"],
    "char": ["CHAR", "VARCHAR", "TEXT"],
    "boolean": ["BOOLEAN"],
    "datetime": ["DATE", "TIME", "TIMESTAMP"], // ✅ DATETIME supprimé
    "money": ["MONEY", "NUMERIC"],             // NUMERIC est plus sûr pour les montants
    "url": ["URL"]                            // ✅ les URL sont stockées en TEXT
};

const DEFAULT_VALUES = {
    "INTEGER": "DEFAULT 0",
    "SMALLINT": "DEFAULT 0",
    "BIGINT": "DEFAULT 0",
    "DECIMAL": "DEFAULT 0.0",
    "REAL": "DEFAULT 0.0",
    "DOUBLE PRECISION": "DEFAULT 0.0",
    "CHAR": "DEFAULT ''",
    "VARCHAR": "DEFAULT ''",
    "TEXT": "DEFAULT ''",
    "BOOLEAN": "DEFAULT FALSE",
    "DATE": "DEFAULT CURRENT_DATE",
    "TIME": "DEFAULT CURRENT_TIME",
    "TIMESTAMP": "DEFAULT CURRENT_TIMESTAMP",
    "MONEY": "DEFAULT 0",
    "NUMERIC": "DEFAULT 0",
    "URL": "DEFAULT ''" // ✅ utilisé pour stocker les liens
};



// list_type_data.js
export function createTypeSelect(name = "type_of_column", id = null) {
    const select = document.createElement("select");
    select.name = name;
    if (id) select.id = id;

    Object.values(SQL_TYPES).flat().forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });

    return select;
}
