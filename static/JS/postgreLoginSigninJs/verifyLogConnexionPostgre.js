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
  .addEventListener("submit", verifLoginUserPasswordToBackend);