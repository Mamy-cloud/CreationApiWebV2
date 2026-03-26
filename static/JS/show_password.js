export function togglePasswordVisibility() {
  document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.querySelector(".getPasswordToShow");
    const checkbox = document.getElementById("showPassword");
    if (!passwordInput || !checkbox) return;

    checkbox.addEventListener("change", () => {
      passwordInput.type = checkbox.checked ? "text" : "password";
    });
  });
}

togglePasswordVisibility();