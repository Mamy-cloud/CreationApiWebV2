import { columnUpdates } from "../component_ui/method_crud/modify_value_row/action_modify_value_row_postgre.js";

/**
 * Construit le JSON prêt à envoyer à l'API
 * Format BaseModel : columns = [{column_name, new_value}]
 */
export function buildModifyRowJson() {
  // Récupérer row_id depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  let row_id = urlParams.get("id");
  if (row_id !== null) row_id = Number(row_id);

  // fallback si pas d'id dans l'URL
  if (!row_id) {
    const rows = document.querySelectorAll("#columnsTypeDataTableList tr");
    rows.forEach(row => {
      const colName = row.children[0]?.dataset.column || row.children[0]?.textContent.trim();
      if (colName === "id") {
        const value = row.children[1]?.textContent;
        if (value) row_id = Number(value);
      }
    });
  }

  if (!row_id) {
    console.error("Impossible de déterminer l'id de la ligne !");
    return null;
  }

  // transformer columnUpdates en liste d'objets {column_name, new_value}
  const columns = Object.entries(columnUpdates).map(([column_name, new_value]) => ({
    column_name,
    new_value: new_value !== undefined ? new_value : null
  }));

  console.log("columns final pour API", columns);

  return {
    row_id,
    columns
  };
}

/**
 * Réinitialiser toutes les modifications
 */
export function resetColumnUpdates() {
  for (const key in columnUpdates) delete columnUpdates[key];
}