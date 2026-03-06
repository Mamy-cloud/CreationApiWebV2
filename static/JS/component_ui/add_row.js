import { mapSqlTypeToHtmlInput } from "../postgreSql_data/input_type.js";

export function addRow() {

  //----------------il faut d'abord récupérer le tableau qui charge--------
  const tbody = document.getElementById("rowsTable");
  const thead = document.getElementById("columnsTable");

  const columns = Array.from(thead.querySelectorAll("th")).map(th => ({
    name: th.textContent,
    type: th.dataset.type
  }));
  //-----------------------------------------------------------

  const tr = document.createElement("tr");

  columns.forEach((col, i) => {
    let td;

    if (i === 0) {
      td = document.createElement("td");
      td.textContent = "auto";
    } else {
      //------------type input venant du postgreSqldata/input_type.js
      const inputConfig = mapSqlTypeToHtmlInput(col.type, i);

      //radio venant du postgreSqldata/input_radio_boolean.js
      if (inputConfig.custom) {
        // BOOLEAN → radios
        td = inputConfig.custom;
      } else {
        td = document.createElement("td");
        const input = document.createElement("input");
        input.type = inputConfig.type;
        td.appendChild(input);
      }
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}

document.getElementById("addRowBtn").addEventListener("click", addRow);


/* import { mapSqlTypeToHtmlInput } from "../postgreSql_data/input_type.js";

export function addRow() {
  const tbody = document.getElementById("rowsTable");
  const thead = document.getElementById("columnsTable");

  const columns = Array.from(thead.querySelectorAll("th")).map(th => ({
    name: th.textContent.trim(),
    type: th.dataset.type
  }));

  const tr = document.createElement("tr");

  columns.forEach((col, i) => {
    let td;
    const inputConfig = mapSqlTypeToHtmlInput(col.type, i);

    if (inputConfig.custom) {
      // BOOLEAN → radios
      td = inputConfig.custom;
    } else {
      td = document.createElement("td");
      const input = document.createElement("input");
      input.type = inputConfig.type;
      td.appendChild(input);
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}

document.getElementById("addRowBtn").addEventListener("click", addRow);
 */