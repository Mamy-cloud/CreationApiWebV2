
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


import { buildTableHeader } from "../component_ui/display_table_header.js";
import { buildTableRows } from "../component_ui/display_table_row.js";
import { addRow } from "../component_ui/add_row.js";

// Récupérer schema_name et table_name depuis l'URL
const pathParts = window.location.pathname.split("/").filter(Boolean);
const schemaName = pathParts[pathParts.length - 2]; // avant-dernier segment
console.log(schemaName);

const tableName = pathParts[pathParts.length - 1];  // dernier segment
console.log(tableName)

function loadTable() {
  fetch(`/admin/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`)
    .then(response => response.json())
    .then(data => {

      console.log("donné reçu", data);
      const thead = document.getElementById("columnsTable");
      const tbody = document.getElementById("rowsTable");

      document.getElementById("tableTitle").textContent = `${tableName}`;
      
      

      // Colonnes = data.columns (avec name + type)
      let columns = data.columns;

      // --- Création de l’en-tête ---
      buildTableHeader(thead, columns);
      

      // --- Création des lignes ---
      buildTableRows(tbody, data, columns);
    })
    .catch(error => {
      console.error("Erreur lors du chargement du tableau:", error);
    });
}

document.addEventListener("DOMContentLoaded", loadTable);

