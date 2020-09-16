/* <-------------------------------- DARK MODE -----------------------------> */

// recebendo o elemento
const darkBtn = document.querySelector('.btnTheme');
const rootElement = document.querySelector(':root');
const imageBtn = document.querySelector('button');

// quando o dark button for clicado
darkBtn.addEventListener('click', () => {
  // criando uma key no localstorage
  setTheme = localStorage.getItem('dark-mode');

  // caso ele não esteja no modo dark
  if (setTheme !== 'dark') {
    // muda as classes css em dark
    rootElement.classList.toggle('dark-mode');
    // armazenando no localstorage o dark mode
    setTheme = localStorage.setItem('dark-mode', 'dark');
    // alterando a imagem do botão
    imageBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
  // caso ele esteja no modo dark
  else {
    // muda as classes css para light
    rootElement.classList.toggle('dark-mode');
    // armazenando no localstorage o light mode
    setTheme = localStorage.setItem('dark-mode', 'light');
    // alterando a imagem do botão
    imageBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

});

// váriavel que cria a key no localstorage
let setTheme = localStorage.getItem('dark-mode');

// caso seja feito o reload da página não altera o tema
if (setTheme !== 'dark') {
  rootElement.classList.toggle('dark-mode');
}

/* <------------------------------- CALCULADORA ----------------------------> */

// variável responsavel pelo último operador
let finalOperator = '';

// variável responsavel pelo último número
let finalNumber = '';

// array responsavel pelos calculos
let calculation = [];

// recebendo o elemento
let display = document.querySelector('#display');

// chamando as funçóes
btnEvents();
keyboardEvents();

/* metodo que aplica multiplos eventos,
   recebendo como parametro o elemento, o tipo de
   evento, e a função. */
function addEventListenerAll(element, events, funct) {
  // colocandos os eventos dentro de um array
  events.split(' ').forEach((event) => {
    // quando ele clicar no elemento ele retorna o evento e a função
    element.addEventListener(event, funct, false);
  })
}

// função que limpa tudo 
function clear() {
  calculation = [];
  finalNumber = '';
  finalOperator = '';

  // atualizar o display 
  updateDisplayNumber();
}

// função que limpa o ultimo valor informado
function clearEntry() {
  calculation.pop();
  // atualizar o display 
  updateDisplayNumber();
}

// função que recebe o último valor informado
function finalCalculation() {
  return calculation[calculation.length - 1];
}

// função que altera o último valor informado
function updateFinalCalculation(value) {
  calculation[calculation.length - 1] = value;
}

// função que recebe os operadores
function allOperators(value) {
  return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
}

// função que verifica se dentro do array possui três itens para calcular  
function addFinalCalculation(value) {
  // adiciona números e o operador
  calculation.push(value);

  // se houver mais de três valores no array
  if (calculation.length > 3) {
    toCompute();
  }

}

// recebendo o resultado das operações
function solution() {

  try {
    // une os dois valores com o operador
    return eval(calculation.join(''));
  } catch (error) {
    setTimeout(() => {
      messageError();
    }, 2);
  }
}

// função que calcula os dois valores com o operador
function toCompute() {

  let final = '';

  // guardar na memória o último operador
  finalOperator = finalValue();

  /* mostrando o resultado da operação, se o usuário 
   clicar no igual é efetuado um calculo do resultado com a última operação. 
  exemplo: 7 + 7 = 14 ao clicar no igual calcula 14 + 7 = 21 */

  // se receber menos de três operações
  if (calculation.length < 3) {
    // será que o igual está sendo apertado antes do três itens 
    let firstNumber = calculation[0];
    // o array recebe o numero operador numero. exemplo: 2 * 2 
    calculation = [firstNumber, finalOperator, finalNumber];
  }
  // se receber mais três operações
  if (calculation.length > 3) {
    // deleta o último valor do array
    final = calculation.pop();

    // guardando o resultado
    finalNumber = solution();

  } else if (calculation.length === 3) {

    // guardar na memória o último número
    finalNumber = finalValue(false);

  }


  let result = solution();

  if (final == '%') {
    // se o último valor for uma porcentagem recebe a operação e divide por 100
    result = result / 100;

    // atualiza o array
    calculation = [result];

  } else {
    // array atualizado com o resultado e o ultimo valor informado
    calculation = [result];

    // se last tiver algo ele adiciona no array
    if (final) {
      calculation.push(final);
    }

  }

  // atualizar o display 
  updateDisplayNumber();

}

// função que recebe o último valor informado
function finalValue(value = true) {
  let lastValue;

  // procurando o último número do array
  for (let i = calculation.length - 1; i >= 0; i--) {

    // se o último valor do array for uma operação
    if (allOperators(calculation[i]) === value) {
      // ele retorna o item 
      lastValue = calculation[i];
      // para o laço de repetição
      break;
    }

  }

  // se ele não encontrar um item continua com o último item
  if (!lastValue) {
    // lastValue = (value) ? finalOperator : finalNumber;
    if (value) {
      lastValue = finalOperator;
    } else {
      lastValue = finalNumber;
    }

  }

  // retorna o último item
  return lastValue;

}

// função que atualiza o último número do display
function updateDisplayNumber() {

  // o função recebe false porque é um número
  let lastNumber = finalValue(false);

  // se não tiver valor recebe o zero
  if (!lastNumber) {
    lastNumber = 0;
  }

  // mostrando o último número na tela
  showScreen(lastNumber);

}


// função que adiciona uma operação seja ele um número ou não
function addCalculation(value) {

  // recebe o ultimo valor é pergunta se o ele é um número ou não
  if (isNaN(finalCalculation())) {
    // se o ultimo valor for um operador
    if (allOperators(value)) {
      // troca o ultimo operador
      updateFinalCalculation(value);
    } else {
      // adiciona o operador
      addFinalCalculation(value);
      // atualizar o display 
      updateDisplayNumber();
    }

  } else {

    // se o ultimo valor informado for um operador 
    if (allOperators(value)) {
      // adiciona o operador
      addFinalCalculation(value);
    } else {
      // se o ultimo valor digitado for um número concatena
      let newValue = finalCalculation().toString() + value.toString();
      // esse novo valor cancatenado será junto com o array e o transforma em número
      updateFinalCalculation(newValue);

      // atualizar o display 
      updateDisplayNumber();
    }

  }

}

// função que retorna um erro
function messageError() {
  showScreen('error');
}

// função que adiciona o ponto
function addPoint() {

  // recebendo a ultima operação
  let lastCalculation = finalCalculation();

  // caso já exista um ponto não adicione outro
  if (typeof lastCalculation === 'string' && lastCalculation.split('').indexOf('.') > -1) {
    return;
  }

  // se ele for uma operador ou não existir
  if (allOperators(lastCalculation || !lastCalculation)) {
    // adiciona no array
    addFinalCalculation('0.');
  }
  // se ele não for um operador e não for vazio 
  else {
    // sobrescreve a ultima operação sem perde-la
    updateFinalCalculation(lastCalculation.toString() + '.');
  }

  // atualizar o display 
  updateDisplayNumber();
}

// função que executa os números
function effectButton(value) {
  switch (value) {
    case 'c':
      clear();
      break;
    case 'ce':
      clearEntry();
      break;
    case 'add':
      addCalculation('+');
      break;
    case 'sub':
      addCalculation('-');
      break;
    case 'div':
      addCalculation('/');
      break;
    case 'mult':
      addCalculation('*');
      break;
    case 'percent':
      addCalculation('%');
      break;
    case 'equal':
      toCompute();
      break;
    case 'point':
      addPoint();
      break;

    // informando os números 
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      addCalculation(parseInt(value));
      break;

    default:
      messageError();
      break;
  }
}

// função que inicia a aplicação
function btnEvents() {
  // selecionando o elemento
  let buttons = document.querySelectorAll('.btn');

  // percorrendo todos os botões
  buttons.forEach((btn) => {
    addEventListenerAll(btn, 'click drag', () => {
      let btnText = btn.className.replace('btn btn-', '');

      effectButton(btnText);
    });
  });

  // atualizar o display 
  updateDisplayNumber();
}

// função para receber eventos do teclado
function keyboardEvents() {

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'Escape':
        clear();
        break;
      case 'Backspace':
        clearEntry();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        addCalculation(event.key);
        break;
      case 'Enter':
      case '=':
        toCompute();
        break;
      case '.':
      case ',':
        addPoint();
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        addCalculation(parseInt(event.key));
        break;
    }
  });

}

function showScreen(value) {
  // se for informado mais de 12 caracteres retorna uma mensagem de erro
  if (value.toString().length > 12) {
    messageError();
    return false;
  }

  display.innerHTML = value;
}