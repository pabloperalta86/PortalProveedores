const tablaComprobantes = document.getElementById("bodyTablaComprobantes");
const botonBuscar = document.getElementById("botonBuscar");
const textoBuscar = document.getElementById("textoBuscar");

const comprobantesGuardados = JSON.parse(localStorage.getItem("comprobantesGuardados")) || [];
cargarTabla(comprobantesGuardados);

function cargarTabla(datos){
    tablaComprobantes.innerHTML = "";
    datos.forEach(function(item,index) {
        tablaComprobantes.innerHTML += '<tr>' +
                    '<td>' + index + '</td>' +
                    '<td>' + item.numeroComprobante + '</td>' +
                    '<td>' + item.fechaComprobante + '</td>' +
                    '<td>' + item.cuit + '</td>' +
                    '<td>' + buscarNombreComprobante(item.tipoComprobante) + '</td>' +
                    '<td>' + item.moneda + '</td>' +
                    '<td class="derecha">' + numeral(parseFloat(item.importe)).format('$0,0.00') + '</td>' +
                    `<td class="btn eliminar"><img indice="${index}" src="../images/borrador.png" alt="borrar" witdh="20px" height="20px"></td>` +
                    '</tr>'
    })            

    const borrarItem = document.getElementsByClassName("eliminar");    
    for (item of borrarItem) {
        item.addEventListener("click", eliminarItem);
    }
}

function buscarNombreComprobante(id){
    const tipoComp = tiposComprobantesAfip.find((e) => e.codigo === id);
    return tipoComp.descripcion;
}

function eliminarItem(e) {
    tablaComprobantes.innerHTML = "";
    const indiceBorrar = e.target.getAttribute("indice");
    comprobantesGuardados.splice(indiceBorrar, 1);
    localStorage.removeItem("comprobantesGuardados");
    localStorage.setItem("comprobantesGuardados", JSON.stringify(comprobantesGuardados));
    cargarTabla(comprobantesGuardados);
}

function buscar(){
    tablaComprobantes.innerHTML = "";
    comprobantesGuardados.forEach(function(item,index){
        if (item.numeroComprobante.includes(textoBuscar.value) === true){
            tablaComprobantes.innerHTML += '<tr>' +
                    '<td>' + index + '</td>' +
                    '<td>' + item.numeroComprobante + '</td>' +
                    '<td>' + item.fechaComprobante + '</td>' +
                    '<td>' + item.cuit + '</td>' +
                    '<td>' + buscarNombreComprobante(item.tipoComprobante) + '</td>' +
                    '<td>' + item.moneda + '</td>' +
                    '<td class="derecha">' + numeral(parseFloat(item.importe)).format('$0,0.00') + '</td>' +
                    `<td class="btn eliminar"><img indice="${index}" src="../images/borrador.png" alt="borrar" witdh="20px" height="20px"></td>` +
                    '</tr>'
        }
    })            
    
    const borrarItem = document.getElementsByClassName("eliminar");    
    for (item of borrarItem) {
        item.addEventListener("click", eliminarItem);
    }
}

botonBuscar.addEventListener("click", buscar);

function limpiar(){
    cargarTabla(comprobantesGuardados);
}

botonLimpiar.addEventListener("click", limpiar);

function exportarExcel(){
    var tableSelect = tablaComprobantes;
}

botonExportar.addEventListener("click", exportarExcel);