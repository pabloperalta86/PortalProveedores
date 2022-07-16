function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

function cargarArchivo(p,p1){
    document.getElementById(p).src = URL.createObjectURL(document.getElementById(p1).files[0]);
    document.getElementById("resultado").innerText = "Scanning QR Code...";

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
    
let archivo = document.getElementById(p).src

let callback = function (result) {
    if (result.success) {
        console.log(result.codes)
        document.getElementById("resultado").innerText = result.codes[0].replace("https://www.afip.gob.ar/fe/qr/?p=","");
        let decodificadoB64 = atob(document.getElementById("resultado").value);
        console.log(typeof decodificadoB64)
        document.getElementById("resultadoDecodificado").innerText = decodificadoB64;
        console.log(decodificadoB64);
        let datosComprobante = JSON.parse(decodificadoB64);
        console.log(datosComprobante.cuit);
        console.log(datosComprobante.nroCmp);
        console.log(datosComprobante.ptoVta);
        console.log(datosComprobante.importe);
    } else {
        console.log(result.message);
        document.getElementById("resultado").innerText = result.message;
    }
}

PDF_QR_JS.decodeSinglePage(archivo, 1, configuraciones, callback);    

}

function cargarArchivo2(p,p1){
    document.getElementById(p).src = URL.createObjectURL(document.getElementById(p1).files[0]);
    let archivo = document.getElementById(p1).files[0]
    let formData = new FormData();
    formData.append('file', archivo);

    document.getElementById("resultado").innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        document.getElementById("resultado").innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";
        if(!result) return;
        document.querySelector("textarea").innerText = result;
    }).catch(() => {
        infoText.innerText = "Couldn't scan QR Code";
    });

}

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

/*
new Cliente (nombre, apellido, edad, domicilio, codigoPostal, ciudad, pais, estadoCivil)

class Clientes {
    constructor(nombre, apellido, edad, domicilio, codigoPostal, ciudad, pais, estadoCivil) {
    this.nombre = nombre;
    this.apellido = apellido; 
    this.edad = edad;
    this.domicilio = domicilio; 
    this.codigoPostal = codigoPostal; 
    this.ciudad = ciudad;
    this.pais = pais;
    this.estadoCivil = estadoCivil;
    }
}

const cliente1 = new Clientes;

*/



function decodePdf() {

/*    const resultHolder = document.getElementById('holder');
    const decoder = document.getElementById('decode_btn');
    var summarydiv = document.getElementById('summarydiv');
    var summaryBody = document.getElementById('summary').getElementsByTagName('tbody')[0];
    resultHolder.innerHTML = '';
    summaryBody.innerHTML = '';
    summarydiv.style.display = 'none';
    decoder.disabled = true;
*/
    // this function is used to catch the result returned from PDFQrJS
    function recordcallback(result) {
        console.log("PDF-QR.js result : ");
        console.log(result);
        if (result.success) {

            if (result.codesByPage !== undefined) // full document scanned
            {
                for (var page in result.codesByPage) {
                    var div = document.getElementById('result_page' + page);
                    if (result.codesByPage[page].length > 0)
                        div.innerText = "QR Codes found : " + result.codesByPage[page].join(', ');
                    else
                        div.innerText = "No QR Codes found!";
                }
            } else { // single page scanned
                var div = document.getElementById('result_page' + result.decodedPage);
                if (result.codes.length > 0)
                    div.innerText = "QR Codes found : " + result.codes.join(', ');
                else
                    div.innerText = "No QR Codes found!";
            }

            var keyDescript = {totalOnPatch: "patch", totalOnScale: "scale"};
            for (var key in result.stats) {
                for (var k in result.stats[key]) {
                    var str = result.stats[key][k] + " QR Codes found on " + k + " " + keyDescript[key];
                    addrow(str);
                }
            }
            summarydiv.style.display = 'block';
        } else {
            console.log(result.message);
            holder.innerText = result.message;
        }

        decoder.disabled = false;
    }

    // function which prints pages on the demo (it is an optional parameter)
    function printTestImg(pageAsImg, pageNr) {

        var div = document.createElement('div');
        div.innerText = "Page_" + pageNr;
        div.classList = 'resultContainer';
        resultHolder.appendChild(div);

        pageAsImg.classList = 'resultPage';
        resultHolder.appendChild(pageAsImg);

        var resultsDiv = document.createElement('div');
        resultsDiv.id = "result_page" + pageNr;
        resultsDiv.classList = 'resultDiv';
        resultsDiv.innerHTML = "<img src='./media/loading.gif' height='70px' width='70px;'>";
        resultHolder.appendChild(resultsDiv);
    }

    // decode pdf call (all code you need to call in order to scan qr codes in you pdfs
    var input_file = document.getElementById('pdfentryfile');
    if (input_file.value === "") {
        alert('Please provide a valid pdf file!');
        decoder.disabled = false;
        return false;
    }

    if (decodeType === "allpages") {
        PDF_QR_JS.decodeDocument(input_file, configs,
            recordcallback, printTestImg
        );
    } else {
        var pageNrInput = document.getElementById('pageNr');
        if (pageNrInput.value === '' || parseInt(pageNrInput.value) <= 0) {
            alert('Please provide a valid page number!');
            decoder.disabled = false;
            return false;
        }
        PDF_QR_JS.decodeSinglePage(input_file, parseInt(pageNrInput.value), configs,
            recordcallback, printTestImg
        );
    }
}