// validation_tableName.js
import { verifierNom, afficherResultats } from '../gestion_error_name.js';

export function verifierTableName() {
  const tableNameField = document.getElementById("tableNamePostgre");
  const tableBlock = document.querySelector(".verification_error[data-target='tableNamePostgre']");
  const resultats = verifierNom(tableNameField.value);
  afficherResultats(resultats, tableBlock);
  return resultats.isValid;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableNameField = document.getElementById("tableNamePostgre");
  tableNameField.addEventListener("input", verifierTableName);
});
