import { constructJsonForRow } from '../JSON_transfer_conversion_backend/json_create_row.js';



export function sendRowToBackend() {
  // Construire le JSON depuis le tableau
  const jsonData = constructJsonForRow();

  console.log("JSON envoyé :", jsonData);

  // Envoyer au backend
  fetch(`/admin/method/post/table/add_row`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      return response.json();
    })
    .then(data => {
      console.log("Lignes ajoutées avec succès :", data);
      alert("✅ lignes ajoutées avec succès !");
    window.location.reload();
    })
    
    .catch(error => {
    console.error("Erreur lors de l'ajout des lignes :", error);
    alert(`Erreur : ${JSON.stringify(error)}`);
    });
    
}

// Attacher l'événement au bouton
document.getElementById("submitRowBtn").addEventListener("click", sendRowToBackend);