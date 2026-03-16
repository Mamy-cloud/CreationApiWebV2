import { constructJsonForRow } from '../JSON_transfer_conversion_backend/json_create_row_postgre.js';
import { startSpinner , stopSpinner } from "../../animate_spin.js"



export function sendRowToBackend() {
  // Construire le JSON depuis le tableau
  const jsonData = constructJsonForRow();

  console.log("JSON envoyé :", jsonData);

  // Envoyer au backend
  async function addRows(jsonData) {

  startSpinner()
  try {
    const response = await fetch(`/app/postgre/sync/method_crud/add/rows/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
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
    // ici tu peux arrêter ton spinner ou faire un nettoyage
    stopSpinner();
    console.log("Fin de l'opération POST add rows");
  }
}

// Appel de la fonction avec tes données JSON
addRows(jsonData);
    
}

// Attacher l'événement au bouton
document.getElementById("submitRowBtn").addEventListener("click", sendRowToBackend);