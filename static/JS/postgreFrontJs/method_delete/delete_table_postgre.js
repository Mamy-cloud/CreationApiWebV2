// post_delete_table_postgre_module.js

import { startSpinner, stopSpinner } from "../../animate_spin.js";

export function initDeleteTable() {
  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const deleteBtn = document.getElementById("delete_table_postgre");
  if (!deleteBtn) {
    console.error("Bouton delete table introuvable !");
    return;
  }

  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "⚠️ Suppression irréversible.\n" +
      "Veuillez bien vérifier.\n" +
      "Confirmez-vous la suppression ?"
    );

    if (!confirmDelete) return;

    const payload = {
        schema_name: schemaName,
        table_name: tableName
        };
    
        console.log("json envoyé pour 'delete table'", payload);
        

    startSpinner();
    try {
      const response = await fetch(
        `/app/${schemaName}/${tableName}/postgre/sync/method_crud/delete/table`,
        {
          method: "DELETE",
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

      alert("✅ Suppression effectuée !");
      window.location.href = `/admin/method/get/tables/schema/postgresql/interface/views`;
    } catch (error) {
      alert("❌ Erreur: " + error.message);
      console.error(error);
    } finally {
      stopSpinner();
    }
  });
}

// 🔥 Initialisation
initDeleteTable();