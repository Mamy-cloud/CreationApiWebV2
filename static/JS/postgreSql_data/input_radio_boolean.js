// input_boolean.js
export function createBooleanInput(i) {
  const td = document.createElement("td");

  // même name pour grouper les radios
  const groupName = `bool_${i}_${Date.now()}`;

  const radioTrue = document.createElement("input");
  radioTrue.type = "radio";
  radioTrue.name = groupName;
  radioTrue.value = "true";

  const labelTrue = document.createElement("label");
  labelTrue.textContent = "True";

  const radioFalse = document.createElement("input");
  radioFalse.type = "radio";
  radioFalse.name = groupName;
  radioFalse.value = "false";

  const labelFalse = document.createElement("label");
  labelFalse.textContent = "False";

  td.appendChild(radioTrue);
  td.appendChild(labelTrue);
  td.appendChild(radioFalse);
  td.appendChild(labelFalse);

  return td;
}
