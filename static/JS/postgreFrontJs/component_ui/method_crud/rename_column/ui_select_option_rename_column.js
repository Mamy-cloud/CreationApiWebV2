

export function initRenameColumnUI() {

    const select = document.getElementById("crudMethodSelect");
    const divTextIndicationRenameColumn = document.getElementById("text_indication_modify_column_postgre");
   
    divTextIndicationRenameColumn.style.display = "none";

    if (!select || !divTextIndicationRenameColumn) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename column ou supprimer les colonnes
        if (value === "rename_column" || value === "delete_one_multi_col") {
            
            divTextIndicationRenameColumn.style.display = "block";
           
        } 
        else {
            divTextIndicationRenameColumn.style.display = "none";
            
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initRenameColumnUI();
});