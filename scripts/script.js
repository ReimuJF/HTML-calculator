{
    class Calculator {
        screenTextSelector;
        DEFAULT = '0';
        opFlag = false;
        memoryVar = 0;
        tempRes;
        lastOperation = "+0";

        constructor() {
            this.screenTextSelector = document.querySelector(".screen-text");
        }
        
        get screenValue() { return this.screenTextSelector.innerText };
        get screenNumber() { return +this.screenValue };
        set screenValue(value) { this.screenTextSelector.innerText = value };
        addToEnd = (value) => this.screenTextSelector.innerText += value;

        clearScreen = () => {
            this.screenValue = this.DEFAULT;
            this.tempRes = undefined;
            this.lastOperation = "+0";
        }

        clearScreenEnd = () => this.screenValue = this.screenValue.length > 1 ? this.screenValue.slice(0, -1) : this.DEFAULT;
        FormatBigNumber = (num) => Math.abs(num) > 10 ** 12 ? num.toExponential(7) : num;
        trunc = (num) => !(num % 1) ? num : +num.toFixed(5);

        arithmeticOp = (operator) => {
            if (this.tempRes === undefined) {
                this.tempRes = `${operator}${this.screenValue}`;
            } else {
                this.calculate();
                this.tempRes = `${operator}${this.screenValue}`;
            }
            this.opFlag = true;
        }

        res = () => {
            this.opFlag = true;
            this.calculate();
        }

        calculate = () => {
            let operation = this.tempRes || this.lastOperation
            let operator = operation[0];
            let tempNumber = +operation.slice(1,);
            let currentNumber = this.screenNumber;
            let result = 0;
            switch (operator) {
                case '+':
                    result = currentNumber + tempNumber;
                    break;
                case '-':
                    if (this.tempRes) {
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
                        this.screenValue = 'ERROR';
                        this.tempRes = undefined;
                        return;
                    }
                    if (this.tempRes) {
                        result = tempNumber / currentNumber;
                    }
                    else {
                        result = currentNumber / tempNumber;

                    }
                    break;
                case '%':
                    if (currentNumber === 0) {
                        this.screenValue = 'ERROR';
                        this.tempRes = undefined;
                        return;
                    }
                    if (this.tempRes) {
                        result = tempNumber % currentNumber;
                    }
                    else { return; }
                    break;
            }
            if (this.tempRes) {
                this.lastOperation = operator + currentNumber;
                this.tempRes = undefined;
            }
            this.screenValue = this.FormatBigNumber(this.trunc(result));
        }

        root = () => {
            if (this.screenValue[0] === '-') {
                this.screenValue = 'ERROR';
                return;
            }
            let result = Math.sqrt(this.screenNumber);
            this.screenValue = this.trunc(result);
        }

        addDot = () => {
            if (this.screenValue.includes('.') && !this.opFlag) return;
            if (this.opFlag) {
                this.screenValue = "0.";
                this.opFlag = false;
            }
            else {
                this.addToEnd('.');
            }
        }

        addDigit = key => {
            if (this.screenValue === '0') {
                this.screenValue = "";
            }
            if (!this.opFlag) {
                this.addToEnd(this.screenValue.length <= 11 ? key : '');
            }
            else {
                this.screenValue = key;
                this.opFlag = false;
            }
        }
        changeSign = () => this.screenValue = this.screenNumber * -1;
        memoryAdd = () => this.memoryVar += this.screenNumber;
        memorySub = () => this.memoryVar -= this.screenNumber;
        memoryClear = () => this.memoryVar = 0;
        memoryReturn = () => this.screenValue = this.memoryVar;

        keyMap = {
            "Delete": this.clearScreen,
            'Backspace': this.clearScreenEnd,
            "root": this.root,
            "res": this.res,
            "Enter": this.res,
            "sign": this.changeSign,
            memClear: this.memoryClear,
            memRet: this.memoryReturn,
            memPlus: this.memoryAdd,
            memMinus: this.memorySub,
            '.': this.addDot,
        }

        webKeyHandler = key => {
            if (this.screenValue === "ERROR") this.clearScreen();
            if ("+-*/%".includes(key)) this.arithmeticOp(key)
            else if (this.keyMap[key]) {
                this.keyMap[key]();
            }
            else if (/[0-9]/.test(key)) {
                this.addDigit(key);
            }
        }
    }

    const calculator = new Calculator();

    window.addEventListener("load", () => {
        document.querySelectorAll(".button").forEach(
            (button) => button.onclick =
                () => calculator.webKeyHandler(button.getAttribute('key'))
        )
    }
    );

    document.body.addEventListener('keypress', (key) => calculator.webKeyHandler(key.key));
    document.body.addEventListener("keydown", (key) => {
        if (key.key === 'Delete' || key.key === "Backspace")
            calculator.webKeyHandler(key.key);
    });


}
