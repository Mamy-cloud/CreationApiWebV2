
// create_db.js
export function initCreateDbMenu() {
    const createDbDiv = document.querySelector(".menu_create_db_postgre");

    if (!createDbDiv) {
        console.error("Div 'menu_create_db_postgre' introuvable !");
        return;
    }

    createDbDiv.addEventListener("click", () => {

        // Vérifie si le container existe déjà
        let existingContainer = document.querySelector(".nav_create_db_postgre");
        if (existingContainer) {
            existingContainer.remove(); // toggle : on supprime si déjà présent
            return;
        }

        // Crée le container nav
        const nav = document.createElement("nav");
        nav.className = "nav_create_db_postgre";

        const pSchema = document.createElement("h3");
        pSchema.textContent = "Créer schema";

        // ajoute la redirection au clic
        pSchema.addEventListener("click", () => {
            window.location.href = "/admin/method/create/schema/postgresql/interface/views";
        });

        const pTable = document.createElement("h3");
        pTable.textContent = "Créer table";
        pTable.addEventListener("click", () => {
            window.location.href = "/admin/method/create/table/postgresql/interface/views";
        });

        nav.append(pSchema, pTable);

        // Insère le nav juste après le div cliqué
        createDbDiv.insertAdjacentElement("afterend", nav);

        // ---- Positionner à droite du div ----
        nav.style.position = "fixed";          // fixe par rapport à l'écran
        nav.style.top = "0";                   // depuis le haut
        nav.style.left = "90px";                 // collé à droite
        nav.style.width = "20vw";              // 50% de la largeur de l'écran
        nav.style.height = "100vh";            // toute la hauteur
        nav.style.backgroundColor = "#1a5c0c"; // couleur de fond
        nav.style.borderLeft = "1px solid #ccc";
        nav.style.padding = "20px";
        
        nav.style.overflowY = "auto";          // scroll si contenu trop grand
        nav.style.zIndex = "1000";
    });
}