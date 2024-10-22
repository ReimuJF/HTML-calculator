
{
    const screenText = document.querySelector(".screen-text");
    const DEFAULT = '0';
    let opFlag = false;
    let memoryVar = 0;
    let tempRes;
    let lastOperation = "+0";

    window.addEventListener ("load", () => {
        document.querySelectorAll(".button").forEach(
            (button) => button.onclick =
                () => webKeyHandler(button.getAttribute('key'))
        )
    }
    );

    const clearScreen = () => {
        screenText.innerText = DEFAULT;
        tempRes = undefined;
        lastOperation = "+0";
    }

    const clearScreenEnd = () => screenText.innerText = screenText.innerText.length > 1 ? screenText.innerText.slice(0, -1) : DEFAULT;

    const FormatBigNumber = (num) => num > 10 ** 12 ? num.toExponential(7) : num;

    const arithmeticOp = (operator) => {

        if (tempRes === undefined) {
            tempRes = `${operator}${screenText.innerText}`;
        } else {
            calculate();
            tempRes = `${operator}${screenText.innerText}`;
        }
        opFlag = true;
    }
    const trunc = (num) => !(num % 1) ? num : +num.toFixed(5);

    const res = () => {
        opFlag = true;
        calculate();
    }
    
    const calculate = () => {
        let operation = tempRes || lastOperation
        let operator = operation[0];
        let tempNumber = +operation.slice(1,);
        let currentNumber = +screenText.innerText;
        let result = 0;
        switch (operator) {
            case '+':
                result = currentNumber + tempNumber;
                break;
            case '-':
                if (tempRes) {
                    result = tempNumber - currentNumber;
                }
                else {
                    result = currentNumber - tempNumber;
                }
                break;
            case '*':
                result = currentNumber * tempNumber;
                break;
            case '/':
                if (currentNumber === 0) {
                    screenText.innerText = 'ERROR';
                    tempRes = undefined;
                    return;
                }
                if (tempRes) {
                    result = tempNumber / currentNumber;
                }
                else {
                    result = currentNumber / tempNumber;

                }
                break;
            case '%':
                if (currentNumber === 0) {
                    screenText.innerText = 'ERROR';
                    tempRes = undefined;
                    return;
                }
                if (tempRes) {
                    result = tempNumber % currentNumber;
                }
                else { return; }
                break;

        }
        if (tempRes) {
            lastOperation = operator + currentNumber;
            tempRes = undefined;
        }
        screenText.innerText = FormatBigNumber(trunc(result));
    }

    const root = () => {
        let res = Math.sqrt(+screenText.innerText);
        screenText.innerText = trunc(res);
    }
    const addDot = () => {
        if (screenText.innerText.includes('.') && !opFlag) return;
        if (opFlag) {
            screenText.innerText = "0.";
            opFlag = false;
        }
        else {
            screenText.innerText += '.';
        }
    }
    const addDigit = (key) => {
        if (screenText.innerText === '0') {
            screenText.innerText = '';
        }
        if (!opFlag) {
            screenText.innerText += screenText.innerText.length <= 11 ? key : '';
        }
        else {
            screenText.innerText = key;
            opFlag = false;
        }
    }
    const memoryAdd = () => memoryVar += +screenText.innerText;
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
        '.': addDot,
    }

    const webKeyHandler = (key) => {
        if (screenText.innerText === "ERROR") clearScreen();
        if ("+-*/%".includes(key)) arithmeticOp(key)
        else if (!!keyMap[key]) {
            keyMap[key]();
        }
        else {
            addDigit(key);
        }
    }
}