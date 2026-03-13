// validation_rename_table.js
import { verifNameTablePostgre } from "./verif_name_table_postgre.js";

document.addEventListener("DOMContentLoaded", () => {

  const renameBtn = document.getElementById("renameBtnTablePostgre");
  const tableInput = document.getElementById("newName");

  function verifierFormulaire() {

    const tableValid = verifNameTablePostgre();

    // active / désactive le bouton
    renameBtn.disabled = !tableValid;

  }

  // validation en temps réel quand on écrit
  tableInput.addEventListener("input", verifierFormulaire);

  // vérification au clic
  renameBtn.addEventListener("click", (event) => {

    const tableValid = verifNameTablePostgre();

    if (!tableValid) {
      event.preventDefault();
      alert("Erreur : le nom de la table ne respecte pas les règles.");
    }

  });

  // désactiver le bouton au départ
  verifierFormulaire();

});