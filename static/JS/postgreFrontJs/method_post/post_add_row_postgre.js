// send_row.js
import { constructJsonForRow } from '../JSON_transfer_conversion_backend/json_create_row_postgre.js';
import { startSpinner , stopSpinner } from "../../animate_spin.js"

// Récupérer schema et table depuis l'URL
const pathParts = window.location.pathname.split("/");
// Exemple URL : /admin/public/users
const schemaName = pathParts[2];
const tableName = pathParts[3];

console.log("SchemaName:", schemaName);
console.log("TableName:", tableName);

export function sendRowToBackend() {
  // Construire le JSON depuis le tableau
  const jsonData = constructJsonForRow();

  if (jsonData.rows.length === 0) {
    alert("Aucune ligne à ajouter !");
    return;
  }

  console.log("JSON envoyé :", jsonData);

  // Envoyer au backend
  async function addRows(jsonData) {

    startSpinner()
    try {
      // URL dynamique avec schema et table
      const response = await fetch(`/app/${schemaName}/${tableName}/postgre/sync/method_crud/add/rows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)  // contient juste rows et éventuellement columns
      });

      // Vérifier le statut HTTP
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      const data = await response.json();
      console.log("Lignes ajoutées avec succès :", data);
      alert("✅ lignes ajoutées avec succès !");
      window.location.reload();

    } catch (error) {
      console.error("Erreur lors de l'ajout des lignes :", error);
      alert(`Erreur : ${JSON.stringify(error)}`);
    } finally {
      stopSpinner();
      console.log("Fin de l'opération POST add rows");
    }
  }

  // Appel de la fonction avec tes données JSON
  addRows(jsonData);
}

// Attacher l'événement au bouton
document.getElementById("submitRowBtn").addEventListener("click", sendRowToBackend);