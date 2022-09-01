const fs = require('fs');
var XLSX = require('xlsx');
const path = require('path')
const filePath = path.resolve('gastosAgosto.txt')
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let lines = data.split(/\r?\n|\r|\n/)
  let headers = lines[0].split('~')

  let arrayOfObjects = []
  for (let j = 1; j < lines.length; j++) {
    const object = {}
    let splittedLine = lines[j].split('~')
    for (let s = 0; s < splittedLine.length; s++) {
      if(filePath.includes('gastos')){
        if(headers[s] == 'Uuid' || headers[s] == 'RfcReceptor' || headers[s] == 'NombreReceptor' || headers[s] == 'FechaCertificacionSat'){
          continue
        }
      } else if(filePath.includes('ingresos')){
        if(headers[s] == 'Uuid' || headers[s] == 'RfcEmisor' || headers[s] == 'NombreEmisor'){
          continue
        }
      }
      if(headers[s] == 'EfectoComprobante'){
        switch (splittedLine[s]) {
          case 'I':
            splittedLine[s] = 'Ingreso'
            break;
          case 'P':
            splittedLine[s] = 'Pago'
          break;
          case 'N':
            splittedLine[s] = 'Nomina'
          break;
          default:
            splittedLine[s] = 'Sepa'
            break;
        }
      }
      if(headers[s] == 'Estatus'){
        switch (splittedLine[s]) {
          case '1':
            splittedLine[s] = 'Vigente'
            break;
          case '0':
            splittedLine[s] = 'Cancelado'
          break;
          default:
            splittedLine[s] = 'Sepa'
            break;
        }
      }
      if(headers[s] == 'Monto'){
        splittedLine[s] = parseInt(splittedLine[s])
      }
        object[`${headers[s]}`] = splittedLine[s]
    }
    arrayOfObjects.push(object)  
  }
  const worksheet = XLSX.utils.json_to_sheet(arrayOfObjects);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ingresos");
  XLSX.writeFile(workbook, "gastosAgosto.xlsx");
});