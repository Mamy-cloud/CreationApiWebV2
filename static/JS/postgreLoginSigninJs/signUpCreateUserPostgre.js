import { startSpinner, stopSpinner } from "../animate_spin.js";

export function sendUserPasswordToBackend(event) {
  event.preventDefault(); // 🔥 empêche le reload du formulaire

  // 🔹 Récupération des valeurs
  const username = document.getElementById("signupIdUserPostgreSync").value;
  const password = document.getElementById("signupIdPasswordPostgreSync").value;

  // 🔹 Construction du JSON
  const jsonData = {
    columns: ["username", "password_hash", "created_at"],
    rows: [
      {
        username: username,
        password_hash: password, // ⚠️ idéalement hash côté backend !
        created_at: new Date().toISOString()
      }
    ]
  };

  // 🔹 Sécurité minimale
  if (!username || !password) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  console.log("JSON envoyé :", jsonData);

  // 🔹 Envoi au backend
  async function addUser(jsonData) {
    startSpinner();

    try {
      const response = await fetch(
        `/create/user/log/postgre/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(jsonData)
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      const result = await response.json();
      console.log(result);
      

        if (result.success) {
        // Affiche tous les messages pour chaque utilisateur créé
        result.results.forEach(r => {
          alert(r.message);
        });
      } else {
        alert("❌ Erreur : " + (result.message || "Une erreur est survenue"));
      }
      window.location.href = `/admin/login/sigin/creation/add/password/postgresql/sync/interface/views`;

    } catch (error) {
      console.error("Erreur :", error);
      alert(`Erreur : ${JSON.stringify(error)}`);
    } finally {
      stopSpinner();
    }
  }

  addUser(jsonData);
}

// 🔥 Attacher au FORM (et pas à un bouton inexistant)
document
  .getElementById("signupFormPostgreSync")
  .addEventListener("submit", sendUserPasswordToBackend);