// put_modify_row.js

import { buildModifyRowJson } from "../JSON_transfer_conversion_backend/json_modify_row_postgre.js";
import { startSpinner , stopSpinner } from "../../animate_spin.js"


export function initPutModifyRow() {

  const form = document.getElementById("modifyRowForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const jsonData = buildModifyRowJson();

    console.log("JSON envoyé :", jsonData);

    startSpinner()

    try {

      const response = await fetch("/app/postgre/synchrone/method_crud/modify/value_row", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();

      alert("modification réussie")
      console.log("Réponse API :", result);

    } catch (error) {
      alert("error")
      console.error("Erreur API :", error);

    }finally{
      stopSpinner()
    }

  });

}

// lancer automatiquement
document.addEventListener("DOMContentLoaded", initPutModifyRow);