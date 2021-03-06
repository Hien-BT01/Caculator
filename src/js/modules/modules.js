import {
  arrayElements,
  output_operation,
  output_result,
  input,
  operators,
} from "../variables/variables.js";
let RADIAN = true;
import { buttons, datas, POWER, FACTORIAL } from "../variables/variables.js";
let count = 0;
let ans = 0;
arrayElements.forEach((arrayElement) => {
  buttons[count].id = arrayElement.name;
  count++;
});
const rad = document.getElementsByClassName("button")[0];
const deg = document.getElementsByClassName("button")[1];
console.log(rad)
input.addEventListener("click", (e) => {
  const target = e.target;
  arrayElements.forEach((button) => {
    if (button.name === target.id) {
      caculator(button);
    }
  });
});

function caculator(element) {
  if (element.type === "operator") {
    datas.formula.push(element.formula);
    datas.operation.push(element.symbol);
  } else if (element.type === "number") {
    datas.formula.push(element.formula);
    datas.operation.push(element.symbol);
  } else if (element.type === "math_function") {
    let squareBracket1, squareBracket2;
    if (element.name === "factorial") {
      squareBracket1 = "!";
      squareBracket2 = element.formula;
      datas.operation.push(squareBracket1);
      datas.formula.push(squareBracket2);
    } else if (element.name === "power") {
      squareBracket1 = "^(";
      squareBracket2 = element.formula;
      datas.operation.push(squareBracket1);
      datas.formula.push(squareBracket2);
    } else if ((element.name = "square")) {
      squareBracket1 = "^(";
      squareBracket2 = element.formula;
      datas.operation.push(squareBracket1);
      datas.formula.push(squareBracket2);
      datas.operation.push("2)");
      datas.formula.push("2)");
    }
  } else if (element.type === "trigo_function") {
    datas.operation.push(element.symbol + "(");
    datas.formula.push(element.formula);
  } else if (element.type === "calculate") {
    let formula_result = datas.formula.join("");
    let powerSearchResult = search(datas.formula, POWER);
    let factorialSearchResult = search(datas.formula, FACTORIAL);
    const bases = powerBaseGetter(datas.formula, powerSearchResult);
    bases.forEach((base) => {
      let totalReplace = base + POWER;
      let replaceMent = "Math.pow(" + base + ",";
      formula_result = formula_result.replace(totalReplace, replaceMent);
    });
    const NUMBERS = factorialBaseGetter(datas.formula,factorialSearchResult);
    NUMBERS.forEach(factorials => {
      formula_result = formula_result.replace(factorials.toReplace,factorials.replacement);
    })
    console.log(formula_result)
    let result;
    try {
      result = eval(formula_result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        result = "Syntax Error";
        updateOutputOperation(result);
        return;
      }
    }
    ans = result;
    datas.formula = [result];
    datas.operation = [result];
    updateOutputResult(result);
  } else if (element.type === "key") {
    if (element.name === "clear") {
      datas.formula = [];
      datas.operation = [];
      updateOutputResult(0);
    } else if (element.name === "delete") {
      datas.formula.pop();
      datas.operation.pop();
    } else if (element.name === "rad") {
      RADIAN = true;
      angleToggle();
    } else if (element.name === "deg") {
      RADIAN = false;
      angleToggle();
    }
  }
  updateOutputOperation(datas.operation.join(""));
}

//Update Output
function updateOutputOperation(operation) {
  output_operation.innerHTML = operation;
}

function updateOutputResult(result) {
  output_result.innerHTML = result;
}
function factorial(number) {
  if (number % 1 != 0) return gamma(number + 1);
  if (number === 0 || number === 1) return 1;
  let result = 1;
  for (let index = 1; index <= number; index++) {
    result *= index;
    if (result === Infinity) return Infinity;
  }
  return result;
}
function angleToggle() {
  rad.classList.toggle("active-angle");
  deg.classList.toggle("active-angle");
}
function inv_trigo(callback, value) {
  let angle = callback(value);
  if (!RADIAN) {
    angle = (angle * 180) / Math.PI;
  }
  return angle;
}

function trigo(callback, angle) {
  if (!RADIAN) {
    angle = (angle * Math.PI) / 180;
  }
  return callback(angle);
}
function powerBaseGetter(formulas, powerResult) {
  let powersBase = [];
  powerResult.forEach((powerIndex) => {
    let base = [];
    let parenthesesCount = 0;
    let previousIndex = powerIndex - 1;
    while (previousIndex >= 0) {
      if (formulas[previousIndex] == "(") parenthesesCount--;
      if (formulas[previousIndex] == ")") parenthesesCount++;

      let isOperator = false;
      operators.forEach((operator) => {
        if (formulas[previousIndex] === operator) isOperator = true;
      });
      let isPower = formulas[previousIndex] == POWER;
      if ((isOperator && parenthesesCount === 0) || isPower) break;
      base.unshift(formulas[previousIndex]);
      previousIndex--;
    }
    powersBase.push(base.join(""));
  });
  return powersBase;
}
function factorialBaseGetter(formulas,factorialResult){
  let numbers = [];
  let factorialSequence = 0;
  factorialResult.forEach(factorialIndex => {
    let number = [];
    let nextIndex = factorialIndex + 1;
    let nextInput = formulas[nextIndex];
    if(nextInput === FACTORIAL){
      factorialIndex += 1
      return;
    }
    let firstFactorialIndex = factorialIndex - factorialSequence;
    let previousIndex = firstFactorialIndex - 1;
    let parenthesesCount = 0;
    while (previousIndex >= 0) {
      if (formulas[previousIndex] == "(") parenthesesCount--;
      if (formulas[previousIndex] == ")") parenthesesCount++;

      let isOperator = false;
      operators.forEach((operator) => {
        if (formulas[previousIndex] === operator) isOperator = true;
      }); 
      if (isOperator && parenthesesCount === 0) break;
      number.unshift(formulas[previousIndex]);
      previousIndex--;
    }
    let numberStr = number.join("");
    const factorial = "factorial(", close_parenthesis = ")";
    let times = factorialSequence + 1;
    let toReplace = numberStr + FACTORIAL.repeat(times);
    let replacement = factorial.repeat(times) + numberStr + close_parenthesis.repeat(times); 
    numbers.push({
      toReplace:toReplace,
      replacement:replacement
    })
    factorialSequence = 0;
  })
  return numbers;
}
function search(array, keyword) {
  let result = [];
  array.forEach((element, index) => {
    if (element === keyword) result.push(index);
  });
  return result;
}
