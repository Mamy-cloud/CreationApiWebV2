function loadPostgreMenu() {

    const menu = document.getElementById("id_menu_global_postgre");

    if (!menu) {
        console.error("menu introuvable : id_menu_global_postgre");
        return;
    }

    // ---- premier bloc ----
    const divDisplay = document.createElement("div");
    divDisplay.id = "id_menu_style_postgre";
    divDisplay.className = "menu_display_table_postgre";

    const imgTable = document.createElement("img");
    imgTable.src = "/static/img/postgre/menu/icons8-table-100.png";
    imgTable.alt = "list-table";

    const pDisplay = document.createElement("p");
    pDisplay.textContent = "Choose";

    const pTable = document.createElement("p");
    pTable.textContent = "table";

    divDisplay.append(imgTable, pDisplay, pTable);

    // ---- deuxième bloc ----
    const divCrud = document.createElement("div");
    divCrud.id = "id_menu_style_postgre";
    divCrud.className = "menu_method_crud_postgre";

    const imgCrud = document.createElement("img");
    imgCrud.src = "/static/img/postgre/menu/icons8-crud-64.png";
    imgCrud.alt = "method-crud";

    const pMethod = document.createElement("p");
    pMethod.textContent = "method";

    const pCrud = document.createElement("p");
    pCrud.textContent = "crud";

    divCrud.append(imgCrud, pMethod, pCrud);

    // ---- insertion dans le menu ----
    menu.append(divDisplay, divCrud);
}

document.addEventListener("DOMContentLoaded", loadPostgreMenu);