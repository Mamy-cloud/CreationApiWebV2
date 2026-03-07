import { SelectRenameDeleteColumns } from "./select_rename_delete_columns.js";

//---------------------affichage des colonne sous forme de thead--------------------------------------------

export function buildTableHeader(thead, columns, schema_name, table_name) {

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
    typeDiv.textContent = col.type;

    // div pour les actions
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("column-actions");

    // passer schema et table
    const select = SelectRenameDeleteColumns(schema_name, table_name);

    // 🔒 Bloquer les actions si la colonne est "id"
    if (col.name === "id") {
      select.disabled = true;
      select.title = "id non modifiable";
    }

    actionDiv.appendChild(select);

    th.appendChild(nameDiv);
    th.appendChild(typeDiv);
    th.appendChild(actionDiv);

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
}


