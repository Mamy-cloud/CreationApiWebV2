import { startSpinner, stopSpinner } from "../../animate_spin.js";

//------------------------supprimer une ligne par ID-------------------------------------

export async function initDeleteRowIdPostgre() {
  const urlParams = new URLSearchParams(window.location.search);
  let row_id = urlParams.get("id");

  const path = window.location.pathname.split("/");

  const schema_name = path[2];
  const table_name = path[3];

  // ❗ sécurité : vérifier que row_id existe
  if (!row_id) {
    alert("❌ Aucun ID de ligne spécifié !");
    return window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;
  }

  // 🔹 conversion en entier pour backend
  row_id = parseInt(row_id, 10);
  if (isNaN(row_id)) {
    alert("❌ ID de ligne invalide !");
    return window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;
  }
  console.log(row_id);
  

  // 🔥 confirmation directe au chargement
  const confirmDelete = window.confirm(
    `⚠️ Suppression irréversible.\n\nLigne ID: ${row_id}\n\nConfirmez-vous la suppression ?`
  );

  if (!confirmDelete) {
    return window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;
  }
  

  // ✅ format JSON attendu par le backend
  const payload = { row_id };

  console.log("JSON envoyé :", payload);
  
  startSpinner();


  try {
    const response = await fetch(
      `/app/${schema_name}/${table_name}/postgre/sync/method_crud/delete/row/id`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
      console.log("Body JSON envoyé :", JSON.stringify(payload));

    console.log("réponse back-end", response);
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Erreur serveur: ${response.status}`);
    }

    alert(`✅ Ligne "${row_id}" supprimée avec succès !`);

    window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;

  } catch (error) {
    alert("❌ Erreur: " + error.message);
    console.error(error);

  } finally {
    stopSpinner();
  }
}

// 🔥 exécution immédiate
initDeleteRowIdPostgre();