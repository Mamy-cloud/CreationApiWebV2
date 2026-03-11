

// get_create_table.js
import { addColumn } from "../component_ui/display_create_table_column/add_column_postgre.js";
import { postColumnsJSON } from "../JSON_transfer_conversion_backend/create_json_column_postgre.js";

document.getElementById("createTableFormPostgre").addEventListener("submit", async function(e) {
    e.preventDefault();

    const schemaSelect = document.querySelector(".select_schema_postgre select").value;

    const tableName = document.getElementById("tableNamePostgre").value;

    // ⚡ Récupérer toutes les lignes <tr> du tableau en JSON
    const columns = postColumnsJSON();

    console.log(columns);
    

    const payload = { schema_name: schemaSelect, table_name: tableName, columns: columns };

    console.log(payload);
    

    try {
        const response = await fetch("/app/postgre/synchrone/method/post_create_table", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        alert("✅ La demande est bien remplie, le JSON a été transféré dans le backend !");
        console.log("Réponse du backend :", result);
        alert(JSON.stringify(result, null, 2));
        window.location.reload();

    } catch (error) {
        alert("❌ Il y a eu une erreur. Veuillez vérifier la console.log !");
        console.error("Erreur lors du transfert du JSON :", error);
    }
});
