// animate_spin.js

export function startSpinner() {

    let spinner = document.getElementById("globalSpinner");

    // si le spinner n'existe pas encore
    if (!spinner) {

        spinner = document.createElement("div");
        spinner.id = "globalSpinner";

        document.body.appendChild(spinner);
    }

    spinner.style.display = "flex";
}

export function stopSpinner() {

    const spinner = document.getElementById("globalSpinner");

    if (spinner) {
        spinner.style.display = "none";
    }

}