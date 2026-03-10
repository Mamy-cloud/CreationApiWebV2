// put_rename_columns.js

import { createRenameColumnsJSON } from "../JSON_transfer_conversion_backend/json_rename_columns.js";

export async function putRenameColumns() {

  const data = createRenameColumnsJSON();

  try {

    const response = await fetch("/admin/method/table/rename_columns", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const result = await response.json();

    console.log("Réponse API :", result);
    alert("Column renamed successfully");

    return result;

  } catch (error) {

    console.error("Erreur :", error);
    alert("Error renaming column");

  }

}

// ✅ Ajouter l'event listener pour le bouton directement ici
const renameButton = document.getElementById("renameColumnForm");

if (renameButton) {
  renameButton.addEventListener("submit", function(e) {
    e.preventDefault(); // empêcher le reload de la page
    putRenameColumns();
  });
}

//------------------------multi-columns------------------------------------
import { getRenameColumnsData } from "../JSON_transfer_conversion_backend/json_rename_columns.js";

export function putRenameMultiColumns() {

  document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("renameColumnsForm");

    if (!form) {
      console.error("Formulaire introuvable : renameColumnsForm");
      return;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // empêcher le rechargement de la page

      // construire le JSON à partir des colonnes renommées
      const data = getRenameColumnsData();

      console.log("Données envoyées :", data); // debug

      // appel API PUT
      fetch("/admin/method/table/rename_columns", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) throw new Error("Erreur HTTP " + response.status);
        return response.json();
      })
      .then(result => {
        console.log("Succès :", result);
        alert("Changements enregistrés avec succès !");
      })
      .catch(error => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'enregistrement des changements !");
      });

    });

  });

}
putRenameMultiColumns()