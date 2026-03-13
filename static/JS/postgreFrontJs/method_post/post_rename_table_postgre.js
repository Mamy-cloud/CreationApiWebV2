// Récupère l'URL et extrait schema_name et table_name
const pathParts = window.location.pathname.split("/");

// Exemple d'URL: /admin/public/users
const schemaName = pathParts[2]; // 2ème segment = {schema_name}
console.log("SchemaName", schemaName);

const oldName = pathParts[3];    // 3ème segment = {table_name}
console.log("oldName", oldName);


document.getElementById("renameTableForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newName = document.getElementById("newName").value;

  // Prépare le JSON complet attendu par le backend
  const payload = {
    schema_name: schemaName,
    old_name: oldName,
    new_name: newName
  };
  console.log("Json à envoyer", payload);
  

  try {
    const response = await fetch(`/app/postgre/synchrone/method/crud/post/rename_table`, {
      
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("envoi back-end", response);
    

    if (!response.ok) {
      throw new Error("Erreur serveur: " + response.status);
    }

    const result = await response.json();
    alert("✅ " + result.message);

    // Recharge la page admin de la table renommée
    window.location.href = `/admin/${schemaName}/${newName}/postgresql/interface/views`;

  } catch (error) {
    alert("❌ Erreur: " + error.message);
    console.error(error);
  }
});