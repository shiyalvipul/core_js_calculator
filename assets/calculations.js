let operators = [
  {
    symbol: "x",
    calc: (a, b) => a * b,
  },
  {
    symbol: "÷",
    calc: (a, b) =>  a / b,
    
  },
  {
    symbol: "+",
    calc: (a, b) => a + b,
  },
  {
    symbol: "-",
    calc: (a, b) => a - b,
  }
];

const getOperator = symbol => {
  for(let i = 0; i < operators.length; i++) {
    if(operators[i].symbol === symbol) {
      return operators[i];
    }
  }
  return undefined;
}

const getOpPrecedence = symbol => {
  for(let i = 0; i < operators.length; i++) {
    if(operators[i].symbol === symbol) {
      return i;
    }
  }
  // return 100;
}
    
const hasPrecedence = (op1, op2) => {
  if(getOperator(op1) != undefined) {
    return getOpPrecedence(op1) <= getOpPrecedence(op2);
  }
}

let tokenList = [];
const addToken = token => {
  if(isNaN(token)) {
    if(!tokenList[tokenList.length - 1] && token === '-') {
      tokenList.push(token);
    }
    else if (tokenList[tokenList.length - 1]) {
      // let lastChar = tokenList[tokenList.length - 1];
      if(!isNaN(tokenList[tokenList.length - 1])) {
         tokenList.push(token);
      }
    }
  } 
  else {
    if(!isNaN(tokenList[tokenList.length - 1])) {
      tokenList[tokenList.length - 1] = tokenList[tokenList.length - 1] + token;
    } else {
      tokenList.push(token);
    }
  }  
  displayEquation();
}

let expString ='';

const displayEquation = () => {
  let htmlString = "";
  for(let i = 0; i < tokenList.length; i++) {
    if(isNaN(tokenList[i])) {
        htmlString += tokenList[i];
    } else {
      htmlString += tokenList[i];
    }
  }
  document.querySelector('#expression').innerHTML = htmlString;
  expString = htmlString;
}

const deleteLast = () => {
  if(isNaN(tokenList[tokenList.length - 1]) || tokenList[tokenList.length - 1] === '') {
    tokenList.pop();
  } else {
    tokenList[tokenList.length - 1] = tokenList[tokenList.length - 1].slice(0, -1);
  }
  displayEquation();
}

const calculate = () => {
  let expVal = [];
  let opStack = [];
  for(let i = 0; i < tokenList.length; i++) {
    if(!isNaN(tokenList[i])) {
      expVal.push(tokenList[i]);
    } else {
      while(opStack.length > 0 && hasPrecedence(opStack[opStack.length - 1], tokenList[i])) {
        let operator = getOperator(opStack.pop());
        expVal.push(applyOperator(operator, [expVal.pop(), expVal.pop()]));
      }
      opStack.push(tokenList[i]);
    }
  }
  
  while(opStack.length > 0) {
    let operator = getOperator(opStack.pop());
    expVal.push(applyOperator(operator, [expVal.pop(), expVal.pop()]));
  }
  output(expVal[0]);
}

const applyOperator = (operator, vals) => {
  let valA = vals[0];
  let valB = vals[1];
  let result;
  result = operator.calc(parseFloat(valB), parseFloat(valA));
  return result;
}

const output = out => {
  tokenList.length = 0;
  tokenList.push(String(out));
  return document.querySelector('#expression').innerHTML = out;
};

const processButton = (btnValue) => {
  switch(btnValue) {
    case "delete":
      deleteLast();
      break;
    case "clear":
        tokenList.length = 0;
        displayEquation();
      break;
    case "period":
      if(isNaN(tokenList[tokenList.length - 1])) {
        addToken("0.");
      } else {
        if(tokenList[tokenList.length - 1].indexOf(".") === -1) {
          tokenList[tokenList.length - 1] += ".";
        }
      }
      displayEquation();
      break;
    case "equals":
      calculate();
      break;
    default:
        addToken(btnValue);
  }
}

const onBtnClick = (btnValue) => {
  processButton(btnValue);
}

