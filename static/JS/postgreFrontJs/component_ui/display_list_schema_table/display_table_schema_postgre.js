
import { createSchemaSelectPostgre } from "./list_schema_postgre.js";

export function renderSchemaTablePostgre(data) {
    if (!Array.isArray(data)) {
        console.error("Format invalide :", data);
        data = [];
    }

    const container = document.getElementById("schema_container_postgres");
    container.replaceChildren();

    // ---- div principal simulant le tableau ----
    const outerTable = document.createElement("div");
    outerTable.className = "div_schema_table_postgre"

    // ---- entêtes ----
    const thSchema = document.createElement("div");
    thSchema.className= "header_grid_schema_postgre"
    thSchema.textContent = "Schema";
    

    const thTable = document.createElement("div");
    thTable.className = "head_table_name_div_postgre"
    thTable.textContent = "Tables";

    outerTable.append(thSchema, thTable);

    // ---- cellule schema (select) ----
    const schemaCell = document.createElement("div");
    schemaCell.style.border = "1px solid #ffffff";
    schemaCell.style.padding = "6px";
    schemaCell.style.backgroundColor = "#6206f5";


    const select = createSchemaSelectPostgre(data);
    schemaCell.appendChild(select);

    // ---- cellule tables/action ----
    const tablesCell = document.createElement("div");
    tablesCell.style.border = "1px solid #ffffff";
    tablesCell.style.padding = "4px";

    outerTable.append(schemaCell, tablesCell);
    container.appendChild(outerTable);

    // ---- événement change du select ----
    select.addEventListener("change", (event) => {
        const selectedSchema = event.target.value;
        tablesCell.replaceChildren();

        if (!selectedSchema) return;

        const schemaData = data.find(s => s.schema_name === selectedSchema);

        if (schemaData && Array.isArray(schemaData.table_name) && schemaData.table_name.length > 0) {
            // chaque table devient une ligne grid
            schemaData.table_name.forEach(tableName => {
                const row = document.createElement("div");
                row.style.display = "grid";
                row.style.gridTemplateColumns = "1fr auto"; // tableName | bouton
                row.style.alignItems = "center";
                row.style.padding = "4px 0";
                row.style.gap = "8px";
                row.style.borderBottom = "1px solid #ccc";

                const tableNameDiv = document.createElement("div");
                tableNameDiv.textContent = tableName;

                const actionDiv = document.createElement("div");
                const openButton = document.createElement("button");
                openButton.textContent = "Open";
                openButton.addEventListener("click", () => {
                    window.location.href = `/admin/${selectedSchema}/${tableName}/postgresql/interface/views`;
                });
                actionDiv.appendChild(openButton);

                row.append(tableNameDiv, actionDiv);
                tablesCell.appendChild(row);
            });
        } else {
            const emptyDiv = document.createElement("div");
            emptyDiv.textContent = "Aucune table";
            emptyDiv.style.textAlign = "center";
            tablesCell.appendChild(emptyDiv);
        }
    });
}