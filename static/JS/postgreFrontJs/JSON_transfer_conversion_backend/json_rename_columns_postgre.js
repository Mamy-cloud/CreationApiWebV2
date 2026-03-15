// json_rename_columns.js

import { getColumnRenameInfo } from "../component_ui/method_crud/rename_column/rename_one_column_form_postgre.js";

export function createRenameColumnsJSON() {

  const info = getColumnRenameInfo();

  // Ici tu peux gérer plusieurs colonnes si besoin
  const json = {
    schema_name: info.schema_name,
    table_name: info.table_name,
    columns: [
      {
        old_name_name: info.old_name,
        new_name: info.new_name
      }
    ]
  };

  return json;
}

//-------------------------------multi columns-------------------------------
import { renamedColumns } from "../component_ui/method_crud/rename_column/display_multi_colums_list.js";

export function getRenameColumnsData() {

  const pathParts = window.location.pathname.split("/");

  const schemaName = pathParts[2];
  const tableName = pathParts[3];

  const columns = renamedColumns.map(col => ({
    old_name_name: col.old_name,
    new_name: col.new_name
  }));

  console.log("donné json_rename multi col", schemaName);
  console.log("donné json_rename multi col", tableName);
  console.log("donné json_rename multi col", columns);
  
  

  return {
    schema_name: schemaName,
    table_name: tableName,
    columns: columns
  };

}