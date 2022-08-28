if (sessionStorage.getItem("usuarioActivo") != "true") window.location.href = "./pages/iniciarSesion.html"

const nuevoLogin = {usuario:"pperalta",contrasenia:"123"}
const storageLoginPortal = [];
storageLoginPortal.push(nuevoLogin);
localStorage.setItem("loginPortal", JSON.stringify(storageLoginPortal))

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


fetch("../data/tipoComprobantes.json").then(response => response.json()).then(jsondata => {
    jsondata.forEach(function(item,index) {
        inputTipoComprobante.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
        inputTipoComprobante.value = "";
    });
});

fetch("../data/monedas.json").then(response => response.json()).then(jsondata => {
    jsondata.forEach(function(item,index) {
        inputMoneda.innerHTML += '<option value="' + item.codigo + '">' + item.descripcion + '</option>';
        inputMoneda.value = "";
    });
});

const comprobantesGuardados = JSON.parse(localStorage.getItem("comprobantesGuardados")) || [];

formulario.onsubmit = (event) =>{
    event.preventDefault();
    
    let mensajeError = "";
    
    mensajeError += inputNumeroComprobante.classList[1] === "is-valid" ? "" : "Numero Comprobante\n";
    mensajeError += inputFechaComprobante.classList[1] === "is-valid" ? "" : "Fecha Comprobante\n";
    mensajeError += inputTipoComprobante.classList[1] === "is-valid" ? "" : "Tipo Comprobante\n";
    mensajeError += inputCuit.classList[1] === "is-valid" ? "" : "CUIT\n";
    mensajeError += inputNroAutorizacion.classList[1] === "is-valid" ? "" : "Numero Autorización\n";
    mensajeError += inputMoneda.classList[1] === "is-valid" ? "" : "Moneda\n";
    mensajeError += inputCotizacion.classList[1] === "is-valid" ? "" : "Cotización\n";
    mensajeError += inputImporte.classList[1] === "is-valid" ? "" : "Importe\n";

    if(mensajeError === ""){
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
        Toastify({
            text: "El comprobante se guardo correctamente",
            duration: 2500,
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #0071ff, #03525f)",
            }
        }).showToast();
        limpiarFormulario();
    }else{
        mensajeError = "Faltan completar correctamente los siguientes campos: \n" + mensajeError;
        Toastify({
            text: mensajeError,
            duration: 2500,
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: { 
                background: "linear-gradient(to right, #e90437, #fb0505)",
            }
        }).showToast();
    }
}

inputCuit.onchange = () => {
    validarCUIT(inputCuit.value)
}

inputFechaComprobante.onchange = () => { validarCampos(inputFechaComprobante) }
inputTipoComprobante.onchange = () => { validarCampos(inputTipoComprobante) }
inputMoneda.onchange = () => { validarCampos(inputMoneda) }
inputCotizacion.onchange = () => { validarCampos(inputCotizacion) }
inputImporte.onchange = () => { validarCampos(inputImporte) }
inputNroAutorizacion.onchange = () => { validarCampos(inputNroAutorizacion) }

inputNumeroComprobante.onchange = () => {
    let nroComprobante = inputNumeroComprobante.value;
    if (nroComprobante.includes("-")) {
        let nroSeparado = nroComprobante.split("-");
        let puntoventa = "00000" + nroSeparado[0];
        let numero = "00000000" + nroSeparado[1];
        inputNumeroComprobante.value = puntoventa.substring(puntoventa.length - 5, puntoventa.length) + numero.substring(numero.length - 8, numero.length)
        inputNumeroComprobante.classList.replace("is-invalid","is-valid");
    } else if (nroComprobante.length !== 13) {
        inputNumeroComprobante.classList.replace("is-valid","is-invalid");
    } else {
        inputNumeroComprobante.classList.replace("is-invalid","is-valid");
    }
}

inputArchivo.onchange = () => {
    limpiarFormulario();
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
            if (result.codes[0] === undefined) return false;
            document.getElementById("resultado").value = result.codes[0].replace("https://www.afip.gob.ar/fe/qr/?p=","");
            let decodificadoB64 = atob(document.getElementById("resultado").value);
            document.getElementById("resultadoDecodificado").value = decodificadoB64;
            let datosComprobante = JSON.parse(decodificadoB64);

            inputNumeroComprobante.value = datosComprobante.ptoVta + "-" + datosComprobante.nroCmp;
            validarNroComprobante(inputNumeroComprobante);
            inputFechaComprobante.value = datosComprobante.fecha;
            let tipoDeComprobante = "000" + datosComprobante.tipoCmp;
            tipoDeComprobante = tipoDeComprobante.substring(tipoDeComprobante.length-3,tipoDeComprobante.length);
            inputTipoComprobante.value = tipoDeComprobante;
            inputCuit.value = datosComprobante.cuit;
            validarCUIT(inputCuit.value);
            inputNroAutorizacion.value = datosComprobante.codAut;
            inputMoneda.value = datosComprobante.moneda.toUpperCase();
            inputCotizacion.value = datosComprobante.ctz;
            inputImporte.value = datosComprobante.importe;
            validarCampos(inputFechaComprobante);
            validarCampos(inputTipoComprobante);
            validarCampos(inputMoneda);
            validarCampos(inputCotizacion);
            validarCampos(inputImporte);
            validarCampos(inputNroAutorizacion);
            
        } else {
            document.getElementById("resultado").value = result.message;
        }
    }
    
    PDF_QR_JS.decodeSinglePage(archivo, 1, configuraciones, callback);    
    
};

function validarNroComprobante(p){
    let nroComprobante = p.value;
    if (nroComprobante.includes("-")) {
        let nroSeparado = nroComprobante.split("-");
        let puntoventa = "00000" + nroSeparado[0];
        let numero = "00000000" + nroSeparado[1];
        p.value = puntoventa.substring(puntoventa.length - 5, puntoventa.length) + numero.substring(numero.length - 8, numero.length)
        inputNumeroComprobante.classList.replace("is-invalid","is-valid");
    } else if (nroComprobante.length === 0) {
        inputNumeroComprobante.classList.replace("is-valid","is-invalid");
    } else if (nroComprobante.length !== 13) {
        alert("El numero ingresado debe tener 13 caracteres.");    
        inputNumeroComprobante.classList.replace("is-valid","is-invalid");
    } else {
        inputNumeroComprobante.classList.replace("is-invalid","is-valid");
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

function validarCUIT(cuit) {
	if (cuit.length != 13 && cuit.length != 11) {
        inputCuit.classList.replace("is-valid","is-invalid");
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
        inputCuit.classList.replace("is-valid","is-invalid");
        return cuitValido;
    } else {
        if (cuit.length === 11){
            cuit = cuit.substring(0,2) + "-" + cuit.substring(2, 10) + "-" + cuit.substring(10,11)
            inputCuit.value = cuit
        }
        inputCuit.classList.replace("is-invalid","is-valid");
    }
}

function validarCampos(campo){
    if (campo.value !== "") {
        campo.classList.replace("is-invalid","is-valid");
    }else{
        campo.classList.replace("is-valid","is-invalid");
    }
}

function limpiarFormulario(){
    inputNumeroComprobante.value = "";
    inputCuit.value.value = "";
    inputFechaComprobante.value = "";
    inputTipoComprobante.value = "";
    inputMoneda.value = "";
    inputCotizacion.value = "";
    inputImporte.value = "";
    inputNroAutorizacion.value = "";
    inputCuit.value = "";

    validarNroComprobante(inputNumeroComprobante);
    validarCUIT(inputCuit.value);
    validarCampos(inputFechaComprobante);
    validarCampos(inputTipoComprobante);
    validarCampos(inputMoneda);
    validarCampos(inputCotizacion);
    validarCampos(inputImporte);
    validarCampos(inputNroAutorizacion);
}