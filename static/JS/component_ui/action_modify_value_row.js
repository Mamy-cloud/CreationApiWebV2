import { mapSqlTypeToHtmlInput } from "../postgreSql_data/input_type.js";

// 🔹 objet global pour stocker les modifications
export const columnUpdates = {};

/**
 * Initialise les boutons "Modifier valeur" et "Vider valeur"
 */
export function initModifyValueRows() {
  const tbody = document.getElementById("columnsTypeDataTableList");
  if (!tbody) return;

  tbody.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const row = btn.closest("tr");
    if (!row) return;

    const actionTd = row.querySelector("td:last-child"); // dernière colonne = actions
    const valueTd = row.children[1]; // colonne des valeurs

    const columnName = row.children[0].dataset.column || row.children[0].textContent.trim();
    const columnType = row.children[0].dataset.type;

    const modifyBtn = actionTd.querySelector("button:nth-child(1)");
    const clearBtn = actionTd.querySelector("button:nth-child(2)");

    // --------- Modifier valeur ----------
    if (btn === modifyBtn && !modifyBtn.disabled) {
      // supprimer anciens boutons validate / cancel
      actionTd.querySelectorAll("button.validate, button.cancel").forEach(b => b.remove());

      modifyBtn.style.display = "none";
      clearBtn.style.display = "none";

      // créer l'input approprié selon le type
      const inputConfig = mapSqlTypeToHtmlInput(columnType, 0);
      let inputElement = inputConfig.custom || document.createElement("input");
      if (!inputConfig.custom) {
        inputElement.type = inputConfig.type;
        inputElement.value = valueTd.textContent !== "null" ? valueTd.textContent : "";
      }

      valueTd.innerHTML = "";
      valueTd.appendChild(inputElement);

      // créer boutons Valider / Annuler
      const validateBtn = document.createElement("button");
      validateBtn.type = "button";
      validateBtn.textContent = "Valider";
      validateBtn.classList.add("validate");

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.textContent = "Annuler";
      cancelBtn.classList.add("cancel");

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
        let newValue;
        if (columnType.toUpperCase() === "BOOLEAN") {
          const checked = row.querySelector("input[type='radio']:checked");
          newValue = checked ? checked.value === "true" : null;
        } else {
          newValue = inputElement.value.trim();
          if (newValue === "" || newValue.toLowerCase() === "null") newValue = null;
          if (["INTEGER","REAL","NUMERIC"].includes(columnType.toUpperCase()) && newValue !== null) {
            newValue = Number(newValue);
          }
        }

        // 🔹 Stocker directement dans columnUpdates
        columnUpdates[columnName] = newValue;

        valueTd.textContent = newValue ?? "null";
        validateBtn.remove();
        cancelBtn.remove();
        modifyBtn.style.display = "";
        clearBtn.style.display = "";
        console.log("action modify", columnName, newValue, columnUpdates);
      });
    }

    // --------- Vider valeur ----------
    if (btn === clearBtn && !clearBtn.disabled) {
      const input = valueTd.querySelector("input");
      if (input) input.remove();

      valueTd.textContent = "null";

      columnUpdates[columnName] = null;
      console.log("action modify vider valeur", columnName, null, columnUpdates);
    }
  });
}