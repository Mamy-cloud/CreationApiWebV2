// put_modify_row.js

import { buildModifyRowJson } from "../JSON_transfer_conversion_backend/json_modify_row.js";

export function initPutModifyRow() {

  const form = document.getElementById("modifyRowForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const jsonData = buildModifyRowJson();

    console.log("JSON envoyé :", jsonData);

    try {

      const response = await fetch("/admin/method/put/modify/value/row/postgresql", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();

      console.log("Réponse API :", result);

    } catch (error) {

      console.error("Erreur API :", error);

    }

  });

}

// lancer automatiquement
document.addEventListener("DOMContentLoaded", initPutModifyRow);