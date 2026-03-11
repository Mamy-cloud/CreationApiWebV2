// select_schema.js
import { createSchemaSelectPostgre } from "../display_list_schema_table/list_schema_postgre.js";

// Sélecteur du div placeholder
const container = document.querySelector('.select_schema_postgre');

/**
 * Fonction qui crée le select dans le div
 * //@param {Array} dataSchemas - liste des schemas [{schema_name, table_name: []}, ...]
 */
export function renderSchemaSelect(dataSchemas) {
    // 🔐 Nettoyage
    container.replaceChildren();

    if (!Array.isArray(dataSchemas) || dataSchemas.length === 0) {
        container.textContent = "Aucune donnée de schemas disponible.";
        return;
    }

    // Crée le select
    const schemaSelect = createSchemaSelectPostgre(dataSchemas);

    // Ajoute le select dans le div
    container.appendChild(schemaSelect);

    // 🔄 Gestion du changement
    schemaSelect.addEventListener('change', (event) => {
        const selectedSchema = event.target.value;

        const schemaData = dataSchemas.find(s => s.schema_name === selectedSchema);

        if (schemaData) {
            console.log('Schema sélectionné :', selectedSchema);
            console.log('Tables disponibles :', schemaData.table_name);

            // Ici tu peux mettre à jour dynamiquement ton formulaire ou tableau
            // par exemple afficher les tables dans un autre div
        }
    });
}

/**
 * Exemple d'utilisation avec des données fetchées
 */
export async function initSchemaSelect(apiUrl = '/app/postgre/sync/method_crud/get/schema_table') {
    try {

        const response = await fetch(apiUrl);
        console.log(response);
        
        const data = await response.json();
        console.log(data);
        

        renderSchemaSelect(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Erreur lors de la récupération des schemas :", error);
        container.textContent = "Impossible de charger les schemas.";
    }
}

// 🔹 Initialisation automatique
initSchemaSelect();