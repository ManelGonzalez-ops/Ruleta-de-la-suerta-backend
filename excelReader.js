var XLSX = require('xlsx')
var workbook = XLSX.readFile('ruletadata.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//console.log(xlData);
const arrMaker = () => {
    const data = xlData
    const masterObj = {}
    data.forEach((entry, index) => {
        const keys = Array.from(Object.keys(entry))
        if (index === 0) {
            masterObj[0] = {}
            masterObj[1] = {}
            masterObj[0]["question"] = keys[0]
            masterObj[0]["question"] = entry[keys[0]]
            masterObj[1]["answer"] = keys[1]
            masterObj[1]["answer"] = entry[keys[1]]
            return
        }
        let correctIndex = index + 1
        masterObj[correctIndex] = { question: null, answer: null }


        masterObj[correctIndex]["answer"] = entry[keys[0]]
        masterObj[correctIndex]["question"] = entry[keys[1]]
    })

    return masterObj
}
// console.log(arrMaker())
module.exports = arrMaker