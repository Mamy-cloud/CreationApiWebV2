// verif_rename_table.js

import { verifierNom, afficherResultats } from '../gestion_error_name.js';

export function verifNameTablePostgre() {

  const input = document.querySelector("input[name='newName']");
  const columnBlock = document.querySelector(".verification_error[data-target='newName']");

  if (!input || !columnBlock) return false;

  const resultats = verifierNom(input.value);

  afficherResultats(resultats, columnBlock);

  return resultats.isValid;
}


// validation en temps réel
document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("input", (e) => {

    if (e.target.name === "newName") {
      verifNameTablePostgre();
    }

  });

});