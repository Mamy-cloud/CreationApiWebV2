/* // tableRows.js

import { addRow } from "./add_row.js";
export function buildTableRows(tbody, data, columns) {
  tbody.innerHTML = "";

  for (let j = 0; j < data.rows.length; j++) {
    const row = document.createElement("tr");

    for (let i = 0; i < columns.length; i++) {
      const td = document.createElement("td");
      td.textContent = data.rows[j][columns[i].name] ?? "null";
      row.appendChild(td);
      
    }

    

    tbody.appendChild(row);
  }


}
 */

export function buildTableRows(tbody, data, columns) {
  // Vide le tbody avant de reconstruire le tableau
  tbody.innerHTML = "";

  // Parcours chaque ligne
  data.rows.forEach((rowData) => {
    const row = document.createElement("tr");

    // Parcours chaque colonne
    columns.forEach((col) => {
      const td = document.createElement("td");

      // Affiche la valeur ou "null" si undefined ou null
      const value = rowData[col.name];
      td.textContent = value !== null && value !== undefined ? value : "null";

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
}