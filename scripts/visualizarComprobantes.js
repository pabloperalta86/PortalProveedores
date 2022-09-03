if (sessionStorage.getItem("usuarioActivo") != "true") 
    window.location.href = "../pages/iniciarSesion.html"
else
    document.querySelector(".body").style.display = "grid";

const tablaComprobantes = document.getElementById("bodyTablaComprobantes");
const botonBuscar = document.getElementById("botonBuscar");
const textoBuscar = document.getElementById("textoBuscar");
const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.onclick = () => {
    sessionStorage.removeItem("usuarioActivo");
}

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
                    `<td class="btn eliminar"><img title="Borrar" indice="${index}" src="../images/trash.svg" alt="borrar" witdh="20px" height="20px"></td>` +
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
    buscar();
}

function buscar(){
    tablaComprobantes.innerHTML = "";
    comprobantesGuardados.forEach(function(item,index){
        if (item.numeroComprobante.includes(textoBuscar.value) === true ||
            item.fechaComprobante.includes(textoBuscar.value) === true ||
            buscarNombreComprobante(item.tipoComprobante).includes(textoBuscar.value) === true ||
            item.moneda.includes(textoBuscar.value) === true ||
            item.cuit.includes(textoBuscar.value) === true ||
            item.importe.includes(textoBuscar.value) === true ){
            tablaComprobantes.innerHTML += '<tr>' +
                    '<td>' + index + '</td>' +
                    '<td>' + item.numeroComprobante + '</td>' +
                    '<td>' + item.fechaComprobante + '</td>' +
                    '<td>' + item.cuit + '</td>' +
                    '<td>' + buscarNombreComprobante(item.tipoComprobante) + '</td>' +
                    '<td>' + item.moneda + '</td>' +
                    '<td class="derecha">' + numeral(parseFloat(item.importe)).format('$0,0.00') + '</td>' +
                    `<td class="btn eliminar"><img title="Borrar" indice="${index}" src="../images/trash.svg" alt="borrar" witdh="20px" height="20px"></td>` +
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
    const sheet = XLSX.utils.table_to_sheet (tablaComprobantes);
    openDownloadDialog(sheet2blob (sheet), 'Comprobantes.xlsx');
}

botonExportar.addEventListener("click", exportarExcel);

textoBuscar.addEventListener("keypress", buscarEnter);

function buscarEnter(e){
    if(e.keyCode === 13) buscar();
}

function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
         workbook.Sheets [sheetName] = sheet; // Generar elementos de configuración de Excel

    var wopts = {
                 bookType: 'xlsx', // El tipo de archivo que se generará
                 bookSST: false, // Ya sea para generar una tabla de cadenas compartidas, la explicación oficial es que si activa la velocidad de generación, disminuirá, pero tiene una mejor compatibilidad en dispositivos IOS inferiores
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
         }); // Cadena a ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url);
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}