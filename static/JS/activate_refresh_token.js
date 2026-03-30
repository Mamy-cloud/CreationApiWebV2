// authAutoRefresh.js
// Module JS pour auto-refresh access_token basé sur expiration réelle + relance toutes les 2 min

let refreshTimeoutId = null;
let isRefreshing = false;
let refreshPromise = null;

// 🔹 Fonction pour rafraîchir le token
async function refreshAccessToken() {
  // 🔹 On ne vérifie plus document.cookie car access_token est httpOnly

  if (isRefreshing) return refreshPromise; // éviter doublons
  isRefreshing = true;

  // 🔹 Ajout d'un retardateur de 10 secondes avant l'appel
  await new Promise(resolve => setTimeout(resolve, 10000));

  refreshPromise = fetch("/refresh/token", {
    method: "POST",
    credentials: "include", // envoie le cookie httpOnly
  })
    .then(async res => {
      if (!res.ok) {
        throw new Error("Refresh failed");
      }
      const data = await res.json();
      //console.log("✅ Token rafraîchi automatiquement");

      // 🔹 Planifie le prochain refresh basé sur expires_at reçu
      scheduleNextRefresh(data.expires_at);

      return data.access_token;
    })
    .catch(err => {
      //console.error("❌ Refresh échoué", err);
      // Redirection seulement si refresh token invalide
      window.location.href = "/admin/login/sigin/creation/add/password/postgresql/sync/interface/views";
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

// 🔹 Planification automatique du prochain refresh
function scheduleNextRefresh(expirationISO) {
  const expireTime = new Date(expirationISO).getTime();
  const now = Date.now();

  // 3 secondes avant expiration
  const delay = Math.max(expireTime - now - 3000, 0);

  if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

  refreshTimeoutId = setTimeout(() => {
    refreshAccessToken();
  }, delay);

  //console.log(`⏱ Prochain refresh dans ${Math.round(delay / 1000)} sec`);
}

// 🔹 Fonction fetch sécurisé pour tes requêtes
export async function fetchWithAuth(url, options = {}) {
  options.credentials = "include";
  let response = await fetch(url, options);

  // Si access token expiré
  if (response.status === 401) {
    //console.warn("⚠️ Token expiré, refresh en cours...");
    await refreshAccessToken();
    response = await fetch(url, options); // rejoue la requête
  }

  return response;
}

// 🔹 Démarrage automatique dès import du module avec retardateur de 10 sec
refreshAccessToken();

// 🔹 Relance automatique toutes les 2 minutes pour s'assurer que le token est refreshé
setInterval(() => {
  refreshAccessToken();
}, 120000); // 120000 ms = 2 minutes

// 🔹 Export si besoin ailleurs
export { refreshAccessToken };