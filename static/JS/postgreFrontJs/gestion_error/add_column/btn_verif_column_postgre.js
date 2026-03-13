// btn_verif_column.js
import { verifierColonnes } from "../create_table/verification_name_create_column.js";

document.addEventListener("DOMContentLoaded", () => {

  const validateBtn = document.getElementById("validateColumnsBtn");
  const addColumnBtn = document.getElementById("addColumnBtn");
  const columnsContainer = document.getElementById("columnsBody");

  if (!validateBtn || !addColumnBtn || !columnsContainer) {
    console.error("Bouton de validation, bouton ajouter ou container des colonnes introuvable");
    return;
  }

  function verifierFormulaire() {
    const columnsValid = verifierColonnes();

    // activer / désactiver les boutons
    validateBtn.disabled = !columnsValid;
    addColumnBtn.disabled = !columnsValid;
  }

  // validation en temps réel : quand on change un input de colonne
  columnsContainer.addEventListener("input", verifierFormulaire);

  // vérification lors du clic sur le bouton valider
  validateBtn.addEventListener("click", (event) => {
    const columnsValid = verifierColonnes();
    if (!columnsValid) {
      event.preventDefault();
      alert("Erreur : au moins une colonne ne respecte pas les règles.");
    }
  });

  // désactiver le bouton ajouter au départ
  verifierFormulaire();

});