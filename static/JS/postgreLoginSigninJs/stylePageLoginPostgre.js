export function stylePageSiginSignupPostgre(){
    const formLoginPostgre = document.getElementById("loginFormPostgreSync");
    const formSignUpPostgre = document.getElementById("signupFormPostgreSync");
    const textVerifyUser = document.getElementById("idVerifyUserPostgre");
    const textCreateDb = document.getElementById("textInviteCreateUserPostgre");
    const textInviteConnect = document.getElementById("textInviteConnectPostgre");

    formSignUpPostgre.style.display = "none";
    

    textCreateDb.addEventListener("click", () => {
        //style formulaire de souscription
        formSignUpPostgre.style.display = "flex";
        formSignUpPostgre.style.flexDirection = "column";
        formSignUpPostgre.style.alignItems = "center";
        formSignUpPostgre.style.justifyContent = "center";

        //style formulaire login
        formLoginPostgre.style.display = "none";
    });

    textInviteConnect.addEventListener("click", () => {
        
        //style formulaire login
        formLoginPostgre.style.display = "flex";

        //style formulaire de souscription
        formSignUpPostgre.style.display = "none";
    });
}

document.addEventListener("DOMContentLoaded", () =>{
    stylePageSiginSignupPostgre();
})