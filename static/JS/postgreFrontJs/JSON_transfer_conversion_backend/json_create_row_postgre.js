export function constructJsonForRow() {
  // 1️⃣ Récupérer le nom de la table
  const pathParts = window.location.pathname.split("/");
  const schemaName = pathParts[2];
  const tableName = document.getElementById("tableTitlePostgre").textContent.trim();

  // 2️⃣ Récupérer les colonnes en excluant "id"
  const thead = document.getElementById("columnsTable");
  const thElements = Array.from(thead.querySelectorAll("th"));

  // Vérifie si la première colonne est "id"
  const firstIsId = thElements[0]?.dataset.column?.toLowerCase() === "id";

  // Construire le tableau des colonnes sans "id"
  const columns = thElements
    .map(th => th.dataset.column)
    .filter(col => col && col.toLowerCase() !== "id");

  // 3️⃣ Parcourir les lignes
  const tbody = document.getElementById("rowsTablePostgre");
  const rows = Array.from(tbody.querySelectorAll("tr"))
    .filter(tr => {
      const inputs = tr.querySelectorAll("input");
      return Array.from(inputs).some(input => input.value.trim() !== "");
    })
    .map(tr => {
      const cells = Array.from(tr.querySelectorAll("td"));
      const rowObj = {};

      columns.forEach((colName, index) => {
        const cellIndex = firstIsId ? index + 1 : index;
        const input = cells[cellIndex]?.querySelector("input");

        rowObj[colName] = input && input.value.trim() !== "" ? input.value : null;
      });

      return rowObj;
    });

  // 4️⃣ Retour du JSON final
  return {
    schema_name: schemaName,
    table_name: tableName,
    columns: columns,
    rows: rows
  };
}