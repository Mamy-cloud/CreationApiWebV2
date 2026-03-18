// put_modify_row.js

import { buildModifyRowJson } from "../JSON_transfer_conversion_backend/json_modify_row_postgre.js";
import { startSpinner, stopSpinner } from "../../animate_spin.js";

export function initPutModifyRow() {

  const form = document.getElementById("modifyRowForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const jsonData = buildModifyRowJson();
    if (!jsonData) {
      alert("Impossible de déterminer l'id de la ligne !");
      return;
    }

    // Récupérer schema_name et table_name depuis l'URL
    const pathParts = window.location.pathname.split("/");
    const schema_name = pathParts[2];
    const table_name = pathParts[3];

    console.log("JSON envoyé :", jsonData, "Schema:", schema_name, "Table:", table_name);

    startSpinner();

    try {
      const response = await fetch(`/app/${schema_name}/${table_name}/postgre/synchrone/method_crud/modify/value_row`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Erreur serveur : ${response.status}`);
      }

      const result = await response.json();
      console.log("Réponse API :", result);
      alert("✅ Ligne modifiée avec succès !");
      window.location.href = `/admin/${schema_name}/${table_name}/postgresql/interface/views`;


    } catch (error) {
      console.error("Erreur API :", error);
      alert("❌ Erreur lors de la modification !");
    } finally {
      stopSpinner();
    }
  });

}

// lancer automatiquement
document.addEventListener("DOMContentLoaded", initPutModifyRow);