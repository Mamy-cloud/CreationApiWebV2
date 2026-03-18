// post_rename_table_postgre_module.js

import { startSpinner, stopSpinner } from "../../animate_spin.js";

export function initRenameTable() {

  // 🔹 Récupération depuis l'URL
  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const oldName = pathParts[3];

  console.log("SchemaName:", schemaName, "OldName:", oldName);

  const form = document.getElementById("renameTableForm");
  if (!form) {
    console.error("Formulaire renameTableForm introuvable !");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = document.getElementById("newName").value.trim();

    if (!newName) {
      alert("Veuillez saisir un nouveau nom valide !");
      return;
    }

    // 🔒 Validation simple côté front (anti erreur utilisateur)
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!regex.test(newName)) {
      alert("Nom invalide ! Utilisez uniquement lettres, chiffres et underscore.");
      return;
    }

    // ✅ Nouveau payload (uniquement new_name)
    const payload = {
      new_name: newName
    };

    console.log("Payload à envoyer:", payload);

    startSpinner();
    try {
      const response = await fetch(
        `/app/${schemaName}/${oldName}/postgre/synchrone/method/crud/post/rename_table`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Erreur serveur: ${response.status}`);
      }

      const result = await response.json();
      alert("✅ " + result.message);

      // 🔄 Redirection vers la nouvelle table
      window.location.href = `/admin/${schemaName}/${newName}/postgresql/interface/views`;

    } catch (error) {
      alert("❌ Erreur: " + error.message);
      console.error(error);
    } finally {
      stopSpinner();
    }
  });
}

// 🔥 Initialisation
initRenameTable();