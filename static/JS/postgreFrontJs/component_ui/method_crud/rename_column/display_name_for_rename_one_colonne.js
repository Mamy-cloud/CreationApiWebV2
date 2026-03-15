// display_name_for_rename_one_colonne.js
export function fillColumnInfo() {
    const params = new URLSearchParams(window.location.search);

    const old_name = params.get("column");
    console.log("nom actuel :", old_name);
    
    const column_type = params.get("type"); // si tu veux l’utiliser pour l’affichage


    const oldNameElement = document.getElementById("old_name");
    const columnTypeElement = document.getElementById("column_type");

    if (oldNameElement) oldNameElement.textContent = old_name;
}

// Appel automatique au chargement du DOM
document.addEventListener("DOMContentLoaded", fillColumnInfo);