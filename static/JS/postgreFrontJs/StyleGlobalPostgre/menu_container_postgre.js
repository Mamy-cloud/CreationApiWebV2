import { selectedMenuPostgre } from "./selected_menu_postgre.js";
import { initCreateDbMenu } from "./create_db_postgre.js";

function loadPostgreMenu() {

    const menu = document.getElementById("id_menu_global_postgre");

    if (!menu) {
        console.error("menu introuvable : id_menu_global_postgre");
        return;
    }

    // ------------------ --------premier bloc ---------------------------------
    
   // ---- div principale ----
    const divDisplay = document.createElement("div");
    divDisplay.className = "menu_create_db_postgre";
    divDisplay.id = "id_menu_style_postgre";

    // ---- main ----
    const main = document.createElement("main");

    const imgTable = document.createElement("img");
    imgTable.src = "/static/img/postgre/menu/icons8-create-db-66.png";
    imgTable.alt = "create-db";

    const pDisplay = document.createElement("p");
    pDisplay.textContent = "Create";

    const pTable = document.createElement("p");
    pTable.textContent = "db";

    main.append(imgTable, pDisplay, pTable);

    // ---- ajout main dans div ----
    divDisplay.appendChild(main);

    // ---- insertion dans le menu ----
    menu.appendChild(divDisplay);

    // ---- initialisation du menu create DB pour le <nav> ----
    initCreateDbMenu();

    // ------------------------------- deuxième bloc ---------------------------------------
    const divCrud = document.createElement("div");
    divCrud.id = "id_menu_style_postgre";
    divCrud.className = "menu_choose_table_postgre";

    const imgCrud = document.createElement("img");
    imgCrud.src = "/static/img/postgre/menu/icons8-table-100.png";
    imgCrud.alt = "method-crud";

    const pMethod = document.createElement("p");
    pMethod.textContent = "Processing";

    const pCrud = document.createElement("p");
    pCrud.textContent = "table";

    divCrud.append(imgCrud, pMethod, pCrud);
    divCrud.addEventListener("click", () => {
            window.location.href = "/admin/method/get/tables/schema/postgresql/interface/views";
        });

    // ---- insertion dans le menu ----
    menu.append(divDisplay, divCrud);

    // activation du système de sélection
    selectedMenuPostgre();
}

document.addEventListener("DOMContentLoaded", loadPostgreMenu);