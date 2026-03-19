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

    //modifier nom schema
    const option6 = document.createElement("option");
    option6.value = "rename_schema";
    option6.textContent = "renommer le schema";

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

    //renommer colonne
    const option4 = document.createElement("option");
    option4.value = "rename_column";
    option4.textContent = "renommer une ou plusieurs colonnes";

    //modifier valeur ligne
    const option5 = document.createElement("option");
    option5.value = "modify_value_row";
    option5.textContent = "modifier une ou plusieurs lignes";

    //supprimer table / schema
    const option7 = document.createElement("option");
    option7.value = "delete_schema_table";
    option7.textContent = "supprimer table";

    //supprimer colonne
    const option8 = document.createElement("option");
    option8.value = "delete_one_multi_col";
    option8.textContent = "supprimer des colonnes";

    // ajout des options dans le select
    select.append(defaultOption, option6, option1, option2, option3, option4, option5, option7, option8);

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