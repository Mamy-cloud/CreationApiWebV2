// validation_tableName.js
import { verifierNom, afficherResultats } from './gestion_error_name.js';

export function verifierTableName() {
  const tableNameField = document.getElementById("tableName");
  const tableBlock = document.querySelector(".verification_name[data-target='tableName']");
  const resultats = verifierNom(tableNameField.value);
  afficherResultats(resultats, tableBlock);
  return resultats.isValid;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableNameField = document.getElementById("tableName");
  tableNameField.addEventListener("input", verifierTableName);
});
