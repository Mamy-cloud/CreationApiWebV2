// actionSelect.js
export function SelectRenameDeleteColumns(schema_name, table_name) {

  const select = document.createElement("select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Action";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  const renameOption = document.createElement("option");
  renameOption.value = "rename";
  renameOption.textContent = "Renommer";

  const deleteOption = document.createElement("option");
  deleteOption.value = "delete";
  deleteOption.textContent = "Supprimer";

  const renameMultipleOption = document.createElement("option");
  renameMultipleOption.value = "rename_multiple";
  renameMultipleOption.textContent = "Renommer plusieurs colonnes";

  const deleteMultipleOption = document.createElement("option");
  deleteMultipleOption.value = "delete_multiple";
  deleteMultipleOption.textContent = "Supprimer plusieurs colonnes";

  select.appendChild(defaultOption);
  select.appendChild(renameOption);
  select.appendChild(deleteOption);
  select.appendChild(renameMultipleOption);
  select.appendChild(deleteMultipleOption);

  // 🎯 gestion des actions
  select.addEventListener("change", function () {

    // récupérer le th parent
    const th = this.closest("th");
    const pathParts = window.location.pathname.split("/");

    // Exemple d'URL: /admin/public/users
    const schema_name = pathParts[2];
    const table_name = pathParts[3];
    const column_name = th.dataset.column;
    const column_type = th.dataset.type;

    if (this.value === "rename") {

      window.location.href =
      `/admin/${schema_name}/${table_name}/modify_colonnes/rename_one_column?column=${column_name}&type=${column_type}`;

    }

    if (this.value === "rename_multiple") {

      window.location.href =
      `/admin/${schema_name}/${table_name}/modify_colonnes/rename_multi_column`;

    }

  });

  return select;
}