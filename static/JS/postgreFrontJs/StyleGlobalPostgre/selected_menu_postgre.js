export function selectedMenuPostgre() {

    const menuItems = document.querySelectorAll("#id_menu_global_postgre > div");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            // enlever la sélection précédente
            menuItems.forEach(el => {
                el.classList.remove("menu_selected_postgre");
            });

            // ajouter la sélection
            item.classList.add("menu_selected_postgre");

        });

    });

}