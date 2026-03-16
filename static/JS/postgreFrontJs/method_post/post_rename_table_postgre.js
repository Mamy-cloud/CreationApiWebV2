// post_rename_table_postgre_module.js
// ----------------------------
// Module autonome pour renommer une table PostgreSQL
// ----------------------------

// On utilise import en haut du module
import { startSpinner, stopSpinner } from "../../animate_spin.js";

// Fonction principale du module
export function initRenameTable() {

  // Récupère l'URL et extrait schema_name et table_name
  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2]; // 2ème segment = {schema_name}
  const oldName = pathParts[3];    // 3ème segment = {table_name}
  console.log("SchemaName:", schemaName, "OldName:", oldName);

  const form = document.getElementById("renameTableForm");
  if (!form) {
    console.error("Formulaire renameTableForm introuvable !");
    return;
  }

  // Événement submit du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = document.getElementById("newName").value.trim();
    if (!newName) {
      alert("Veuillez saisir un nouveau nom valide !");
      return;
    }

    const payload = {
      schema_name: schemaName,
      old_name: oldName,
      new_name: newName
    };
    console.log("Payload à envoyer:", payload);

    startSpinner();
    try {
      const response = await fetch(`/app/postgre/synchrone/method/crud/post/rename_table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Erreur serveur: ${response.status}`);
      }

      const result = await response.json();
      alert("✅ " + result.message);

      // Redirection vers la nouvelle table
      window.location.href = `/admin/${schemaName}/${newName}/postgresql/interface/views`;

    } catch (error) {
      alert("❌ Erreur: " + error.message);
      console.error(error);
    } finally {
      stopSpinner();
    }
  });
}

// ----------------------------
// Appel direct du module
// ----------------------------
initRenameTable();