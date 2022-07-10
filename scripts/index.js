function cargarArchivo(p,p1){
    document.getElementById(p).src = URL.createObjectURL(document.getElementById(p1).files[0]);
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