/* 
  import { SelectRenameDeleteColumns } from "./select_rename_delete_columns.js";

export function buildTableHeader(thead, columns) {
  // Vide le thead avant de reconstruire
  thead.innerHTML = "";

  const headerRow = document.createElement("tr");

  columns.forEach((col) => {
    const th = document.createElement("th");

    // garder le type en mémoire sur le html
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

    const select = SelectRenameDeleteColumns();
    actionDiv.appendChild(select);

    // ajout dans le th
    th.appendChild(nameDiv);
    th.appendChild(typeDiv);
    th.appendChild(actionDiv);

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
} */

import { SelectRenameDeleteColumns } from "./select_rename_delete_columns.js";

export function buildTableHeader(thead, columns) {
  // Vide le thead avant de reconstruire
  thead.innerHTML = "";

  const headerRow = document.createElement("tr");

  columns.forEach((col) => {
    const th = document.createElement("th");

    // garder le type en mémoire sur le html
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

    const select = SelectRenameDeleteColumns();

    // 🔒 Bloquer les actions si la colonne est "id"
    if (col.name === "id") {
      select.disabled = true;
      select.title = "id non modifiable";
    }

    actionDiv.appendChild(select);

    // ajout dans le th
    th.appendChild(nameDiv);
    th.appendChild(typeDiv);
    th.appendChild(actionDiv);

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
}