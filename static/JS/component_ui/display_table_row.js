export function buildTableRows(tbody, data, columns) {
  // Vide le tbody avant de reconstruire le tableau
  tbody.innerHTML = "";

  // Parcours chaque ligne
  data.rows.forEach((rowData) => {
    const row = document.createElement("tr");

    // Parcours chaque colonne
    columns.forEach((col, index) => {
      const td = document.createElement("td");

      // Affiche la valeur ou "null"
      const value = rowData[col.name];
      const textValue = value !== null && value !== undefined ? value : "null";

      // première colonne → afficher valeur + select
      if (index === 0) {

        // valeur de l'id
        const valueDiv = document.createElement("div");
        valueDiv.textContent = textValue;

        // select
        const select = document.createElement("select");

        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        optionDefault.textContent = "action sur la ligne";
        optionDefault.selected = true;

        const optionModify = document.createElement("option");
        optionModify.value = "update";
        optionModify.textContent = "modifier les valeurs";

        const optionDelete = document.createElement("option");
        optionDelete.value = "delete";
        optionDelete.textContent = "supprimer la ligne";

        select.appendChild(optionDefault);
        select.appendChild(optionModify);
        select.appendChild(optionDelete);

        // récupérer l'id de la ligne
        const rowId = rowData[columns[0].name];

        // récupérer schema_name et table_name depuis l'URL
        const pathParts = window.location.pathname.split("/");
        const schema_name = pathParts[2];
        const table_name = pathParts[3];

        // événement lors du changement
        select.addEventListener("change", function () {

          if (this.value === "update") {
            window.location.href =
              `/admin/${schema_name}/${table_name}/modify_row/value?id=${rowId}`;
          }

        });

        td.appendChild(valueDiv);
        td.appendChild(select);

      } else {

        td.textContent = textValue;

      }

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
}