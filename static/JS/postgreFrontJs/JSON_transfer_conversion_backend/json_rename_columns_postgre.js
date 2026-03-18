// json_rename_columns.js

import { getColumnRenameInfo } from "../component_ui/method_crud/rename_column/rename_one_column_form_postgre.js";

export function createRenameColumnsJSON() {

  const info = getColumnRenameInfo();

  const json = {
    columns: [
      {
        old_name: info.old_name,
        new_name: info.new_name
      }
    ]
  };

  return json;
}

//-------------------------------multi columns-------------------------------
import { renamedColumns } from "../component_ui/method_crud/rename_column/display_multi_colums_list.js";

export function getRenameColumnsData() {

  const columns = renamedColumns.map(col => ({
    old_name: col.old_name,
    new_name: col.new_name
  }));

  console.log("columns à renommer:", columns);

  return {
    columns: columns
  };
}