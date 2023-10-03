const _question = document.getElementById("question"); //get element by id pega o elemento html com o id em verde e armazena na constante declarada no início do comando
const _options = document.querySelector(".quiz-options"); //a mesma coisa porém com classes
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");

//iniciando umas variáveis
let correctAnswer = "", //armazena a resposta certa da pergunta pra poder ser checada depois
  correctScore = (askedCount = 0), //conta acertos e quantas pergunta são feitas
  totalQuestion = 10;

// carregar questões da API de forma "aleatória"
async function loadQuestion() {
  const APIUrl =
    "https://opentdb.com/api.php?amount=1&category=18&difficulty=easy&type=multiple";
  const result = await fetch(`${APIUrl}`); //faz a chamada da API e espera a resposta
  const data = await result.json();
  _result.innerHTML = ""; //limpa o que estiver dentro de _result
  showQuestion(data.results[0]);
}

// event listeners são listas de passos a serem seguidos pelos designados por ele, então o botão de "check" sobre um clique vai realizar a função designada para ele
function eventListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", function () { //quando o DOM carrega completo os comandos são executados
  loadQuestion(); //carrega a pergunta
  eventListeners(); //aciona as listas de funções
  _totalQuestion.textContent = totalQuestion; //muda as questões já geradas pela contagem certa
  _correctScore.textContent = correctScore; //mesma coisa mas pros acertos
});

// display de questões e opções
function showQuestion(data) {
  _checkBtn.disabled = false; //libera o botão de check
  correctAnswer = data.correct_answer; //guarda a resposta correta
  let incorrectAnswer = data.incorrect_answers; //coloca as respostas incorretas em uma lista
  let optionsList = incorrectAnswer; //embaralha as respostas
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span> </span>`; //coloca o texto da pergunta no elemento _question
  //Cria elementos HTML para as opções de resposta e os adiciona ao elemento _options
  _options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
          )
          .join("")}
    `;
  selectOption();//chama a permição pra selecionar uma opção
}

//função que permite a seleção de opções
function selectOption() {
  _options.querySelectorAll("li").forEach(function (option) { // seleciona todos os elementos li dentro do elemento com a classe "quiz-options" (_options)
    option.addEventListener("click", function () { //adiciona um event listener de clique para cada elemento
      if (_options.querySelector(".selected")) { //verifica se já existe uma opção selecionada
        const activeOption = _options.querySelector(".selected"); // se uma opção já foi selecionada, encontra a opção ativa
        activeOption.classList.remove("selected"); //Remove a classe "selected" da opção ativa
      }
      option.classList.add("selected"); // adiciona a classe "selected" à opção atualmente clicada
    });
  });
}

// verificando a resposta
function checkAnswer() {
  _checkBtn.disabled = true; //desabilita o botão de check
  if (_options.querySelector(".selected")) {
    // Obtém a resposta selecionada pelo usuário
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    // Compara a resposta selecionada com a resposta correta
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;//aumenta a pontuação
      _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      // Exibe mensagem de resposta incorreta e a resposta correta
      _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    // Chama a função para atualizar a contagem
    checkCount();
  } else {
    _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}

//convertendo entidades em html para texto normal ps: não tenho certeza de como funciona ainda
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}
//Função para verificar se todas as perguntas foram feitas
function checkCount() {
  askedCount++; //aumenta as perguntas feitas
  setCount(); //chama a função de atualização
  if (askedCount == totalQuestion) {
    setTimeout(function () {
      console.log(""); //exibe uma string vazia pra dar um tempo para analisar as informações recebidas
    }, 5000);
    //caso tenham sido feitas as dez perguntas
    _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    //caso não tenham sido feitas as dez perguntas
    setTimeout(function () {
      loadQuestion();
    }, 300);
  }
}

// Função para atualizar a contagem de perguntas e pontuação
function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}
//restartar o quiz
function restartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
