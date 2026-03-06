import { renderSchemaTable } from "../component_ui/display_table_schema.js";

async function getSchemas() {
    try {
        const response = await fetch("/admin/get_schema/list/json");

        console.log("réponse backend:" ,response);
        
        const data = await response.json();
        console.log("réponse data:" , data);
        

        // Vérifier que data est bien un tableau
        if (!Array.isArray(data)) {
            console.error("Format invalide :", data);
            return;
        }

        renderSchemaTable(data); // 🔹 passer directement les données

    } catch (error) {
        console.error("Erreur GET schema :", error);
    }
}

getSchemas();