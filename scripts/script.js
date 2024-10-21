const screenText = document.querySelector(".screen-text");
const DEFAULT = '0';
let opFlag = false;
let memoryVar = 0;
let tempRes = 0;
let endOfEquation = false;
let lastOperation = "+0";
window.addEventListener("load", () => {
    document.querySelectorAll(".button").forEach(
        (button) => button.onclick =
            () => screenTextUpdate(button.getAttribute('key'))
    )
}
);

const clearScreen = () => {
    screenText.innerText = DEFAULT;
    tempRes = 0;
}

const clearScreenEnd = () => screenText.innerText = screenText.innerText.length > 1 ? screenText.innerText.slice(0, -1) : DEFAULT;

const FormatBigNumber = (num) => num > 10 ** 13 ? num.toExponential(4) : num;

const arithmeticOp = (operator) => {

    if (tempRes === 0) {
        tempRes = `${operator}${screenText.innerText}`;
    } else {
        calculate();
        tempRes = `${operator}${screenText.innerText}`;
    }
    opFlag = true;
}
const trunc = (num) => !(num % 1) ? num : num.toFixed(7)
const res = () => {
    opFlag = true;
    calculate();
}
const calculate = () => {
    let operation = tempRes || lastOperation
    console.log();
    let operator = operation[0];
    let tempNumber = operation.slice(1,);
    let currentNumber = +screenText.innerText;
    console.log(operation, currentNumber)
    let result = 0;
    switch (operator) {
        case '+':
            result = currentNumber + +tempNumber;
            result = trunc(result)
            if (tempRes != 0) {
                lastOperation = operator + currentNumber;
                tempRes = 0;
            }
            break;
        case '-':
            if (tempRes != 0) {
                lastOperation = operator + currentNumber;
                tempRes = 0;
                result = tempNumber - currentNumber;
            }
            else {
                result = currentNumber - tempNumber;
            }
            result = trunc(result);
            break;
        case '*':
            result = currentNumber * +tempNumber;
            result = trunc(result);
            if (tempRes != 0) {
                lastOperation = operator + currentNumber;
                tempRes = 0;
            }
            break;
        case '/':
            if (currentNumber === 0) {
                screenText.innerText = 'ERROR';
                tempRes = 0;
                return;
            }
            if (tempRes != 0) {
                lastOperation = operator + currentNumber;
                tempRes = 0;
                result = tempNumber / currentNumber;
            }
            else {
                result = currentNumber / tempNumber;
                result = trunc(result);
            }
            break;
        case '%':
            if (currentNumber === 0) {
                screenText.innerText = 'ERROR';
                tempRes = 0;
                return;
            }
            if (tempRes != 0) {
                lastOperation = operator + currentNumber;
                tempRes = 0;
                result = tempNumber % currentNumber;
                result = trunc(result);
            }
            else { return; }
            break;

    }
    screenText.innerText = FormatBigNumber(result);
}

const root = () => {
    let res = Math.sqrt(+screenText.innerText);
    screenText.innerText = !(res % 1) ? res : res.toFixed(7);
}
const memoryAdd = () =>  memoryVar += +screenText.innerText;
const memorySub = () => memoryVar -= screenText.innerText;
const memoryClear = () => memoryVar = 0;
const memoryReturn = () => screenText.innerText = memoryVar;
const keyMap = {
    clear: clearScreen,
    clearEnd: clearScreenEnd,
    "root": root,
    "res": res,
    memClear: memoryClear,
    memRet: memoryReturn,
    memPlus: memoryAdd,
    memMinus: memorySub,
}

const screenTextUpdate = (key) => {
    if (screenText.innerText === "ERROR") clearScreen();
    if (screenText.innerText === '0' && key !== '.') {
        screenText.innerText = '';
    }
    if (key === '.' && screenText.innerText.includes('.')) return;
    if ("+-*/%".includes(key)) arithmeticOp(key)
    else if (!!keyMap[key]) {
        keyMap[key]();
    }
    else {
        if (!opFlag) {
            screenText.innerText += screenText.innerText.length <= 11 ? key : '';
        }
        else {
            screenText.innerText = key;
            opFlag = false;
        }
    }
}   
