// add_column.js
import { createTypeSelect } from "../postgreSql_data/list_type_data.js";

export function addColumn() {
    // Créer une ligne <tr>
    const tr = document.createElement("tr");
    tr.className = "column";

    // Première cellule avec l'input
    const tdInput = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.name = "column_name";
    input.placeholder = "Nom de colonne";
    input.required = true;
    tdInput.appendChild(input);

    // Deuxième cellule avec le select
    const tdSelect = document.createElement("td");
    const select = createTypeSelect();
    tdSelect.appendChild(select);

    // Ajouter les cellules à la ligne
    tr.appendChild(tdInput);
    tr.appendChild(tdSelect);

    // Ajouter la ligne au tableau
    document.getElementById("columnsBody").appendChild(tr);
}

// Remplir le premier select déjà présent dans le HTML
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("typeSelectContainer");
    if (!container) return;

    const select = createTypeSelect("type_of_column", "typeSelect");
    container.appendChild(select);
});

// Attacher l’événement au bouton
document.getElementById("addColumnBtn").addEventListener("click", addColumn);
