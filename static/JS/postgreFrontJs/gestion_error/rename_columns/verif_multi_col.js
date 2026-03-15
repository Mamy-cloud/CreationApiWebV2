// gestion_error_name_multi_col.js

// injecte les règles dans un div verification_error
export function injectRules(div) {
  const wrapper = document.createElement("div");

  const rules = [
    { cls: "rule1", text: "Minuscules uniquement" },
    { cls: "rule2", text: "Pas d’accents, pas d’espaces, pas d’apostrophes, pas de caractère spécial" },
    { cls: "rule3", text: "Pas de chiffre au début mais on peut les mettre après une lettre" }
  ];

  rules.forEach(rule => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = rule.cls;
    checkbox.disabled = true;

    const label = document.createElement("label");
    label.className = `label ${rule.cls}-label`;
    label.textContent = rule.text;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    wrapper.appendChild(document.createElement("br"));
  });

  div.appendChild(wrapper);
}

// fonction qui vérifie le nom et active/désactive le bouton valider
export function verifierNomMultiCol(input, div, validateBtn) {
  if (!input || !div || !validateBtn) return false;

  const rule1 = /^[a-z0-9_]+$/.test(input.value);
  const rule2 = /^[a-z0-9_]+$/.test(input.value);
  const rule3 = /^[a-z][a-z0-9_]*$/.test(input.value);

  const isValid = rule1 && rule2 && rule3;

  // mise à jour des checkboxes et labels
  const majEtat = (ruleOk, checkbox, label) => {
    if (!checkbox || !label) return;
    checkbox.checked = ruleOk;
    label.style.color = ruleOk ? "green" : "red";

    // icône
    const oldIcon = label.querySelector("span.icon");
    if (oldIcon) oldIcon.remove();
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = ruleOk ? " ✅" : " ❌";
    label.appendChild(icon);
  };

  majEtat(rule1, div.querySelector(".rule1"), div.querySelector(".rule1-label"));
  majEtat(rule2, div.querySelector(".rule2"), div.querySelector(".rule2-label"));
  majEtat(rule3, div.querySelector(".rule3"), div.querySelector(".rule3-label"));

  // active ou désactive le bouton Valider
  validateBtn.disabled = !isValid;

  return isValid;
}