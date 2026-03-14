import { mapSqlTypeToHtmlInput } from "../../../postgreSql_data/input_type.js";

export function addRow() {

  //----------------il faut d'abord récupérer le tableau qui charge--------
  const tbody = document.getElementById("rowsTablePostgre");
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

/* import { mapSqlTypeToHtmlInput } from "../../../postgreSql_data/input_type.js";

export function addRow() {

  const tbody = document.getElementById("rowsTable");
  const thead = document.getElementById("columnsTable");

  if (!tbody || !thead) {
    console.error("thead ou tbody introuvable");
    return;
  }

  // récupérer les colonnes + types
  const columns = Array.from(thead.querySelectorAll("th")).map(th => ({
    name: th.dataset.column || th.textContent.trim(),
    type: th.dataset.type
  }));

  const tr = document.createElement("tr");
  tr.classList.add("row-add");

  columns.forEach((col, i) => {

    let td = document.createElement("td");

    // colonne ID auto
    if (i === 0) {
      td.textContent = "auto";
    } 
    else {

      const inputConfig = mapSqlTypeToHtmlInput(col.type, i);

      // BOOLEAN ou cas custom
      if (inputConfig.custom) {

        if (inputConfig.custom.tagName === "TD") {
          td = inputConfig.custom;
        } else {
          td.appendChild(inputConfig.custom);
        }

      } 
      else {

        const input = document.createElement("input");

        input.type = inputConfig.type || "text";
        input.name = col.name;

        // conserver les métadonnées
        input.dataset.column = col.name;
        input.dataset.type = col.type;

        td.appendChild(input);
      }
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}


// attendre le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("addRowBtn");

  if (!btn) {
    console.warn("Bouton addRowBtn introuvable");
    return;
  }

  btn.addEventListener("click", addRow);

}); */

/* import { mapSqlTypeToHtmlInput } from "../../../postgreSql_data/input_type.js";

export function addRow() {

  //----------------il faut d'abord récupérer le tableau qui charge--------
  const tbody = document.getElementById("rowsTable");
  const thead = document.getElementById("columnsTable");

  // afficher le tbody s'il est caché
  tbody.style.display = "";

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
      const inputConfig = mapSqlTypeToHtmlInput(col.type, i);

      if (inputConfig.custom) {
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

document.getElementById("addRowBtn").addEventListener("click", addRow); */
/* import { mapSqlTypeToHtmlInput } from "../../../postgreSql_data/input_type.js";

export function addRow() {

  // récupérer tbody et thead
  const tbody = document.getElementById("rowsTable");
  const thead = document.getElementById("columnsTable");

  if (!tbody || !thead) {
    console.error("thead ou tbody introuvable");
    return;
  }

  // afficher uniquement la nouvelle ligne, sans révéler les anciennes
  tbody.style.display = "table-row-group";

  // récupérer les colonnes + types
  const columns = Array.from(thead.querySelectorAll("th")).map(th => ({
    name: th.dataset.column || th.textContent.trim(),
    type: th.dataset.type
  }));

  // créer la ligne vide pour l'ajout
  const tr = document.createElement("tr");
  tr.classList.add("row-add");

  columns.forEach((col, i) => {
    let td = document.createElement("td");

    // id auto
    if (i === 0) {
      td.textContent = "auto";
    } else {
      const inputConfig = mapSqlTypeToHtmlInput(col.type, i);

      if (inputConfig.custom) {
        if (inputConfig.custom.tagName === "TD") {
          td = inputConfig.custom;
        } else {
          td.appendChild(inputConfig.custom);
        }
      } else {
        const input = document.createElement("input");
        input.type = inputConfig.type || "text";
        input.name = col.name;

        // conserver les meta
        input.dataset.column = col.name;
        input.dataset.type = col.type;

        td.appendChild(input);
      }
    }

    tr.appendChild(td);
  });

  // ajouter la ligne au tbody
  tbody.appendChild(tr);
}

// bouton addRowBtn
document.getElementById("addRowBtn").addEventListener("click", addRow); */