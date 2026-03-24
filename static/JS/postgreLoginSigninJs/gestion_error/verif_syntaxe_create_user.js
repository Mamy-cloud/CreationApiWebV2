// validation_columns.js
import { verifierNom, afficherResultats } from '../../postgreFrontJs/gestion_error/gestion_error_name.js';

export function verifNameUserSignUp() {
  const columnBlock = document.querySelector(".verification_error[data-target='signupIdUserPostgreSync']");
  let allValid = true;

  document.querySelectorAll("input[name='signupIdUserPostgreSync']").forEach(field => {
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
    if (e.target.name === "signupIdUserPostgreSync") {
      verifNameUserSignUp();
    }
  });
});
