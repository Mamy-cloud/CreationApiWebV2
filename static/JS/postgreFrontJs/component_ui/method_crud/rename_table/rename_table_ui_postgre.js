// rename_table_ui_postgre.js

export function initRenameTableUI() {

    const select = document.getElementById("crudMethodSelect");
    const formContainer = document.getElementById("rename_table_postgre");
    const divContainerAddcolumn = document.getElementById("containerAddColumnPostgre");
    
    formContainer.style.display = "none";

    if (!select || !formContainer) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename table
        if (value === "rename_table") {
            formContainer.style.display = "block";
            divContainerAddcolumn.style.display = "none";
        } 
        else {
            formContainer.style.display = "none";
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initRenameTableUI();
});