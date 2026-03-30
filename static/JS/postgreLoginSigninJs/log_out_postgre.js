import { startSpinner, stopSpinner } from "../animate_spin.js";

export async function logOutSessionToBackend() {

  const confirmLogout = window.confirm("Confirmez-vous la déconnexion ?");
  if (!confirmLogout) return;

  startSpinner();

  try {
    const response = await fetch(`/logout/from/session/postgre/sync`, {
      method: "POST",
      credentials: "include"
    });

    // 🔥 vérifier si la requête a réussi
    if (!response.ok) {
      console.log(`Erreur serveur: ${response.status}`);
    }

    // ✅ supprimer seulement si succès
    localStorage.removeItem("access_token");

    alert("Session déconnectée");

    // 🔁 redirection
    window.location.href = `/admin/login/sigin/creation/add/password/postgresql/sync/interface/views`;

  } catch (error) {

    console.error("Erreur logout:", error);
    alert("❌ Erreur lors de la déconnexion");

  } finally {
    stopSpinner();
  }
}