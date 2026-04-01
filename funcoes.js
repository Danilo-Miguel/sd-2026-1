
//==============================================
//       Tipos de funções em JavaScript
//==============================================

// Funções declarativas (tradicional)

function saudacao(nome){
    return `Olá, ${nome}`
}

console.log(saudacao("Victor"));

// Função Anônima

const soma = function(a, b){
    return a + b;
}

console.log(soma(10,5))

const sub = function(a,b){
    return a - b;
}

// Anônima dentro de tradicional

//console.log(sub(10,5));

//function executarOperacao(funcao, x, y){
//    return funcao(x,y);
//}

//console.log(executarOperacao(soma(20,10)));

// Arrow Function

const multiplicar = (a,b) => a * b

console.log(multiplicar(10,6))

// pre definida

function numero (numero = 10){
    return `O número ${numero} é par`
}

//  Autoexecutada (expressão)

//console.log(numero())
//console.log(numero(26)) // sobrescreve o 10, hierarquia

//(function(){
//    console.log("Autoexecutável")
//}())

// Callback

function processar(valor, callback){
    console.log("Processando ...")
    callback(valor);
}

processar(10,(num) => console.log(`Resultado: ${num * 2}`))

function dobrar(num){
    console.log(`O dobro do número ${num} é: `, num * 2)
}

processar(10, dobrar)

// Async e Await

async function exemplo(){
    console.log("Antes")

    await new Promise(resolve => setTimeout(resolve, 10000))

    console.log("Depois")
}

exemplo()

function pegarNumero(){
    return Promise.resolve(10)
}

async function executar(){
    let num = await pegarNumero();
    console.log(num)
}

executar()