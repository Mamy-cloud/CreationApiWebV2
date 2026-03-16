
import { buildTableHeaderPostgre } from "../component_ui/display_table_column_row/display_table_header_postgre.js";
import { buildTableRowsPostgre } from "../component_ui/display_table_column_row/display_table_row_postgre.js";
import { startSpinner , stopSpinner } from "../../animate_spin.js"

// Récupérer schema_name et table_name depuis l'URL
const pathParts = window.location.pathname.split("/");

// Exemple d'URL: /admin/public/users
const schemaName = pathParts[2];
const tableName = pathParts[3];

console.log("SchemaName:", schemaName);
console.log("TableName:", tableName);

/* function loadTable() {
  fetch(`/app/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`)
    .then(response => response.json())
    .then(data => {

      console.log("donné reçu", data);
      const thead = document.getElementById("columnsTable");
      const tbody = document.getElementById("rowsTable");

      document.getElementById("tableTitlePostgre").textContent = `${tableName}`;
      
      

      // Colonnes = data.columns (avec name + type)
      let columns = data.columns;

      // --- Création de l’en-tête ---
      buildTableHeaderPostgre(thead, columns);
      

      // --- Création des lignes ---
      buildTableRowsPostgre(tbody, data, columns);
    })
    .catch(error => {
      console.error("Erreur lors du chargement du tableau:", error);
    });
}

document.addEventListener("DOMContentLoaded", loadTable); */
async function loadTable() {
  startSpinner()
  try {

    const response = await fetch(`/app/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`);

    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log("donné reçu", data);

    const thead = document.getElementById("columnsTable");
    const tbody = document.getElementById("rowsTable");

    document.getElementById("tableTitlePostgre").textContent = `${tableName}`;

    // Colonnes = data.columns (avec name + type)
    let columns = data.columns;

    // --- Création de l’en-tête ---
    buildTableHeaderPostgre(thead, columns);

    // --- Création des lignes ---
    buildTableRowsPostgre(tbody, data, columns);

  } catch (error) {

    console.error("Erreur lors du chargement du tableau:", error);

  } finally {

    // ici tu peux arrêter ton animation
    stopSpinner();

    console.log("chargement terminé");

  }

}

document.addEventListener("DOMContentLoaded", loadTable);

