import { renderSchemaTablePostgre } from "../component_ui/display_list_schema_table/display_table_schema_postgre.js";

async function getSchemas() {
    try {
        const response = await fetch("/app/postgre/sync/method_crud/get/schema_table");

        console.log("réponse backend:" ,response);
        
        const data = await response.json();
        console.log("réponse data:" , data);
        

        // Vérifier que data est bien un tableau
        if (!Array.isArray(data)) {
            console.error("Format invalide :", data);
            return;
        }

        renderSchemaTablePostgre(data); // 🔹 passer directement les données

    } catch (error) {
        console.error("Erreur GET schema :", error);
    }
}

getSchemas();