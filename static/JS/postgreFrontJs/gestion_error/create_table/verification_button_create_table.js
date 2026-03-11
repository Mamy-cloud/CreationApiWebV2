// validation_buttons.js
import { verifierTableName } from './verification_name_create_table.js';
import { verifierColonnes } from './verification_name_create_column.js';

document.addEventListener("DOMContentLoaded", () => {
  const addColumnBtn = document.getElementById("addColumnBtn");
  const createTableBtn = document.getElementById("createTableBtnPostgre");

  function verifierFormulaire() {
    const tableValid = verifierTableName();
    const columnsValid = verifierColonnes();
    const allValid = tableValid && columnsValid;

    addColumnBtn.disabled = !allValid;
    createTableBtn.disabled = !allValid;
  }

  document.getElementById("tableNamePostgre").addEventListener("input", verifierFormulaire);
  document.addEventListener("input", (e) => {
    if (e.target.name === "column_name") {
      verifierFormulaire();
    }
  });

  document.getElementById("createTableFormPostgre").addEventListener("submit", (event) => {
    verifierFormulaire();
    if (createTableBtn.disabled) {
      event.preventDefault();
      alert("Erreur : Les noms de table/colonnes ne respectent pas les règles de nommage.");
    }
  });
});
