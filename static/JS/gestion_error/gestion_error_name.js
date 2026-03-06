// Injection du bloc HTML des règles dans tous les éléments ayant la classe "verification_name"
document.querySelectorAll(".verification_name").forEach(container => {
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
    checkbox.disabled = true; // ⚡ désactivé pour éviter clic manuel

    const label = document.createElement("label");
    label.className = `label ${rule.cls}-label`;
    label.textContent = rule.text;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    wrapper.appendChild(document.createElement("br"));
  });

  container.appendChild(wrapper);
});



// gestion_error_name.js
export function verifierNom(input) {
  const rule1 = /^[a-z0-9_]+$/.test(input);       // minuscules + chiffres + underscore
  const rule2 = /^[a-z0-9_]+$/.test(input);       // pas d’accents ni caractères spéciaux
  const rule3 = /^[a-z][a-z0-9_]*$/.test(input);  // commence par une lettre

  return { rule1, rule2, rule3, isValid: rule1 && rule2 && rule3 };
}


export function afficherResultats(resultats, container) {
  if (!container) return;

  const majEtat = (ruleOk, checkbox, label) => {
    if (!checkbox || !label) return;
    checkbox.checked = ruleOk;
    label.style.color = ruleOk ? "green" : "red";

    // Supprimer ancien icône si présent
    const oldIcon = label.querySelector("span.icon");
    if (oldIcon) oldIcon.remove();

    // Ajouter icône
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = ruleOk ? " ✅" : " ❌";
    label.appendChild(icon);
  };

  majEtat(resultats.rule1, container.querySelector(".rule1"), container.querySelector(".rule1-label"));
  majEtat(resultats.rule2, container.querySelector(".rule2"), container.querySelector(".rule2-label"));
  majEtat(resultats.rule3, container.querySelector(".rule3"), container.querySelector(".rule3-label"));
}


