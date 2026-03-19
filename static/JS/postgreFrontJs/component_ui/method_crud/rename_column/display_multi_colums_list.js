
import { injectRules, verifierNomMultiCol } from "../../../gestion_error/rename_columns/verif_multi_col.js";
import { startSpinner , stopSpinner } from "../../../../animate_spin.js";

// tableau global pour stocker les colonnes renommées
export const renamedColumns = [];
export const deleteMultiCol = [];

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
      renameBtn.textContent = "renommer ou annuler renommage";

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "supprimer ou annuler suppression";

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
        validateBtn.textContent = "Valider nouveau nom";
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


      //----------------------------début action supprimer multi col-----------
      deleteBtn.addEventListener("click", () => {

        const colNameForDelete = col.name;

        deleteBtn.style.display = "none";
        renameBtn.style.display = "none";

        const validateBtn = document.createElement("button");
        validateBtn.type = "button";
        validateBtn.textContent = "Valider la suppression";
        

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Annuler";

        actionTd.innerHTML = "";
        actionTd.appendChild(validateBtn);
        actionTd.appendChild(cancelBtn);

        // bouton VALIDER
        validateBtn.addEventListener("click", () => {
            deleteMultiCol.push(colNameForDelete);

            console.log(deleteMultiCol);
            

            // restaurer les boutons
            renameBtn.style.display = "inline-block";
            deleteBtn.style.display = "inline-block";

            // indiquer visuellement que la colonne est marquée pour suppression
            nameTd.style.backgroundColor = "#f5063a";

            // remettre les boutons d'action
            actionTd.innerHTML = "";
            actionTd.appendChild(renameBtn);
            actionTd.appendChild(deleteBtn);
        });

        // bouton ANNULER
        cancelBtn.addEventListener("click", () => {
            renameBtn.style.display = "inline-block";
            deleteBtn.style.display = "inline-block";

            // remettre le fond normal
            nameTd.style.backgroundColor = "";

            // retirer la colonne du tableau deleteMultiCol
            const index = deleteMultiCol.indexOf(colNameForDelete);
            if (index > -1) {
                deleteMultiCol.splice(index, 1); // supprime 1 élément à l'index trouvé
            }

            // restaurer les boutons d'action
            actionTd.innerHTML = "";
            actionTd.appendChild(renameBtn);
            actionTd.appendChild(deleteBtn);
        });
      });
      

      //----------------------------------fin action supprimer multi col-----------

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