export function selectedMenuPostgre() {

    const menuItems = document.querySelectorAll("#id_menu_global_postgre > div");

    // récupérer l'index sauvegardé
    const savedIndex = localStorage.getItem("selectedMenuPostgre");

    if (savedIndex !== null && menuItems[savedIndex]) {
        menuItems[savedIndex].classList.add("menu_selected_postgre");
    }

    menuItems.forEach((item, index) => {

        item.addEventListener("click", () => {

            // retirer ancienne sélection
            menuItems.forEach(el => {
                el.classList.remove("menu_selected_postgre");
            });

            // ajouter sélection
            item.classList.add("menu_selected_postgre");

            // sauvegarder index
            localStorage.setItem("selectedMenuPostgre", index);

        });

    });

}