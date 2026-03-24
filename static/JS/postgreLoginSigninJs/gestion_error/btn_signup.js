// validation_buttons.js
import { verifNameUserSignUp } from "./verif_syntaxe_create_user.js";
import { verifPasswordSignUp } from "./verif_psswrd_postgre.js";

document.addEventListener("DOMContentLoaded", () => {
  const addUserBtn = document.getElementById("btnSubmitCreateUserPostgre");

  function verifierFormulaire() {
    const userValid = verifNameUserSignUp();
    const passwordValid = verifPasswordSignUp();
    const allValid = userValid && passwordValid;

    addUserBtn.disabled = !allValid;
  }

  // 🔥 Écoute les deux inputs (username + password)
  document.addEventListener("input", (e) => {
    if (
      e.target.name === "signupIdUserPostgreSync" ||
      e.target.name === "signupIdPasswordPostgreSync"
    ) {
      verifierFormulaire();
    }
  });

  // 🔐 Vérification au submit
  document
    .getElementById("signupFormPostgreSync")
    .addEventListener("submit", (event) => {
      verifierFormulaire();

      if (addUserBtn.disabled) {
        event.preventDefault();
        alert(
          "Erreur : Le nom d'utilisateur ou le mot de passe ne respecte pas les critères."
        );
      }
    });
});