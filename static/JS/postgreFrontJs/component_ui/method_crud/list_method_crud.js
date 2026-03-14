// list_method_crud.js

// -------------------------------
// Fonction principale pour créer le select CRUD
// -------------------------------
export function listMethodCrudPostgre(containerId = "list_method_crud_postgre") {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`container introuvable : ${containerId}`);
        return;
    }

    // création du select
    const select = document.createElement("select");
    select.id = "crudMethodSelect";

    // option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "method post / put / delete";
    defaultOption.selected = true;

    // option 1 : renommer table
    const option1 = document.createElement("option");
    option1.value = "rename_table";
    option1.textContent = "renommer la table";

    // option 2 : ajouter colonne
    const option2 = document.createElement("option");
    option2.value = "add_column";
    option2.textContent = "ajouter une ou plusieurs colonnes";

    //ajouter ligne
    const option3 = document.createElement("option");
    option3.value = "add_row";
    option3.textContent = "ajouter une ou plusieurs lignes";

    // ajout des options dans le select
    select.append(defaultOption, option1, option2, option3);

    // ajout du select dans le div
    container.appendChild(select);

    // --- événement facultatif pour naviguer selon le choix ---
    select.addEventListener("change", (e) => {
        const value = e.target.value;

        /* if (value === "add_columns") {
            window.location.href = "/admin/post/add/columns";
         } */ /*else if (value === "add_rows") {
            window.location.href = "/admin/post/add/rows";
        } */
    });

}

// -------------------------------
// Appel automatique si nécessaire
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    listMethodCrudPostgre();
});