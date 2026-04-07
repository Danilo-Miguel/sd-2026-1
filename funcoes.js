// // Tipos de funções em JavaScript

// const { resolve } = require("node:path/win32")

// // Função declarativa(Tradicional)

// function saudacao(nome){
//     return `Olá, ${nome}`

// }

// saudacao("João")

// console.log(saudacao("Danilo"))

// // função anônima


// const soma = function (a, b){
//     return a + b

// }
// console.log(soma(6,3))

// const sub = function(a, b){
//     return a - b
// }

// console.log("tipo do soma ", typeof soma)
// function executarOperacao(funcao, x, y){

//     return funcao(x,y)

// }

// console.log(executarOperacao(sub, 5,3))


// const multiplicar = (a, b) => console.log( `O resultado da multiplicação entre ${a} e ${b} e :`, a * b)


// // function multiplicar (a, b){

// //     return a * b

// // }

// console.log(multiplicar(4,2))


// function numero (numero = 10){
//     return `O número ${numero} é um número par`
// }


// // console.log(numero())
// console.log(numero(26))



// // (function(){

// //     let segredo = 123
// //     console.log("executando..")
// // }())



// function processar(valor, callback){
//     console.log("processando ...")
//     callback(valor)
// }

// processar(10, (num) => console.log(`Resultado: ${num * 2}`))


// function dobrar(num){
//     console.log(`O dobro do número ${num} é: `, num * 2)
// }


// processar(10, dobrar)


async function exemplo() {
    console.log("Antes");

    await new Promise(resolve => setTimeout(resolve, 10000))

    console.log("Depois")
    
}

exemplo()

function pegarNumero(){
    return Promise.resolve(10)
}
async function executar() {
let num = await pegarNumero();
console.log(num)    
}

executar()

