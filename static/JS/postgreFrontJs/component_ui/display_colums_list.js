// tableau global pour stocker les colonnes renommées
export const renamedColumns = [];

//-----------affichage des colonnes sous forme de ligne pour faire plusieurs modifs---------
export function listTableHeader() {

  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const tbody = document.getElementById("columnsTableList");
  if (!tbody) return;

  fetch(`/admin/${schemaName}/${tableName}/methods/get/get_table/postgresql/json`)
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
          renameBtn.disabled = true;
          deleteBtn.disabled = true;

          renameBtn.title = "La colonne id ne peut pas être modifiée";
          deleteBtn.title = "La colonne id ne peut pas être supprimée";
        }

        renameBtn.addEventListener("click", () => {

          const oldName = col.name;

          // rendre supprimer transparent
          deleteBtn.style.opacity = "0.3";

          const input = document.createElement("input");
          input.type = "text";
          input.value = oldName;

          const validateBtn = document.createElement("button");
          validateBtn.textContent = "Valider";

          const cancelBtn = document.createElement("button");
          cancelBtn.textContent = "Annuler";

          nameTd.innerHTML = "";
          nameTd.appendChild(input);

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
            deleteBtn.style.opacity = "1";

          });

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