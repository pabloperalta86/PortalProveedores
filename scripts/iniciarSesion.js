const inputUsuario = document.getElementById("floatingInput");
const inputContrasenia = document.getElementById("floatingPassword");
const inputRecordarme = document.getElementById("recordarme");
const formIngresar = document.getElementById("formIngresar");

const getLoginPortal = JSON.parse(localStorage.getItem("loginPortal"))[0];

formIngresar.onsubmit = (event) =>{
    event.preventDefault();
    
    if (getLoginPortal.usuario !== inputUsuario.value || getLoginPortal.contrasenia !== inputContrasenia.value) {
        swal("Error", "El usuario/contraseña ingresados no son correctos");
        formIngresar.reset();
    } else {
        sessionStorage.setItem("usuarioActivo", true)
        window.location.href = "../index.html"
    }
}