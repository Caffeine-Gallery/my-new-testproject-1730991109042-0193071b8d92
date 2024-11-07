import { backend } from 'declarations/backend';

const display = document.getElementById('display');
let currentOperation = null;
let firstOperand = null;

window.appendToDisplay = (value) => {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
};

window.clearDisplay = () => {
    display.value = '0';
    currentOperation = null;
    firstOperand = null;
};

window.calculate = async () => {
    if (currentOperation && firstOperand !== null) {
        const secondOperand = parseFloat(display.value);
        let result;

        try {
            switch (currentOperation) {
                case '+':
                    result = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    result = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    result = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    const divisionResult = await backend.divide(firstOperand, secondOperand);
                    if (divisionResult[0] === null) {
                        throw new Error('Division by zero');
                    }
                    result = divisionResult[0];
                    break;
            }

            display.value = result.toString();
        } catch (error) {
            display.value = 'Error';
            console.error('Calculation error:', error);
        }

        currentOperation = null;
        firstOperand = null;
    }
};

const operationButtons = document.querySelectorAll('.btn-primary');
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentOperation) {
            calculate();
        }
        firstOperand = parseFloat(display.value);
        currentOperation = button.textContent;
        display.value = '0';
    });
});
