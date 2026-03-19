import { deleteMultiCol } from "../component_ui/method_crud/rename_column/display_multi_colums_list.js";

export function generateJsonDeleteColumns() {
    // Retourne un objet JS, pas une string
    return {
        columns: deleteMultiCol
    };
}