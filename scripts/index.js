const nuevoLogin = {usuario:"pperalta",contrasenia:"123"}
const storageLoginPortal = [];
storageLoginPortal.push(nuevoLogin);
localStorage.setItem("loginPortal", JSON.stringify(storageLoginPortal))

if (sessionStorage.getItem("usuarioActivo") != "true") window.location.href = "./pages/iniciarSesion.html"

const inputArchivo = document.getElementById("archivo");
const formulario = document.getElementById("formulario");
const inputNumeroComprobante = document.getElementById("numeroComprobante");
const inputFechaComprobante = document.getElementById("fechaComprobante");
const inputCuit = document.getElementById("cuit");
const inputGuardar = document.getElementById("guardar");
const inputVerGuardados = document.getElementById("verGuardados");
const inputTipoComprobante = document.getElementById("tipoComprobante");
const inputMoneda = document.getElementById("moneda");
const visorPdf = document.getElementById("visorPdf");
const inputNroAutorizacion = document.getElementById("nroAutorizacion");
const inputCotizacion = document.getElementById("cotizacion");
const inputImporte = document.getElementById("importe");

tiposComprobantesAfip.forEach(function(item,index) {
    inputTipoComprobante.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
});

monedasAfip.forEach(function(item,index) {
    inputMoneda.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
});

const comprobantesGuardados = JSON.parse(localStorage.getItem("comprobantesGuardados")) || [];

formulario.onsubmit = (event) =>{
    event.preventDefault();
    // falta funcion valida que esten todos los campos completos y con datos validos

    const numeroComprobante = inputNumeroComprobante.value;
    const fechaComprobante = inputFechaComprobante.value;
    const tipoComprobante = inputTipoComprobante.value;
    const cuit = inputCuit.value;
    const nroAutorizacion = inputNroAutorizacion.value;
    const moneda = inputMoneda.value;
    const cotizacion = inputCotizacion.value;
    const importe = inputImporte.value;
    const nuevoComprobante = new Comprobante(numeroComprobante, fechaComprobante, tipoComprobante, cuit, nroAutorizacion, moneda, cotizacion, importe);
    comprobantesGuardados.push(nuevoComprobante);
    localStorage.setItem("comprobantesGuardados", JSON.stringify(comprobantesGuardados))
    formulario.reset();
}

inputVerGuardados.onclick = () => {    
/*    console.log("Todos los comprobantes:", comprobantesGuardados);
    const comprobantesGuardadosDolares = comprobantesGuardados.filter(actual => actual.moneda === "DOL");
    console.log("Comprobantes en Dolares:", comprobantesGuardadosDolares);
    const comprobantesGuardadosPesos = comprobantesGuardados.filter(actual => actual.moneda === "PES");
    console.log("Comprobantes en Pesos:", comprobantesGuardadosPesos);
    console.log("Total de Comprobantes guardados:", comprobantesGuardados.length);
    comprobantesGuardados.forEach((actual, i) => {
        if (actual.importe > 10000) {
            console.log(`El comprobante: ${actual.numeroComprobante} es mayor a 10,000.00`)
        }
    })
*/
    window.location.href = "./pages/visualizarComprobantes.html"
}

inputCuit.onchange = () => {
    let cuit = inputCuit.value;
	if (cuit.length != 13) {
        inputCuit.style.color = "red";
        alert("El CUIT ingresado no es valido no tiene 13 caracteres.");
        return 0;
    }
		
	let cuitValido = false;
	let resultado = 0;
	let cuit_nro = cuit.replace("-", "");
	let codigo = "6789456789";
	let verificador = parseInt(cuit_nro[cuit_nro.length-1]);

	for (let x= 0; x < 10; x++) {
		let digitoValidador = parseInt(codigo.substring(x, x+1));
		if (isNaN(digitoValidador)) digitoValidador = 0;
		let digito = parseInt(cuit_nro.substring(x, x+1));
		if (isNaN(digito)) digito = 0;
		let digitoValidacion = digitoValidador * digito;
		resultado += digitoValidacion;
	}
	
    resultado = resultado % 11;
	cuitValido = (resultado == verificador);
	
    if (cuitValido == false) {
        inputCuit.style.color = "red";
        alert("El CUIT ingresado no es valido, debe revisarlo.");
        return cuitValido;
    }            
    else {
        inputCuit.style.color = "black";
    }
}

inputNumeroComprobante.onchange = () => {
    let nroComprobante = inputNumeroComprobante.value;
    if (nroComprobante.includes("-")) {
        let nroSeparado = nroComprobante.split("-");
        let puntoventa = "00000" + nroSeparado[0];
        let numero = "00000000" + nroSeparado[1];
        inputNumeroComprobante.value = puntoventa.substring(puntoventa.length - 5, puntoventa.length) + numero.substring(numero.length - 8, numero.length)
        inputNumeroComprobante.style.color = "black";
    } else if (nroComprobante.length !== 13) {
        inputNumeroComprobante.style.color = "red";
        alert("El numero ingresado debe tener 13 caracteres.");    
    } else {
        inputNumeroComprobante.style.color = "black";
    }
}


inputArchivo.onchange = () => {
    if (inputArchivo.files[0] !== undefined) {
        visorPdf.src = URL.createObjectURL(inputArchivo.files[0]);
        document.getElementById("resultado").value = "Escaneando codigo QR...";
    } else {
        return;
    }

    let configuraciones = {
        scale: {
            once: true,
            value: 5
        },
        resultOpts: {
            singleCodeInPage: true
        },
        improve: true,
        jsQR: {}
    };
    
    let archivo = visorPdf.src;
    

    let callback = function (result) {
        if (result.success) {
            console.log(result.codes);
            document.getElementById("resultado").value = result.codes[0].replace("https://www.afip.gob.ar/fe/qr/?p=","");
            let decodificadoB64 = atob(document.getElementById("resultado").value);
            console.log(typeof decodificadoB64);
            document.getElementById("resultadoDecodificado").value = decodificadoB64;
            console.log(decodificadoB64);
            let datosComprobante = JSON.parse(decodificadoB64);

            document.getElementById("numeroComprobante").value = datosComprobante.ptoVta + "-" + datosComprobante.nroCmp;
            validarNroComprobante("numeroComprobante");
            document.getElementById("fechaComprobante").value = datosComprobante.fecha;
            
            let tipoDeComprobante = "000" + datosComprobante.tipoCmp;
            tipoDeComprobante = tipoDeComprobante.substring(tipoDeComprobante.length-3,tipoDeComprobante.length);
            document.getElementById("tipoComprobante").value = tipoDeComprobante;

            document.getElementById("cuit").value = datosComprobante.cuit;
            document.getElementById("nroAutorizacion").value = datosComprobante.codAut;
            document.getElementById("moneda").value = datosComprobante.moneda.toUpperCase();
            document.getElementById("cotizacion").value = datosComprobante.ctz;
            document.getElementById("importe").value = datosComprobante.importe;

        } else {
            console.log(result.message);
            document.getElementById("resultado").value = result.message;
        }
    }
    
    PDF_QR_JS.decodeSinglePage(archivo, 1, configuraciones, callback);    
    
};


// api para leer qr desde una imagen
// function cargarArchivo2(p,p1){
//     document.getElementById(p).src = URL.createObjectURL(document.getElementById(p1).files[0]);
//     let archivo = document.getElementById(p1).files[0]
//     let formData = new FormData();
//     formData.append('file', archivo);
//     document.getElementById("resultado").innerText = "Scanning QR Code...";
//     fetch("http://api.qrserver.com/v1/read-qr-code/", {
//         method: 'POST', body: formData
//     }).then(res => res.json()).then(result => {
//         result = result[0].symbol[0].data;
//         document.getElementById("resultado").innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";
//         if(!result) return;
//         document.querySelector("textarea").innerText = result;
//     }).catch(() => {
//         infoText.innerText = "Couldn't scan QR Code";
//     });
// }

function validarNroComprobante(p){
    let nroComprobante = document.getElementById(p).value;
    if (nroComprobante.includes("-")) {
        let nroSeparado = nroComprobante.split("-");
        let puntoventa = "00000" + nroSeparado[0];
        let numero = "00000000" + nroSeparado[1];
        document.getElementById(p).value = puntoventa.substring(puntoventa.length - 5, puntoventa.length) + numero.substring(numero.length - 8, numero.length)
        document.getElementById(p).style.color = "black";
    } else if (nroComprobante.length !== 13) {
        document.getElementById(p).style.color = "red";
        alert("El numero ingresado debe tener 13 caracteres.");    
    } else {
        document.getElementById(p).style.color = "black";
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


class Comprobante {
    constructor(numeroComprobante, fechaComprobante, tipoComprobante, cuit, nroAutorizacion, moneda, cotizacion, importe) {
    this.numeroComprobante = numeroComprobante;
    this.fechaComprobante  = fechaComprobante; 
    this.tipoComprobante   = tipoComprobante;
    this.cuit              = cuit; 
    this.nroAutorizacion   = nroAutorizacion; 
    this.moneda            = moneda;
    this.cotizacion        = cotizacion;
    this.importe           = importe;
    }
}
