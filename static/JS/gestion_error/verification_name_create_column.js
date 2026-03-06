// validation_columns.js
import { verifierNom, afficherResultats } from './gestion_error_name.js';

export function verifierColonnes() {
  const columnBlock = document.querySelector(".verification_name[data-target='column_name']");
  let allValid = true;

  document.querySelectorAll("input[name='column_name']").forEach(field => {
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
    if (e.target.name === "column_name") {
      verifierColonnes();
    }
  });
});
