import { startSpinner, stopSpinner } from "../../animate_spin.js";
import { jsonDeleteColumns } from "../JSON_transfer_conversion_backend/json_delete_columns_postgre.js";

//----------------------------supprimer une colonne----------------------
export function initDeleteOneColumn() {
  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const select = document.getElementById("id_container_select_rename_delete_col_postgre");
  if (!select) {
    console.error("select introuvable !");
    return;
  }

  select.addEventListener("change", async (e) => {
    const value = e.target.value;

    if (value === "delete_one_col") {

      // Générer le JSON depuis valueColumnName
      const payload = jsonDeleteColumns();
      if (!payload.columns || payload.columns.length === 0) {
        alert("⚠️ Aucune colonne sélectionnée pour suppression !");
        e.target.value = "";
        return;
      }

      // Confirmation utilisateur
      const confirmDelete = window.confirm(
        "⚠️ Suppression irréversible.\n" +
        "Veuillez bien vérifier.\n" +
        "Confirmez-vous la suppression ?"
      );
      if (!confirmDelete) {
        e.target.value = "";
        return;
      }

      console.log("JSON envoyé pour 'delete column':", payload);

      startSpinner();
      try {
        const response = await fetch(
          `/app/${schemaName}/${tableName}/postgre/sync/method_crud/delete/one_multi_columns`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || `Erreur serveur: ${response.status}`);
        }

        alert("✅ Suppression effectuée !");
        window.location.reload();

      } catch (error) {
        alert("❌ Erreur: " + error.message);
        console.error(error);

      } finally {
        stopSpinner();
        // 🔄 reset du select après action
        e.target.value = "";
      }
    }
  });
}

// 🔥 Initialisation
initDeleteOneColumn();