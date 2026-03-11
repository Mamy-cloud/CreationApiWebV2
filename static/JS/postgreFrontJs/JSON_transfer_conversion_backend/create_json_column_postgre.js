// create_json_column.js
import { addColumn } from "../component_ui/display_create_table_column/add_column_postgre.js";

export function postColumnsJSON() {
  const rows = document.querySelectorAll("#columnsBody tr.column");
  const columns = [];

  rows.forEach(row => {
    const column_name = row.querySelector("input[name='column_name']")?.value.trim();
    const type_of_column = row.querySelector("select[name='type_of_column']")?.value;

    if (column_name && type_of_column) {
      columns.push({
        column_name: String(column_name),
        type_of_column: String(type_of_column)
      });
    }
  });

  return columns;
}