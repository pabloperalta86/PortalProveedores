const inputUsuario = document.getElementById("floatingInput");
const inputContrasenia = document.getElementById("floatingPassword");
const inputRecordarme = document.getElementById("recordarme");
const formIngresar = document.getElementById("formIngresar");

const getLoginPortal = JSON.parse(localStorage.getItem("loginPortal"))[0];

formIngresar.onsubmit = (event) =>{
    event.preventDefault();
    
    if (getLoginPortal.usuario !== inputUsuario.value || getLoginPortal.contrasenia !== inputContrasenia.value) {
        alert("El usuario/contraseña ingresados no son correctos");
        formIngresar.reset();
    } else {
        sessionStorage.setItem("usuarioActivo", true)
        window.location.href = "../index.html"
    }
}


// desafio operadores avanzados
const objetoDesafio = {codigo:"001",nombre:"pablo",apellido:"peralta",pais:"argentina"};

//operador ternario
objetoDesafio.pais === "argentina" ? console.log("Es de argentina") : console.log("Es extranjero");

//operador and 
objetoDesafio.pais === "argentina" && console.log("Es de argentina");

//operador or 
const comprobantesGuardadosDesafio = JSON.parse(localStorage.getItem("comprobantesGuardados")) || [];

//optimizacion
console.log(objetoDesafio?.domicilios?.calle || "No existe el elemento");

//desestructuracion
const {codigo,nombre,apellido,pais} = objetoDesafio;
console.log(codigo,nombre,apellido,pais);

//spread
const objetoDesafioConDomicilio = {...objetoDesafio, domicilio:"calle falsa 123" } 
console.log(objetoDesafioConDomicilio);

