
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else if (operation == '*' || operation == '/'){
        return 2;
    } else{
        return 0;
    }
}


function isNumeric(str) {
    return /^\d+(\.\d+)?$/.test(str);
}


function isDigit(str) {
    return /^\d$/.test(str);
}


function isOperation(str) {
    return /^[+\-*/]$/.test(str);
}


function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber = lastNumber + char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}


function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}


function evaluate(str) {
    let out = [];
    let tokens = str.split(' ');
    for (token of tokens) {
        if (isNumeric(token)) {
            out.push(parseFloat(token));
        } else if (isOperation(token)) {
            let op2 = out.pop();
            let op1 = out.pop();
            if (token == '+') {
                out.push(op1 + op2);
            } else if (token == '-') {
                out.push(op1 - op2);
            } else if (token == '*') {
                out.push(op1 * op2);
            } else if (token == '/') {
                out.push(op1 / op2);
            }
        }
    }
    return out.pop();
}


function clickHandler(event) {
    let screen = document.querySelector('.screen span');
    let target = event.target;
    let pre = target.textContent;

    if (target.classList.contains('digit') || target.classList.contains('operation') || target.classList.contains('bracket')) {
        screen.textContent = screen.textContent + pre;
    } else if (target.classList.contains('clear')) {
        screen.textContent = '';
    } else if (target.classList.contains('result')) {
        let result = evaluate(compile(screen.textContent));
        screen.textContent = result.toFixed(2);
    }
}


window.onload = function () {
    let calc = document.querySelector('.buttons');
    calc.addEventListener('click', clickHandler);
};