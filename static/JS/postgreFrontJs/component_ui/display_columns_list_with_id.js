// display_column_list_with_id.js
import { initModifyValueRows } from "./action_modify_value_row.js";

// tableau global pour stocker les types de colonnes
export const columnTypes = {};

//-----------affichage des colonnes avec type de données et valeurs---------
export function displayColumnTypeDataList() {

  const pathParts = window.location.pathname.split("/");
  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const tbody = document.getElementById("columnsTypeDataTableList");
  if (!tbody) return;

  const urlParams = new URLSearchParams(window.location.search);
  const rowId = urlParams.get("id");

  fetch(`/admin/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`)
    .then(response => response.json())
    .then(data => {

      const columns = data.columns;
      const rows = data.rows;
      tbody.innerHTML = "";

      const currentRow = rows.find(r => String(r.id) === rowId);

      columns.forEach((col) => {

        const row = document.createElement("tr");

        // colonne "Nom de la colonne"
        const nameTd = document.createElement("td");
        nameTd.dataset.column = col.name;
        nameTd.dataset.type = col.type;

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("column-name");
        nameDiv.textContent = col.name;

        const typeDiv = document.createElement("div");
        typeDiv.classList.add("column-type");
        typeDiv.textContent = col.type;

        nameTd.appendChild(nameDiv);
        nameTd.appendChild(typeDiv);

        columnTypes[col.name] = col.type;

        // colonne "Valeur"
        const valueTd = document.createElement("td");
        let valueText = "";
        if (currentRow && currentRow[col.name] !== undefined && currentRow[col.name] !== null) {
          valueText = currentRow[col.name];
        } else {
          valueText = "null";
        }
        valueTd.textContent = valueText;

        // colonne "Actions"
        const actionTd = document.createElement("td");

        const modifyBtn = document.createElement("button");
        modifyBtn.type = "button";
        modifyBtn.textContent = "Modifier valeur";

        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.textContent = "Vider valeur";

        if (col.name === "id") {
          modifyBtn.disabled = true;
          clearBtn.disabled = true;
          modifyBtn.title = "La colonne id ne peut pas être modifiée";
          clearBtn.title = "La colonne id ne peut pas être vidée";
        }

        actionTd.appendChild(modifyBtn);
        actionTd.appendChild(clearBtn);

        row.appendChild(nameTd);
        row.appendChild(valueTd);
        row.appendChild(actionTd);

        tbody.appendChild(row);
      });

      // Initialiser les actions des boutons après avoir construit le tableau
      initModifyValueRows();
    })
    .catch(error => {
      console.error("Erreur chargement colonnes :", error);
    });
}

// exécution au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  displayColumnTypeDataList();
});