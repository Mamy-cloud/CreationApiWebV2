import { startSpinner, stopSpinner } from "../../animate_spin.js";

//-------------------------------supprimer des colonnes--------------------------
import { generateJsonDeleteColumns } from "../JSON_transfer_conversion_backend/json_delete_columns_postgre.js";


export function deleteMultiColumns() {

  document.addEventListener("DOMContentLoaded", () => {

    const deleteBtn = document.getElementById("submitDeleteMultiCol");

    if (!deleteBtn) {
      console.error("Bouton introuvable : DeleteColumns");
      return;
    }

    deleteBtn.addEventListener("click", async function (e) {
      e.preventDefault(); // facultatif, pas de form submit ici

      const path = window.location.pathname.split("/");
      const schemaName = path[2];
      const tableName = path[3];

      const data = generateJsonDeleteColumns();
      console.log("Données envoyées :", data);

      const confirmDelete = window.confirm(
          "⚠️ Suppression irréversible.\n" +
          "Veuillez bien vérifier.\n" +
          "Confirmez-vous la suppression ?"
        );

        if (!confirmDelete) return;

      startSpinner();

      try {
        const response = await fetch(
          `/app/${schemaName}/${tableName}/postgre/sync/method_crud/delete/one_multi_columns`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || `Erreur HTTP ${response.status}`);
        }

        const result = await response.json();

        console.log("Succès :", result);
        alert("✅ suppression avec succès !");

        window.location.href = `/admin/${schemaName}/${tableName}/postgresql/interface/views`;

      } catch (error) {
        console.error("Erreur :", error);
        alert("❌ " + error.message);
      } finally {
        stopSpinner();
      }
    });

  });
}

deleteMultiColumns();