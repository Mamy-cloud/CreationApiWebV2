// list_schema.js

export function createSchemaSelectPostgre(data, defaultText = "Sélectionner un schema") {
    const select = document.createElement("select");

    // Option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultText;
    select.appendChild(defaultOption);

    // S'assurer que data est bien un tableau
    if (!Array.isArray(data)) {
        console.warn("createSchemaSelect reçu un format invalide :", data);
        return select; // retourne juste le select avec l'option par défaut
    }

    // Ajouter toutes les options de schema
    data.forEach(s => {
        if (s && s.schema_name) { // vérifier que schema_name existe
            const option = document.createElement("option");
            option.value = s.schema_name;
            option.textContent = s.schema_name;
            select.appendChild(option);
        }
    });

    return select;
}