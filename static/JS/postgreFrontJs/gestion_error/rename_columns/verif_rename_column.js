// validation_tableName.js
import { verifierNom, afficherResultats } from '../gestion_error_name.js';

export function verifierRenameColumn() {
  const tableNameField = document.getElementById("new_one_column_name");
  const tableBlock = document.querySelector(".verification_error[data-target='new_one_column_name']");
  const resultats = verifierNom(tableNameField.value);
  afficherResultats(resultats, tableBlock);
  return resultats.isValid;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableNameField = document.getElementById("new_one_column_name");
  tableNameField.addEventListener("input", verifierRenameColumn);
});
