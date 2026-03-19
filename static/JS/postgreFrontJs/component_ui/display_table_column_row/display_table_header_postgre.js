import { SelectRenameDeleteColumns } from "./select_rename_delete_columns_postgre.js";

// Tableau global pour stocker les colonnes sélectionnées
export let valueColumnName = [];

//---------------------affichage des colonnes sous forme de thead--------------------------------------------
export function buildTableHeaderPostgre(thead, columns, schema_name, table_name, onDeleteColumn) {

  // Vide le thead avant de reconstruire
  thead.innerHTML = "";

  const headerRow = document.createElement("tr");

  columns.forEach((col) => {
    const th = document.createElement("th");

    // ✅ conserver les infos dans le HTML
    th.dataset.column = col.name;
    th.dataset.type = col.type;

    // div pour le nom de la colonne
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("column-name");
    nameDiv.textContent = col.name;

    // div pour afficher le type
    const typeDiv = document.createElement("div");
    typeDiv.classList.add("column-type");
    typeDiv.textContent = `(${col.type})`;

    // div pour les actions
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("column-actions");

    // création du select
    const select = SelectRenameDeleteColumns();

    // 🔒 Bloquer les actions si la colonne est "id"
    if (col.name === "id") {
      select.style.display = "none";
    }

    // 🔹 Événement sur le select
    select.addEventListener("change", (e) => {
      if (e.target.value === "delete_one_col") {
        const columnName = th.dataset.column?.trim();
        if (!columnName) return;

        // ✅ Ajouter la colonne au tableau global s'il n'y est pas déjà
        if (!valueColumnName.includes(columnName)) {
          valueColumnName.push(columnName);
        }

        console.log("Colonnes sélectionnées pour suppression :", valueColumnName);

        // ✅ callback si fourni
        if (typeof onDeleteColumn === "function") {
          onDeleteColumn(columnName, schema_name, table_name);
        }

        // 🔄 reset du select à valeur neutre
        e.target.value = "";
      }
    });

    actionDiv.appendChild(select);

    th.appendChild(nameDiv);
    th.appendChild(typeDiv);
    th.appendChild(actionDiv);

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
}