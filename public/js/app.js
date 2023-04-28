console.log("Vinculado")
const iniciar = document.getElementById("iniciar");
const salir = document.getElementById("salir")
const perfil = document.getElementById("perfil")
const registro = document.getElementById("registro")
const navbar = document.getElementById("navbar")

document.addEventListener("click", (e) => {
    if (e.target.dataset.short) {
        const url = `${window.location.origin}/${e.target.dataset.short}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log("Text copied to clipboard...");
            })
            .catch((err) => {
                console.log("Something went wrong", err);
            });
    }
});

// document.addEventListener('DOMContentLoaded', (e) => {


//     perfil.classList.add("d-none")
//     salir.classList.add("d-none")
//     iniciar.classList.remove("d-none")
//     registro.classList.remove("d-none")



//     if (!localStorage.getItem(e.target.dataset)) {
//         console.log("entro al if")

//         perfil.classList.remove("d-none")
//         salir.classList.remove("d-none")
//         iniciar.classList.add("d-none")
//         registro.classList.add("d-none")
//         return

//     }

// })

