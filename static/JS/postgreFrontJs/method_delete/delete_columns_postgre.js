import { startSpinner, stopSpinner } from "../../animate_spin.js";

//------------------------supprimer une colonne-------------------------------------

export async function initDeleteOneColonne() {
  const params = new URLSearchParams(window.location.search);

  const column_name = params.get("column");
  const column_type = params.get("type"); // optionnel

  const path = window.location.pathname.split("/");

  const schema_name = path[2];
  const table_name = path[3];

  // ❗ sécurité : vérifier que column existe
  if (!column_name) {
    alert("❌ Aucune colonne spécifiée !");
    return window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;
  }

  // 🔥 confirmation directe au chargement
  const confirmDelete = window.confirm(
    `⚠️ Suppression irréversible.\n\nColonne: ${column_name}\nType: ${column_type}\n\nConfirmez-vous la suppression ?`
  );

  if (!confirmDelete) {
    return window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;
  }

  // ✅ format JSON attendu par ton backend
  const payload = {
    columns: [column_name]
  };

  console.log("JSON envoyé :", payload);

  startSpinner();

  try {
    const response = await fetch(
      `/app/${schema_name}/${table_name}/postgre/sync/method_crud/delete/one_multi_columns`,
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

    alert(`✅ Colonne "${column_name}" supprimée !`);

    window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;

  } catch (error) {
    alert("❌ Erreur: " + error.message);
    console.error(error);

  } finally {
    stopSpinner();
  }
}

// 🔥 exécution immédiate
initDeleteOneColonne();