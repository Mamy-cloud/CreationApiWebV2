// showPassword.js
export function togglePasswordVisibility() {
  const passwordInput = document.querySelector(".getPasswordToShow");
  const checkbox = document.getElementById("showPassword");

  if (!passwordInput || !checkbox) return; // sécurité si éléments non trouvés

  checkbox.addEventListener("change", () => {
    passwordInput.type = checkbox.checked ? "text" : "password";
  });
}

// Appel de la fonction directement à l'intérieur du module
togglePasswordVisibility();