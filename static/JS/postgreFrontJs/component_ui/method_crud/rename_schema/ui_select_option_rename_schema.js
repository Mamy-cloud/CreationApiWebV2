

export function initRenameSchema() {

    const select = document.getElementById("crudMethodSelect");
    const divRenameSchema = document.getElementById("rename_schema_postgre");
    divRenameSchema.style.display = "none";

    //--------------------affichage du nom du schema--------------------
    const divNameSchema = document.getElementById("schemaTitlePostgre");
    const pathParts = window.location.pathname.split("/");
    // Exemple URL : /admin/public/users
    const schemaName = pathParts[2];

    divNameSchema.textContent = schemaName.trim();
    //-------------------fin affichage nom du schema--------------------


    if (!select || !divRenameSchema) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename table
        if (value === "rename_schema") {
            divRenameSchema.style.display = "block";
            
           
        } 
        else {
            divRenameSchema.style.display = "none";
            
            
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initRenameSchema();
});