const tablaComprobantes = document.getElementById("bodyTablaComprobantes");
const comprobantesGuardados = JSON.parse(localStorage.getItem("comprobantesGuardados")) || [];

cargarTabla();

function cargarTabla(){
    comprobantesGuardados.forEach(function(item,index) {
        tablaComprobantes.innerHTML += '<tr>' +
                    '<td>' + item.numeroComprobante + '</td>' +
                    '<td>' + item.fechaComprobante + '</td>' +
                    '<td>' + item.cuit + '</td>' +
                    '<td>' + buscarNombreComprobante(item.tipoComprobante) + '</td>' +
                    '<td>' + item.moneda + '</td>' +
                    '<td>' + item.importe + '</td>' +
                    `<td indice="${index}" class="eliminar">Borrar</td>` +
                    '</tr>'
    });
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
    cargarTabla();
}