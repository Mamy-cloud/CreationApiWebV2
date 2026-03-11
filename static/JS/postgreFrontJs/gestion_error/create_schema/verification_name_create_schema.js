// validation_columns.js
import { verifierNom, afficherResultats } from '../gestion_error_name.js';

export function verifNameSchema() {
  const columnBlock = document.querySelector(".verification_error[data-target='create_schema_postgre']");
  let allValid = true;

  document.querySelectorAll("input[name='create_schema_postgre']").forEach(field => {
    const resultats = verifierNom(field.value);
    afficherResultats(resultats, columnBlock);
    if (!resultats.isValid) {
      allValid = false;
    }
  });

  return allValid;
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("input", (e) => {
    if (e.target.name === "create_schema_postgre") {
      verifNameSchema();
    }
  });
});
