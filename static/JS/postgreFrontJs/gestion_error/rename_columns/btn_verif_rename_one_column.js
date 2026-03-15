// validation_buttons.js
import { verifierRenameColumn } from "./verif_rename_column.js";

document.addEventListener("DOMContentLoaded", () => {

  const RenameBtn = document.getElementById("rename_one_column_button");
  const RenameInput = document.getElementById("new_one_column_name");

  function verifierFormulaireRenameCol() {

    const schemaValid = verifierRenameColumn();

    // active / désactive le bouton
    RenameBtn.disabled = !schemaValid;

  }

  // validation en temps réel quand on écrit
  RenameInput.addEventListener("input", verifierFormulaireRenameCol);

  // vérification au clic
  RenameBtn.addEventListener("click", (event) => {

    const schemaValid = verifierRenameColumn();

    if (!schemaValid) {
      event.preventDefault();
      alert("Erreur : le nom du schéma ne respecte pas les règles.");
    }

  });

  // désactiver le bouton au départ
  verifierFormulaireRenameCol();

});