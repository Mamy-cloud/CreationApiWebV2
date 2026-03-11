
//------------------------------------------code avec module create thead------------------
// get_table.js
//-----------------------------get column
//si on veut avoir uniquement la colonne, on enlève import { buildTableRows }
//et buildTableRows(tbody, data, columns);
//et aussi le tbody, script dans le html;
//------------------------------get row
//si on veut avoir uniquement la colonne, on enlève import { buildTableHeader }
//et buildTableRows(tbody, data, columns);
//et aussi le thead, script dans le html;


import { buildTableHeaderPostgre } from "../component_ui/display_table_column_row/display_table_header_postgre.js";
import { buildTableRowsPostgre } from "../component_ui/display_table_column_row/display_table_row_postgre.js";
/* import { addRow } from "../component_ui/add_row.js"; */

// Récupérer schema_name et table_name depuis l'URL
const pathParts = window.location.pathname.split("/");

// Exemple d'URL: /admin/public/users
const schemaName = pathParts[2];
const tableName = pathParts[3];

console.log("SchemaName:", schemaName);
console.log("TableName:", tableName);

function loadTable() {
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

document.addEventListener("DOMContentLoaded", loadTable);

