document.querySelectorAll(".verification_password").forEach(container => {
  const wrapper = document.createElement("div");

  const rules = [
    { cls: "rule1", text: "Au moins 8 caractères" },
    { cls: "rule2", text: "Au moins une lettre minuscule (a-z)" },
    { cls: "rule3", text: "Au moins une lettre majuscule (A-Z)" },
    { cls: "rule4", text: "Au moins un chiffre (0-9)" },
    { cls: "rule5", text: "Au moins un caractère spécial (@, #, !, %, …)" }
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

  container.appendChild(wrapper);
});

export function verifierMotDePasse(input) {
  const rule1 = /^.{8,}$/.test(input);           // au moins 8 caractères
  const rule2 = /[a-z]/.test(input);             // minuscule
  const rule3 = /[A-Z]/.test(input);             // majuscule
  const rule4 = /[0-9]/.test(input);             // chiffre
  const rule5 = /[^A-Za-z0-9]/.test(input);      // caractère spécial

  return { 
    rule1, 
    rule2, 
    rule3, 
    rule4, 
    rule5,
    isValid: rule1 && rule2 && rule3 && rule4 && rule5
  };
}

export function afficherResultatsPassword(resultats, container) {
  if (!container) return;

  const majEtat = (ruleOk, checkbox, label) => {
    if (!checkbox || !label) return;
    checkbox.checked = ruleOk;
    label.style.color = ruleOk ? "green" : "red";

    const oldIcon = label.querySelector("span.icon");
    if (oldIcon) oldIcon.remove();

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = ruleOk ? " ✅" : " ❌";
    label.appendChild(icon);
  };

  majEtat(resultats.rule1, container.querySelector(".rule1"), container.querySelector(".rule1-label"));
  majEtat(resultats.rule2, container.querySelector(".rule2"), container.querySelector(".rule2-label"));
  majEtat(resultats.rule3, container.querySelector(".rule3"), container.querySelector(".rule3-label"));
  majEtat(resultats.rule4, container.querySelector(".rule4"), container.querySelector(".rule4-label"));
  majEtat(resultats.rule5, container.querySelector(".rule5"), container.querySelector(".rule5-label"));
}