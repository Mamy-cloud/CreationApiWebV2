// validation_columns.js
import { verifierMotDePasse, afficherResultatsPassword } from "./verif_password_global.js";

export function verifPasswordSignUp() {
  const columnBlock = document.querySelector(".verification_password[data-target='signupIdPasswordPostgreSync']");
  let allValid = true;

  document.querySelectorAll("input[name='signupIdPasswordPostgreSync']").forEach(field => {
    const resultats = verifierMotDePasse(field.value);
    afficherResultatsPassword(resultats, columnBlock);
    if (!resultats.isValid) {
      allValid = false;
    }
  });

  return allValid;
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("input", (e) => {
    if (e.target.name === "signupIdPasswordPostgreSync") {
      verifPasswordSignUp();
    }
  });
});
