import { buildSchemaJsonPostgre } from "../JSON_transfer_conversion_backend/json_create_schema_postgre.js";
/* import { setData } from "../JSON_transfer_conversion_backend/conserve_json.js"; */

const button = document.getElementById("create_schema_btn_postgre");
const input = document.getElementById("create_schema_postgre");

button.addEventListener("click", async () => {
    try {
        // 1️⃣ Construire le JSON
        const schemaJson = buildSchemaJsonPostgre(input.value);

        // 2️⃣ Appel API POST
        const response = await fetch("/app/postgre/sync/method/post/schema", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(schemaJson)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // 3️⃣ Stocker la réponse
        //setData("created_schema", data);

        console.log("Schéma créé avec succès :", data);
        alert("Schéma créé avec succès")

        // 4️⃣ Reset input
        input.value = "";
        window.location.reload();

    }
     catch (error) {
        console.error("Erreur lors de la création du schéma :", error.message);
        alert(error.message);
    }
});