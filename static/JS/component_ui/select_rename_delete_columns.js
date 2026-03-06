// actionSelect.js
export function SelectRenameDeleteColumns() {
  const select = document.createElement("select");

  // option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Action";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  // option renommer une colonne
  const renameOption = document.createElement("option");
  renameOption.value = "rename";
  renameOption.textContent = "Renommer";

  // option supprimer une colonne
  const deleteOption = document.createElement("option");
  deleteOption.value = "delete";
  deleteOption.textContent = "Supprimer";

  // option renommer plusieurs colonnes
  const renameMultipleOption = document.createElement("option");
  renameMultipleOption.value = "rename_multiple";
  renameMultipleOption.textContent = "Renommer plusieurs colonnes";

  // option supprimer plusieurs colonnes
  const deleteMultipleOption = document.createElement("option");
  deleteMultipleOption.value = "delete_multiple";
  deleteMultipleOption.textContent = "Supprimer plusieurs colonnes";

  select.appendChild(defaultOption);
  select.appendChild(renameOption);
  select.appendChild(deleteOption);
  select.appendChild(renameMultipleOption);
  select.appendChild(deleteMultipleOption);

  return select;
}