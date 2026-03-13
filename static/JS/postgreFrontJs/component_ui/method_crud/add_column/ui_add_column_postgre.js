

export function initAddColumnUI() {

    const select = document.getElementById("crudMethodSelect");
    const divContainerAddColumn = document.getElementById("containerAddColumnPostgre");
    const divContainerDisplayTable = document.getElementById("container_table_postgre");
    divContainerAddColumn.style.display = "none";

    if (!select || !divContainerAddColumn) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename table
        if (value === "add_column") {
            divContainerAddColumn.style.display = "block";
            divContainerDisplayTable.style.display = "none";
        } 
        else {
            divContainerAddColumn.style.display = "none";
            divContainerDisplayTable.style.display = "block";
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initAddColumnUI();
});