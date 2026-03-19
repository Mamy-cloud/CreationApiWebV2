// json_delete_column_postgre.js

// On importe le tableau global qui contient toutes les colonnes sélectionnées
import { valueColumnName } from "../component_ui/display_table_column_row/display_table_header_postgre.js";

export function jsonDeleteColumns() {
    return {
        columns: [...valueColumnName] // on fait une copie pour éviter les modifications directes
    };
}
