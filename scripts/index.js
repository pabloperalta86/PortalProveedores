function cargarArchivo(i,j){
    document.getElementById(i).src = URL.createObjectURL(document.getElementById(j).files[0]);
}

function validarNroComprobante(p){
    let nroComprobante = document.getElementById(p).value;
    if (nroComprobante.includes("-")) {
        let nroSeparado = nroComprobante.split("-");
        let puntoventa = "00000" + nroSeparado[0];
        let numero = "00000000" + nroSeparado[1];
        document.getElementById(p).value = puntoventa.substring(puntoventa.length - 5, puntoventa.length) + numero.substring(numero.length - 8, numero.length)
    } else if (nroComprobante.lenght !== 13) {
        alert("El numero ingresado debe tener 13 caracteres.");
    }
}

window.addEventListener('load',function(){
    document.getElementById('fechaComprobante').type= 'text';
    document.getElementById('fechaComprobante').addEventListener('blur',function(){
        document.getElementById('fechaComprobante').type= 'text';
    });
    document.getElementById('fechaComprobante').addEventListener('focus',function(){
        document.getElementById('fechaComprobante').type= 'date';
    });
});

/*
function fCambiarNombre(i) {
    if (document.getElementById(i).textContent === "PP") {
        document.getElementById(i).textContent = "Pablo1";
    } else if (document.getElementById(i).textContent = "Pablo1") {
        document.getElementById(i).textContent = "PP";
    } else {
            document.getElementById(i).textContent = "PPppppp"; 
    }
}

let cadena = "pepe";
alert(cadena.length);

let numero = "27.5";
alert(numero+27.5);

let objeto = {
    nombre: "Pablo",
    apellido: "Peralta"
}

let obj = objeto;
alert(obj.apellido);


for (i=1; i<=3; i=i+1){
    alert(i + " for");
}

i=1;
while (i<=3){
    alert(i + " while");
    i++;
}



let respuesta = prompt("Ingrese par, si desea saber qué números son pares o impar, de caso contrario.");
if (respuesta === null) {
    console.log("No ingresó ninguna instrucción");
}
else {
    for (i=0; i<=respuesta; i++){
        if (!(respuesta % 2) && !(i % 2)) {
            console.log(i);
        }
        if ((respuesta % 2) && (i % 2)) {
            console.log(i);
        } 
    }
}
*/