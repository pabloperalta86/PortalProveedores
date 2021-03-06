const selectComprobantes = document.getElementById("tipoComprobante")

tiposComprobantesAfip.forEach(function(item,index) {
    selectComprobantes.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
});

const selectMonedas = document.getElementById("moneda")
monedasAfip.forEach(function(item,index) {
    selectMonedas.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
});

function cargarArchivo(p,p1){
    if (document.getElementById(p1).files[0] !== undefined) {
        document.getElementById(p).src = URL.createObjectURL(document.getElementById(p1).files[0]);
        document.getElementById("resultado").innerText = "Escaneando codigo QR...";
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
    
    let archivo = document.getElementById(p).src;
    
    let callback = function (result) {
        if (result.success) {
            console.log(result.codes);
            document.getElementById("resultado").innerText = result.codes[0].replace("https://www.afip.gob.ar/fe/qr/?p=","");
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

            console.log(datosComprobante.fecha);
            console.log(datosComprobante.cuit);
            console.log(datosComprobante.ptoVta);
            console.log(datosComprobante.tipoCmp);
            console.log(datosComprobante.nroCmp);
            console.log(datosComprobante.importe);
            console.log(datosComprobante.moneda);
            console.log(datosComprobante.ctz);
            console.log(datosComprobante.nroDocRec);
            console.log(datosComprobante.codAut);
        } else {
            console.log(result.message);
            document.getElementById("resultado").innerText = result.message;
        }
    }
    
    PDF_QR_JS.decodeSinglePage(archivo, 1, configuraciones, callback);    

}

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

function validarCUIT(p){
    let cuit = document.getElementById(p).value;
	if (cuit.length != 13) {
        document.getElementById(p).style.color = "red";
        alert("El CUIT ingresado no es valido no tiene 13 caracteres.")
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
        document.getElementById(p).style.color = "red";
        alert("El CUIT ingresado no es valido, debe revisarlo.")
        return cuitValido;
    }            
    else {
        document.getElementById(p).style.color = "black"
    }
}

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

const comprobantesGuardados = [];

function guardarComprobante(){
    // falta funcion valida que esten todos los campos completos y con datos validos
    // falta funcion para borrar todos los campos despues de guardar

    const numeroComprobante = document.getElementById("numeroComprobante").value;
    const fechaComprobante = document.getElementById("fechaComprobante").value;
    const tipoComprobante = document.getElementById("tipoComprobante").value;
    const cuit = document.getElementById("cuit").value;
    const nroAutorizacion = document.getElementById("nroAutorizacion").value;
    const moneda = document.getElementById("moneda").value;
    const cotizacion = document.getElementById("cotizacion").value;
    const importe = document.getElementById("importe").value;

    const nuevoComprobante = new Comprobante(numeroComprobante, fechaComprobante, tipoComprobante, cuit, nroAutorizacion, moneda, cotizacion, importe);
    comprobantesGuardados.push(nuevoComprobante);
}


function verComprobantesGuardados(){
    console.log("Todos los comprobantes:", comprobantesGuardados);
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
}