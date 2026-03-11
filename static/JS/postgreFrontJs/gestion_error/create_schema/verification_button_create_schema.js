// validation_buttons.js
import { verifNameSchema } from "./verification_name_create_schema.js";

document.addEventListener("DOMContentLoaded", () => {

  const createSchemaBtn = document.getElementById("create_schema_btn_postgre");
  const schemaInput = document.getElementById("create_schema_postgre");

  function verifierFormulaire() {

    const schemaValid = verifNameSchema();

    // active / désactive le bouton
    createSchemaBtn.disabled = !schemaValid;

  }

  // validation en temps réel quand on écrit
  schemaInput.addEventListener("input", verifierFormulaire);

  // vérification au clic
  createSchemaBtn.addEventListener("click", (event) => {

    const schemaValid = verifNameSchema();

    if (!schemaValid) {
      event.preventDefault();
      alert("Erreur : le nom du schéma ne respecte pas les règles.");
    }

  });

  // désactiver le bouton au départ
  verifierFormulaire();

});