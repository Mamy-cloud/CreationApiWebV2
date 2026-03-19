// rename_table_ui_postgre.js

export function initDeleteTableSchemaUI() {

    const select = document.getElementById("crudMethodSelect");
    const BtnContainerDeleteTable = document.getElementById("delete_table_postgre");
    
    BtnContainerDeleteTable.style.display = "none";

    if (!select || !BtnContainerDeleteTable) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename table
        if (value === "delete_schema_table") {
            BtnContainerDeleteTable.style.display = "inline-block";
            
        } 
        else {
            BtnContainerDeleteTable.style.display = "none";
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initDeleteTableSchemaUI();
});