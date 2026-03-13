// post_column.js
import { postColumnsJSON } from "../JSON_transfer_conversion_backend/create_json_column_postgre.js";

const pathParts = window.location.pathname.split("/");

// Exemple d'URL: /admin/public/users
const schemaName = pathParts[2];
const tableName = pathParts[3];

console.log("SchemaName:", schemaName);
console.log("TableName:", tableName);

document.getElementById("validateColumnsBtn").addEventListener("click", async () => {
  // Récupérer les colonnes saisies
  const columnsToAdd = postColumnsJSON();

  if (columnsToAdd.length === 0) {
    alert("Aucune colonne valide à ajouter !");
    return;
  }

  console.log("Colonnes à ajouter :", columnsToAdd);

  // Préparer le payload exactement comme attendu par FastAPI
  const payload = { schema_name: schemaName, table_name: tableName, columns: columnsToAdd };

  console.log("Payload envoyé :", payload);

  try {
    const response = await fetch("/app/method/post/add_column/postgre/synchrone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)  // ✅ CORRECT
    });

    console.log("Réponse fetch :", response);

    if (!response.ok) throw new Error("Erreur serveur : " + response.status);

    const result = await response.json();
    alert("✅ Colonnes ajoutées avec succès !");
    window.location.reload();

  } catch (err) {
    alert("❌ Erreur : " + err.message);
    console.error(err);
  }
});