/* import { verifierRenameColumn } from "../../../gestion_error/rename_columns/verif_multi_col.js";

// tableau global pour stocker les colonnes renommées
export const renamedColumns = [];

//-----------affichage des colonnes sous forme de ligne pour faire plusieurs modifs---------
export function listTableHeader() {

  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const tbody = document.getElementById("columnsTableList");
  if (!tbody) return;

  fetch(`/app/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`)
    .then(response => response.json())
    .then(data => {

      const columns = data.columns;

      tbody.innerHTML = "";

      columns.forEach((col) => {

        const row = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = col.name;

        

        const actionTd = document.createElement("td");

        const renameBtn = document.createElement("button");
        renameBtn.textContent = "Renommer";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Supprimer";

        // empêcher modification de la colonne id
        if (col.name === "id") {
          renameBtn.style.display = "none";
          deleteBtn.style.display = "none";
        }

    //---------------------------------action renommer plusieurs colonnes-----------------
        renameBtn.addEventListener("click", () => {

          const oldName = col.name;

          // rendre supprimer transparent
          deleteBtn.disabled = true;

          const input = document.createElement("input");
          input.type = "text";
          input.id = "new_one_column_name";
          input.placeholder = "Nouveau nom colonne";
          input.required = true;
          input.value = oldName;

          const errorDiv = document.createElement("div");
          errorDiv.className = "verification_error";
          errorDiv.dataset.target = "new_one_column_name";

          

          const validateBtn = document.createElement("button");
          validateBtn.type = "submit";
          validateBtn.id = "rename_one_column_button";
          validateBtn.textContent = "valider";

          

          const cancelBtn = document.createElement("button");
          cancelBtn.textContent = "Annuler";

          nameTd.innerHTML = "";
          nameTd.appendChild(input);
          nameTd.appendChild(errorDiv);

          input.addEventListener("input", () => {
            verifierRenameColumn(nameTd);
          });

          verifierRenameColumn(nameTd);

          actionTd.appendChild(validateBtn);
          actionTd.appendChild(cancelBtn);

          renameBtn.disabled = true;

          // bouton VALIDER
          validateBtn.addEventListener("click", () => {

            const newName = input.value.trim();

            if (!newName) {
              alert("Nom invalide");
              return;
            }

            // stocker seulement la modification
            renamedColumns.push({
              old_name: oldName,
              new_name: newName
            });

            console.log("donné column list", renamedColumns);
            

            nameTd.textContent = newName;

            validateBtn.remove();
            cancelBtn.remove();

            renameBtn.disabled = false;
            deleteBtn.disabled = false;

          });
          //--------------------------------- fin action renommer plusieurs colonnes-----------------

          // bouton ANNULER
          cancelBtn.addEventListener("click", () => {

            nameTd.textContent = oldName;

            validateBtn.remove();
            cancelBtn.remove();

            renameBtn.disabled = false;
            deleteBtn.style.opacity = "1";

          });

        });

        actionTd.appendChild(renameBtn);
        actionTd.appendChild(deleteBtn);

        row.appendChild(nameTd);
        row.appendChild(actionTd);

        tbody.appendChild(row);

      });

    })
    .catch(error => {
      console.error("Erreur chargement colonnes :", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  listTableHeader();
});

 */

import { injectRules, verifierNomMultiCol } from "../../../gestion_error/rename_columns/verif_multi_col.js";
import { startSpinner , stopSpinner } from "../../../../animate_spin.js";

// tableau global pour stocker les colonnes renommées
export const renamedColumns = [];

//-----------affichage des colonnes sous forme de ligne pour faire plusieurs modifs---------
export function listTableHeader() {

  const pathParts = window.location.pathname.split("/");
  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const tbody = document.getElementById("columnsTableList");
  if (!tbody) return;

  async function loadColumns() {

    startSpinner()

  try {

    const response = await fetch(`/app/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`);
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 10));

    const columns = data.columns;
    tbody.innerHTML = "";

    columns.forEach((col) => {

      const row = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = col.name;

      const actionTd = document.createElement("td");

      const renameBtn = document.createElement("button");
      renameBtn.type = "button";
      renameBtn.textContent = "Renommer";

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Supprimer";

      // empêcher modification de la colonne id
      if (col.name === "id") {
        renameBtn.style.display = "none";
        deleteBtn.style.display = "none";
      }

      //---------------------------------action renommer plusieurs colonnes-----------------
      renameBtn.addEventListener("click", () => {

        const oldName = col.name;

        deleteBtn.style.display = "none";
        renameBtn.style.display = "none";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Nouveau nom colonne";
        input.required = true;
        input.value = oldName;

        const errorDiv = document.createElement("div");
        errorDiv.className = "verification_error";
        injectRules(errorDiv);

        nameTd.innerHTML = "";
        nameTd.appendChild(input);
        nameTd.appendChild(errorDiv);

        const validateBtn = document.createElement("button");
        validateBtn.type = "button";
        validateBtn.textContent = "Valider";
        validateBtn.disabled = true;

        input.addEventListener("input", () => verifierNomMultiCol(input, errorDiv, validateBtn));
        verifierNomMultiCol(input, errorDiv, validateBtn);

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Annuler";

        actionTd.innerHTML = "";
        actionTd.appendChild(validateBtn);
        actionTd.appendChild(cancelBtn);

        // bouton VALIDER
        validateBtn.addEventListener("click", () => {
          const newName = input.value.trim();
          if (!newName) {
            alert("Nom invalide");
            return;
          }

          renamedColumns.push({ old_name: oldName, new_name: newName });

          nameTd.innerHTML = "";
          const span = document.createElement("span");
          span.textContent = newName;
          nameTd.appendChild(span);

          renameBtn.style.display = "inline-block";
          deleteBtn.style.display = "inline-block";

          actionTd.innerHTML = "";
          actionTd.appendChild(renameBtn);
          actionTd.appendChild(deleteBtn);
        });

        // bouton ANNULER
        cancelBtn.addEventListener("click", () => {
          nameTd.innerHTML = "";
          const span = document.createElement("span");
          span.textContent = oldName;
          nameTd.appendChild(span);

          renameBtn.style.display = "inline-block";
          deleteBtn.style.display = "inline-block";

          actionTd.innerHTML = "";
          actionTd.appendChild(renameBtn);
          actionTd.appendChild(deleteBtn);
        });
      });
      //--------------------------------- fin action renommer -----------------

      actionTd.appendChild(renameBtn);
      actionTd.appendChild(deleteBtn);

      row.appendChild(nameTd);
      row.appendChild(actionTd);

      tbody.appendChild(row);

    });

  } catch (error) {
    console.error("Erreur chargement colonnes :", error);
  } finally {
    // ici tu peux stopper un spinner ou faire des actions qui doivent toujours s’exécuter
    console.log("Chargement terminé");
    stopSpinner();
  }

}

// Appel de la fonction
loadColumns();
}

document.addEventListener("DOMContentLoaded", () => {
  listTableHeader();
});