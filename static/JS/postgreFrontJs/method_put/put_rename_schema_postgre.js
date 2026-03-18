// put_rename_schema_postgre.js

import { startSpinner, stopSpinner } from "../../animate_spin.js";

export function initRenameSchema() {

  // 🔹 Récupération depuis l'URL
  const pathParts = window.location.pathname.split("/");
  const schemaName = pathParts[2];
  const tableName = pathParts[3]; // juste pour la redirection, si nécessaire

  const form = document.getElementById("renameSchemaForm");
  if (!form) {
    console.error("Formulaire renameSchemaForm introuvable !");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.querySelector(".newNameSchemaPostgre");
    const newName = input ? input.value.trim() : "";

    if (!newName) {
      alert("Veuillez saisir un nouveau nom valide !");
      return;
    }

    // 🔒 Validation simple côté front
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!regex.test(newName)) {
      alert("Nom invalide ! Utilisez uniquement lettres, chiffres et underscore.");
      return;
    }

    // ⚠️ Modal de confirmation personnalisé
    const confirmRename = window.confirm(
      "⚠️ Le renommage du schema peut endommager la base de données.\n" +
      "Veuillez bien vérifier.\n" +
      "Confirmez-vous le renommage ?"
    );

    if (!confirmRename) {
      // l'utilisateur a cliqué sur Annuler
      return;
    }

    const payload = {
      schema_name: schemaName.trim(),
      new_schema_name: newName
    };

    console.log("Payload à envoyer:", payload);

    startSpinner();

    try {
      const response = await fetch(
        `/app/postgre/synchrone/method_crud/put/rename_schema`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Erreur serveur: ${response.status}`);
      }

      const result = await response.json();
      alert("✅ " + result.message);

      // 🔄 Redirection vers le nouveau schema
      window.location.href = `/admin/${newName}/${tableName}/postgresql/interface/views`;

    } catch (error) {
      alert("❌ Erreur: " + error.message);
      console.error(error);
    } finally {
      stopSpinner();
    }
  });
}

// 🔥 Initialisation
initRenameSchema();