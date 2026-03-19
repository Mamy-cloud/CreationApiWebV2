// put_rename_columns.js

import { createRenameColumnsJSON } from "../JSON_transfer_conversion_backend/json_rename_columns_postgre.js";
import { startSpinner , stopSpinner } from "../../animate_spin.js";

export async function putRenameColumns() {

  const path = window.location.pathname.split("/");
  const schema_name = path[2];
  const table_name = path[3];

  const data = createRenameColumnsJSON();
  console.log("json rename one col", data);

  startSpinner();

  try {
    const response = await fetch(
      `/app/${schema_name}/${table_name}/postgre/sync/method/put/rename/column`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Erreur serveur: ${response.status}`);
    }

    const result = await response.json();

    console.log("Réponse API :", result);
    alert("✅ Colonne renommée avec succès");

    window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;

    return result;

  } catch (error) {
    console.error("Erreur :", error);
    alert("❌ " + error.message);
  } finally {
    stopSpinner();
  }
}


// Event listener
const renameForm = document.getElementById("renameColumnForm");

if (renameForm) {
  renameForm.addEventListener("submit", function(e) {
    e.preventDefault();
    putRenameColumns();
  });
}

//------------------------multi-columns------------------------------------
import { getRenameColumnsData } from "../JSON_transfer_conversion_backend/json_rename_columns_postgre.js";


export function putRenameMultiColumns() {

  document.addEventListener("DOMContentLoaded", () => {

    const submitBtn = document.getElementById("submitRenameColumns");

    if (!submitBtn) {
      console.error("Bouton introuvable : submitRenameColumns");
      return;
    }

    submitBtn.addEventListener("click", async function (e) {
      e.preventDefault(); // facultatif, pas de form submit ici

      const path = window.location.pathname.split("/");
      const schemaName = path[2];
      const tableName = path[3];

      const data = getRenameColumnsData();
      console.log("Données envoyées :", data);

      startSpinner();

      try {
        const response = await fetch(
          `/app/${schemaName}/${tableName}/postgre/sync/method/put/rename/column`,
          {
            method: "PUT",
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
        alert("✅ Colonnes renommées avec succès !");

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

putRenameMultiColumns();