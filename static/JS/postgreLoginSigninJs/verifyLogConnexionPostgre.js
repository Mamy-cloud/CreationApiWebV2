/* import { startSpinner, stopSpinner } from "../animate_spin.js";

export function verifLoginUserPasswordToBackend(event) {
  event.preventDefault();

  // ✅ Correction IDs
  const username = document.getElementById("loginIdUserPostgreSync").value;
  const password = document.getElementById("loginIdPasswordPostgreSync").value;

  const jsonData = {
    username: username,
    password_hash: password
  };

  if (!username || !password) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  console.log("JSON envoyé :", jsonData);

  async function verifLogUser(jsonData) {
    startSpinner();

    try {
      const response = await fetch(`/verif/login/db/postgre/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();
      console.log( "réponse du back-end : ", result);

      // ✅ Correction ici
      if (result.success) {
        alert("✅ " + result.message);
        alert("token est généré")

        // redirection uniquement si succès
        window.location.href = `/admin/method/get/tables/schema/postgresql/interface/views`;
      } else {
        alert("❌ " + result.message);
      }

    } catch (error) {
      console.error("Erreur :", error);
      alert("❌ Erreur serveur");
    } finally {
      stopSpinner();
    }
  }

  verifLogUser(jsonData);
}

// ✅ Listener OK
document
  .getElementById("loginFormPostgreSync")
  .addEventListener("submit", verifLoginUserPasswordToBackend); */

import { startSpinner, stopSpinner } from "../animate_spin.js";

export function verifLoginUserPasswordToBackend(event) {
  event.preventDefault();

  // ✅ Correction IDs
  const username = document.getElementById("loginIdUserPostgreSync").value;
  const password = document.getElementById("loginIdPasswordPostgreSync").value;

  const jsonData = {
    username: username,
    password_hash: password
  };

  if (!username || !password) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  console.log("JSON envoyé :", jsonData);

  async function verifLogUser(jsonData) {
    startSpinner();

    try {
      // 🔹 Étape 1 : Vérification login
      const response = await fetch(`/verif/login/db/postgre/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();
      console.log("réponse du back-end : ", result);

      if (result.success) {
        alert("✅ " + result.message);
        alert("Token est généré");

        // 🔹 Étape 2 : Création clé API
        try {
          const apiResponse = await fetch(`/create/api_key/hashed/postgre/sync`, {
            method: "POST",
            // le cookie user_id est déjà envoyé automatiquement si SameSite / Path correct
            credentials: "include" 
          });

          const apiResult = await apiResponse.json();
          console.log("API key response :", apiResult);

          if (apiResponse.ok) {
            console.log("Clé API gérée :", apiResult);
          } else {
            console.warn("Erreur création clé API :", apiResult.message);
          }
        } catch (err) {
          console.error("Erreur appel API key :", err);
        }

        // 🔹 Étape 3 : redirection uniquement si succès
        window.location.href = `/admin/method/get/tables/schema/postgresql/interface/views`;

      } else {
        alert("❌ " + result.message);
      }

    } catch (error) {
      console.error("Erreur :", error);
      alert("❌ Erreur serveur");
    } finally {
      stopSpinner();
    }
  }

  verifLogUser(jsonData);
}

// ✅ Listener OK
document
  .getElementById("loginFormPostgreSync")
  .addEventListener("submit", verifLoginUserPasswordToBackend);