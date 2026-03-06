import { createSchemaSelect } from "./list_schema.js";

export function renderSchemaTable(data) {
    if (!Array.isArray(data)) {
        console.error("Format invalide :", data);
        data = [];
    }

    const container = document.getElementById("schema_container");
    container.replaceChildren();

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thSchema = document.createElement("th");
    thSchema.textContent = "Schema";

    const thTables = document.createElement("th");
    thTables.textContent = "Tables";

    headerRow.appendChild(thSchema);
    headerRow.appendChild(thTables);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const row = document.createElement("tr");

    const schemaCell = document.createElement("td");
    const tablesCell = document.createElement("td");

    const select = createSchemaSelect(data);
    schemaCell.appendChild(select);

    select.addEventListener("change", (event) => {
        const selectedSchema = event.target.value;
        tablesCell.replaceChildren();

        if (!selectedSchema) return;

        const schemaData = data.find(
            s => s.schema_name === selectedSchema
        );

        if (
            schemaData &&
            Array.isArray(schemaData.table_name) &&
            schemaData.table_name.length > 0
        ) {
            schemaData.table_name.forEach(tableName => {
                const line = document.createElement("div");
                line.style.display = "flex";
                line.style.alignItems = "center";
                line.style.gap = "8px";

                const tableLabel = document.createElement("span");
                tableLabel.textContent = tableName;

                const openButton = document.createElement("button");
                openButton.textContent = "Ouvrir";

                openButton.addEventListener("click", () => {
                    // ✅ correction ici
                    window.location.href = `/admin/${selectedSchema}/${tableName}`;
                });

                line.appendChild(tableLabel);
                line.appendChild(openButton);
                tablesCell.appendChild(line);
            });
        } else {
            const emptyLine = document.createElement("div");
            emptyLine.textContent = "Aucune table";
            tablesCell.appendChild(emptyLine);
        }
    });

    row.appendChild(schemaCell);
    row.appendChild(tablesCell);
    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
}