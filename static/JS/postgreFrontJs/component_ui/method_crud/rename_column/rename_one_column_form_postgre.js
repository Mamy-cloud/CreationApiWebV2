// rename_one_column_form.js

export function getColumnRenameInfo() {
  
  const params = new URLSearchParams(window.location.search);

  const old_name = params.get("column");
  const column_type = params.get("type"); // si tu veux l’utiliser pour l’affichage

  const path = window.location.pathname.split("/");

  const schema_name = path[2];
  const table_name = path[3];

  

  const new_name_input = document.getElementById("new_one_column_name");
  const new_name = new_name_input ? new_name_input.value.trim() : "";

  return {
    schema_name,
    table_name,
    old_name,
    new_name
  };
}

