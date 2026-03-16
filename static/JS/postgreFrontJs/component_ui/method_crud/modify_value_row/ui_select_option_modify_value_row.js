

export function initModifyValueRowUI() {

    const select = document.getElementById("crudMethodSelect");
    const divTextIndicationModifyRow = document.getElementById("text_indication_modify_row_postgre");
   
    divTextIndicationModifyRow.style.display = "none";

    if (!select || !divTextIndicationModifyRow) {
        console.warn("Select CRUD ou formulaire rename introuvable");
        return;
    }

    select.addEventListener("change", (e) => {

        const value = e.target.value;

        // afficher formulaire rename column
        if (value === "modify_value_row") {
            
            divTextIndicationModifyRow.style.display = "block";
           
        } 
        else {
            divTextIndicationModifyRow.style.display = "none";
            
        }

    });

}

// initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    initModifyValueRowUI();
});