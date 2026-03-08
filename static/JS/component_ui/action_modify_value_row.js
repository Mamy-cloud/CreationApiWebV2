// action_modify_row.js
// Module pour gérer la modification des valeurs dans le tableau
import { mapSqlTypeToHtmlInput } from "../postgreSql_data/input_type.js";

export function initModifyValueRows() {
  const tbody = document.getElementById("columnsTypeDataTableList");
  if (!tbody) return;

  // Event Delegation : fonctionne même si le tableau est recréé
  tbody.addEventListener("click", (e) => {
    const modifyBtn = e.target.closest("button");
    if (!modifyBtn || modifyBtn.textContent !== "Modifier valeur") return;

    const actionTd = modifyBtn.parentElement;
    const clearBtn = actionTd.querySelector("button:nth-child(2)");
    const row = actionTd.parentElement;
    const valueTd = row.children[1];

    // Ignorer si la ligne est la colonne id
    if (modifyBtn.disabled) return;

    // cacher les boutons initiaux
    modifyBtn.style.display = "none";
    clearBtn.style.display = "none";

    // récupérer le type SQL depuis le data-attribute
    const columnType = row.children[0].dataset.type;

    // créer l'input en fonction du type SQL
    const inputConfig = mapSqlTypeToHtmlInput(columnType, 0); // 0 = index si nécessaire
    let inputElement;

    if (inputConfig.custom) {
      // cas spécial comme BOOLEAN avec radios
      inputElement = inputConfig.custom;
    } else {
      inputElement = document.createElement("input");
      inputElement.type = inputConfig.type;
      inputElement.value = valueTd.textContent !== "null" ? valueTd.textContent : "";
    }

    valueTd.innerHTML = "";
    valueTd.appendChild(inputElement);

    // créer boutons Valider / Annuler
    const validateBtn = document.createElement("button");
    validateBtn.textContent = "Valider";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Annuler";

    actionTd.appendChild(validateBtn);
    actionTd.appendChild(cancelBtn);

    // bouton ANNULER
    cancelBtn.addEventListener("click", () => {
      valueTd.textContent = inputElement.value || "null";
      validateBtn.remove();
      cancelBtn.remove();
      modifyBtn.style.display = "";
      clearBtn.style.display = "";
    });

    // bouton VALIDER
    validateBtn.addEventListener("click", () => {
      valueTd.textContent = inputElement.value || "null";
      // ici tu peux faire l'appel API pour sauvegarder la nouvelle valeur
      validateBtn.remove();
      cancelBtn.remove();
      modifyBtn.style.display = "";
      clearBtn.style.display = "";
    });
  });
}

// Appel automatique lors du chargement du DOM
/* document.addEventListener("DOMContentLoaded", () => {
  initModifyValueRows();
}); */