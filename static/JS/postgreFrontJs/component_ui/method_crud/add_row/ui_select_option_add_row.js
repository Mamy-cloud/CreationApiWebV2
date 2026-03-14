

export function initAddColumnUI() {

    const select = document.getElementById("crudMethodSelect");
    const divBtnAddRow = document.getElementById("container_btn_add_column_postgre");
    const divContainerAddRow = document.getElementById("rowsTablePostgre");
    const divContainerDisplayRow = document.getElementById("rowsTable");
    divBtnAddRow.style.display = "none";
    divContainerAddRow.style.display = "none";

    if (!select || !divBtnAddRow) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename table
        if (value === "add_row") {
            divBtnAddRow.style.display = "inline-flex";
            divContainerDisplayRow.style.display = "none";
            divContainerAddRow.style.display = "table-row-group";
           
        } 
        else {
            divBtnAddRow.style.display = "none";
            divContainerDisplayRow.style.display = "table-row-group";
            divContainerAddRow.style.display = "none";
            
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initAddColumnUI();
});