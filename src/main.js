//const { Observable, fromEvent } = rxjs;
//import { Observable, fromEvent} from 'rxjs';
/*import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map'*/
const { Rx, Observable, fromEvent, Subject, of, combineLatest } = rxjs;

let table = document.getElementById('table');
let formulaCell = null;
document.getElementById('deleteColumn').classList.add('fa-disabled');
document.getElementById('addColumn').classList.add('fa-disabled');
document.getElementById('addRow').classList.add('fa-disabled');
document.getElementById('deleteRow').classList.add('fa-disabled');

const checkSum = new RegExp(/^=[A-Z]{3}/g);
const checkOperation = new RegExp(/^=[A-z]\d[*+-\/]+/g);
const getOperation= new RegExp(/[*+-\/]/g);
const cellsRegex = new RegExp(/[A-Z]([0-9]{1,2}|100)/g);

window.onload = function (){
    createTable(3,30);
};

/*
* This method is giving column and row names*/
const rowColumnName = () => {
    let rows = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for(let r = 1; r < rows.length; r++){
        if(rows[r].getElementsByTagName('span')[0]){
            rows[r].getElementsByTagName('td')[0].removeChild(rows[r].getElementsByTagName('span')[0]);
        }
        let span = document.createElement('span');
        span.setAttribute('onclick', 'checkRowColToGetSelected(event)');
        span.appendChild(document.createTextNode(r.toString()));
        rows[r].getElementsByTagName('td')[0].insertBefore(span,rows[r].getElementsByTagName('td')[0].getElementsByTagName('i')[0]);
    }

    let cols = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].getElementsByTagName('td');
    for(let c = 1; c < cols.length; c++){
        if(cols[c].getElementsByTagName('span')[0]){
            cols[c].removeChild(cols[c].getElementsByTagName('span')[0]);
        }
        let span = document.createElement('span');
        span.setAttribute('onclick', 'checkRowColToGetSelected(event)');
        let char = createCharactersForCols(c);
        span.appendChild(document.createTextNode(char));
        cols[c].insertBefore(span,cols[c].getElementsByTagName('i')[0]);
    }
};


/*This method is used to create column names as A-Z and then AA, AB combinations*/
const createCharactersForCols = (c) => {
    if (c > 26){
        let firstChar = String.fromCharCode(64 + c/26);
        let secondChar = String.fromCharCode(64 + c%26);
        return firstChar + secondChar;
    } else {
        return String.fromCharCode(64 + c);
    }
};

/*This method creates the empty cell*/
const createCell = () => {
    let newCell = document.createElement('td');
    let input = document.createElement('input');
    newCell.appendChild(input);
    return newCell;
};

/*Creating HTML table*/
const createTable = (rows, cols) => {
    let tBody = document.createElement('tbody');
    tBody.appendChild(addDeleteRow(cols));
    for(let r = 0; r < rows; r++){
        tBody.appendChild(createTableRow(cols));
    }
    table.appendChild(tBody);
    rowColumnName();
    return tBody;
};

/*Creating HTML Row*/
const createTableRow = (cols) => {
    let tRow = document.createElement('tr');
    tRow.appendChild(createColHeaderCells());
    for(let c = 0; c < cols; c ++) {
        tRow.appendChild(createCell());
    }
    return tRow;
};

/*To add and delete the row from the HTML table*/
const addDeleteRow = (cols) => {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.setAttribute('class', 'labelColCell');
    tr.appendChild(td);
    for(let c = 0; c < cols; c ++) {
        tr.appendChild(createRowHeaderCells());
    }
    return tr;
};

/*This method is creating the row headers*/
const createRowHeaderCells = () => {
    let td = document.createElement('td');
    td.setAttribute('class', 'labelColCell');
    return td;
};

/*This method is creating the column headers*/
const createColHeaderCells = () => {
    let td = document.createElement('td');
    td.setAttribute('class', 'labelRowCell');
    return td;
};

/*This method removes the selection of row or column*/
const removeSelection = (event) => {
    let trList = event.target.parentElement.parentElement.parentElement.children;
    for (let trListElement of trList) {
        trListElement.classList.remove('selectedRowCol');
    }
    let tbody = document.getElementsByTagName('tbody')[0];
    let tds = tbody.querySelectorAll('td');
    tds.forEach(td => {
        if(td.classList.contains('selectedRowCol')){
            td.classList.remove('selectedRowCol');
            td.classList.add('labelColCell');
        }
    });
};

const checkRowColToGetSelected = (event) => {
    removeSelection(event);
    if(event.target.parentElement.cellIndex){
        selectedCol(event);
    } else {
        selectedRow(event);
    }
};


/*
* Below 2 methods are used for selecting row and columns*/
const selectedRow = (event) => {
    document.getElementById('addRow').classList.remove('fa-disabled');
    document.getElementById('deleteRow').classList.remove('fa-disabled');
    let childList = event.target.parentElement.parentElement.children;
    childList[0].setAttribute('class', 'selectedRowCol');
    this.addDeleteEvent = event;
    document.getElementById('deleteColumn').classList.add('fa-disabled');
    document.getElementById('addColumn').classList.add('fa-disabled');
};

const selectedCol = (event) => {
    document.getElementById('addColumn').classList.remove('fa-disabled');
    document.getElementById('deleteColumn').classList.remove('fa-disabled');
    let trList = event.target.parentElement.parentElement.parentElement.rows;
    let cellIndex = event.target.parentElement.cellIndex;
    for(let c = 0; c < trList.length ; c ++) {
        trList[c].children[cellIndex].setAttribute('class', 'selectedRowCol');
    }
    this.addDeleteEvent = event;
    document.getElementById('addRow').classList.add('fa-disabled');
    document.getElementById('deleteRow').classList.add('fa-disabled');
};

/*
* Below methods are created for adding and deleting the rows and cloumns*/
const addColumns = () => {
    let tr =  document.createElement('tr');
    let trList = this.addDeleteEvent.target.parentElement.parentElement.parentElement.rows;
    let cellIndex = this.addDeleteEvent.target.parentElement.cellIndex;
    trList[0].children[cellIndex].after(createRowHeaderCells());
    for(let c = 1; c < trList.length ; c ++) {
        //let td = document.createElement('td');
        trList[c].children[cellIndex].after(createCell());
    }
    removeSelection(this.addDeleteEvent);
    rowColumnName();
    document.getElementById('deleteColumn').classList.add('fa-disabled');
    document.getElementById('addColumn').classList.add('fa-disabled');
};

const addRows = () =>{
    let tr =  document.createElement('tr');
    let cols = this.addDeleteEvent.target.parentElement.parentElement.children.length;
    tr.appendChild(createColHeaderCells());
    for(let c = 0; c < cols - 1; c ++) {
        tr.appendChild(createCell());
    }
    this.addDeleteEvent.target.parentElement.parentElement.after(tr);
    removeSelection(this.addDeleteEvent);
    rowColumnName();
    document.getElementById('addRow').classList.add('fa-disabled');
    document.getElementById('deleteRow').classList.add('fa-disabled');
};

const deleteRow = () => {
    let elem = document.getElementById('table').getElementsByTagName('tbody')[0];
    if(this.addDeleteEvent.target.parentElement.parentElement.parentElement.children.length < 3){
        alert("One row must be there ");
        return;
    }
    elem.removeChild(this.addDeleteEvent.target.parentElement.parentElement);
    rowColumnName();
    document.getElementById('addRow').classList.add('fa-disabled');
    document.getElementById('deleteRow').classList.add('fa-disabled');
};

const deleteCol = () => {
    let cellIndex = this.addDeleteEvent.target.parentElement.cellIndex;
    let trList = document.getElementById('table').getElementsByTagName('tr');
    for(let i = 0; i < trList.length; i ++) {
        if(trList[i].children.length < 3){
            alert("One column must be there ");
            return;
        }
        let child = trList[i].children[cellIndex];
        trList[i].removeChild(child);
    }
    rowColumnName();
    document.getElementById('deleteColumn').classList.add('fa-disabled');
    document.getElementById('addColumn').classList.add('fa-disabled');
};



/*----------------------------------------------------------Calculations--------------------------------------------------------------------*/
/*one method to do calculates based on  formulas*/
const calculateResult = (operation ,cells) => {
    let res = 0;
    switch (operation) {
        case '+' : {
            cells.map(i => {
                let col = i.toString().charCodeAt(0) - 64;
                let row = i[1];
                if(Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value.length === 0)){
                    return NaN;
                }
                res += Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
            });
            break;
        }
        case '*' : {
            res = 1;
            cells.map(i => {
                let col = i.toString().charCodeAt(0) - 64;
                let row = i[1];
                if(Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value.length === 0)){
                    return NaN;
                }
                res *= Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
            });
            break;
        }
        case '-' : {
            let iterate = 0;
            cells.map(i => {
                let col = i.toString().charCodeAt(0) - 64;
                let row = i[1];
                if(Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value.length === 0)){
                    return NaN;
                }
                if (iterate === 0){
                    res = Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
                    iterate++;
                } else {
                    res -= Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
                }
            });
            break;
        }
        case '/' : {
            let iterate = 0;
            cells.map(i => {
                let col = i.toString().charCodeAt(0) - 64;
                let row = i[1];
                if(Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value.length === 0)){
                    return NaN;
                }
                if (iterate === 0){
                    res = Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
                    iterate++;
                } else {
                    res /= Number(table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0].value);
                }
            });
            break;
        }
    }
    console.log(res);
    return isNaN(res) ? "Reference Error" : res;
};


/*Calculation for SUM in range of rows and columns*/
const calculateSum = (cells) => {
    let sum = 0;
    let col1 = cells[0].toString().charCodeAt(0) - 64;
    let row1 = cells[0][1];
    let col2 = cells[1].toString().charCodeAt(0) - 64;
    let row2 = cells[1][1];
    if (col1 === col2) {
        let min = Math.min(row1, row2);
        let max = Math.max(row1, row2);
        for(let count = min; count <= max; count++){
            sum += Number(table.getElementsByTagName('tr')[count].getElementsByTagName('td')[col1].getElementsByTagName('input')[0].value) ?
                Number(table.getElementsByTagName('tr')[count].getElementsByTagName('td')[col1].getElementsByTagName('input')[0].value): 0;

        }
    } else if(row2 === row1) {
        let min = Math.min(col1, col2);
        let max = Math.max(col1, col2);
        for (let count = min; count <= max; count++) {
            sum += Number(table.getElementsByTagName('tr')[row1].getElementsByTagName('td')[count].getElementsByTagName('input')[0].value) ?
                Number(table.getElementsByTagName('tr')[row1].getElementsByTagName('td')[count].getElementsByTagName('input')[0].value) : 0;

        }
    }
    return sum;
};

/*Added event listener for change of value in cells*/
fromEvent(table, 'change').subscribe({
    next(eve) {
        formulaCell = eve.target;
        formulaCell.formula = eve.target.value;
        if(eve.target.value.match(checkOperation)){
            let operation = eve.target.value.match(getOperation)[0];
            let cells = eve.target.value.match(cellsRegex);
            attachFormulaCellEvent(cells, formulaCell);
            eve.target.value = calculateResult(operation ,cells);
        } else if (eve.target.value.match(checkSum)) {
            let cells = eve.target.value.match(cellsRegex);
            eve.target.value = calculateSum(cells);
            let allCells = [];
            let col1 = cells[0][0];
            let row1 = cells[0][1];
            let col2 = cells[1][0];
            let row2 = cells[1][1];
            if (col1 === col2) {
                let min = Math.min(row1, row2);
                let max = Math.max(row1, row2);
                for(let count = min; count <= max; count++){
                    allCells.push(col1+count);
                }
            } else if(row2 === row1) {
                let min = Math.min((col1.toString().charCodeAt(0) - 64), (col2.toString().charCodeAt(0) - 64));
                let max = Math.max((col1.toString().charCodeAt(0) - 64), (col2.toString().charCodeAt(0) - 64));
                for (let count = min; count <= max; count++) {
                    allCells.push((String.fromCharCode(64 + count))+row1);
                }
            }
            attachFormulaCellEvent(allCells, formulaCell);
        }
    },
    error(err) {
        alert("Same reference cell cannot be used!!"+err);
    }
});

/*fromEvent(table, 'change').subscribe({
    next(eve) {
        formulaCell = eve.target;
        formulaCell.formula = eve.target.value;
        if(eve.target.value.match(checkOperation)){
            let operation = eve.target.value.match(getOperation)[0];
            let cells = eve.target.value.match(cellsRegex);
            let col1 = cells[0].toString().charCodeAt(0) - 64;
            let row1 = cells[0][1];
            let col2 = cells[1].toString().charCodeAt(0) - 64;
            let row2 = cells[1][1];
            const col1Val = fromEvent(table.getElementsByTagName('tr')[row1].getElementsByTagName('td')[col1]
                .getElementsByTagName('input')[0].value,'change');
            const col2Val = fromEvent(table.getElementsByTagName('tr')[row2].getElementsByTagName('td')[col2]
                .getElementsByTagName('input')[0].value,'change');
            const cellVal = combineLatest(col1Val, col2Val)((a,b) => a+b);
            cellVal.subscribe(v => eve.target.value = v);
            //eve.target.value = calculateResult(operation ,cells);
        } else if (eve.target.value.match(checkSum)) {
            let cells = eve.target.value.match(cellsRegex);
            attachFormulaCellEvent(cells, formulaCell);
            eve.target.value = calculateSum(cells);
        }
    },
    error(err) {
        alert("Same reference cell cannot be used!!"+err);
    }
});*/

getChangeValue = function(){
    if(this.formula.match(checkOperation)){
        let operation = this.formula.match(getOperation)[0];
        let cells = this.formula.match(cellsRegex);
        this.value = calculateResult(operation, cells);
    } else if (this.formula.match(checkSum)){
        let cells = this.formula.match(cellsRegex);
        this.value = calculateSum(cells);
    }
};

const attachFormulaCellEvent = (cells, formulaCell) => {
    cells.map((cell) => {
        let col = cell[0].toString().charCodeAt(0) - 64;
        let row = cell[1];
        let cellValue = table.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0];
        fromEvent(cellValue, 'change').subscribe(getChangeValue.bind(formulaCell));
    });
};


/*
table.addEventListener('change',  (event) =>{
    if(event.target.value.match(checkOperation)){
        let operation = getOperation.exec(event.target.value)[0];
        let cells = event.target.value.match(cellsRegex);
        event.target.value = calculateResult(operation ,cells);
    } else if (event.target.value.match(checkSum)) {
        let cells = event.target.value.match(cellsRegex);
        event.target.value = calculateSum(cells);
    }
});
*/


/*
* Below t2o method are used to Download data from table in CSV Format*/
const downloadCSV = (csv, filename)=> {
    let csvFile;
    let downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
};

const exportTableToCSV = (filename) => {
    let csv = [];

    let rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++)
            if (cols[j].getElementsByTagName('input').length > 0){
                row.push(cols[j].getElementsByTagName('input')[0].value);
            } else {
                row.push(cols[j].innerText);
            }

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
};


/*This method loads the data from data.csv in the same HTML table*/
loadData = function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './data.csv', true);
    xhr.onload = function(){
        let names = this.responseText;
        let allRows = this.responseText.split(/\r?\n|\r/);
        let rowCells = allRows[0].split(',');
        table.removeChild(document.getElementsByTagName('tbody')[0]);
        createTable(allRows.length, rowCells.length);
        let trs = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (let i = 1; i < trs.length - 1; i++){
            let tds = trs[i].getElementsByTagName('td');
            rowCells = allRows[i -1].split(',');
            for(let j = 1; j < tds.length; j++){
                tds[j].getElementsByTagName('input')[0].value = rowCells[j -1];
            }
        }
    };
    xhr.send();
};
