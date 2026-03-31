// ==================================================
// JAVASCRIPT - VARIAVEIS E CONCEITOS FUNDAMENTAIS
// ==================================================

// Em Node.js, a entrada de dados no terminal normalmente usa o modulo readline.
// Isso substitui o prompt() do navegador.
const readline = require("readline")

// ==================================================
// 1. REGRAS DA SINTAXE DO JAVASCRIPT
// ==================================================

// JavaScript e case-sensitive:
// nome, Nome e NOME sao identificadores diferentes.
// JavaScript tambem aceita identificadores com suporte a Unicode.

/* - Variáveis em JavaScript são Case-Sensitive nome e NOME são variáveis diferentes
   - Varaiáveis em javaScript tem suport a UNICODE, ou seja, podem conter caracteres acentuados e emojis
*/  
// ==================================================
// 2. IDENTIFICADORES DE VARIAVEIS
// ==================================================

// Identificadores sao os nomes dados para variaveis, funcoes, objetos e classes.
// Convencoes mais comuns:
// nome_completo  snake_case
// nomeCompleto    camelCase  utilizado para variáveis e funções no JavaScript
// NomeCompleto    PascalCase 

// ==================================================
// 3. DECLARACAO DE VARIAVEIS
// ==================================================

// var:
// - escopo de funcao ou global
// - pode ser redeclarada
// - pode ser reatribuida
// - sofre hoisting com valor inicial undefined

// let:
// - escopo de bloco
// - nao pode ser redeclarada no mesmo bloco
// - pode ser reatribuida

// const:
// - escopo de bloco
// - nao pode ser redeclarada
// - nao pode ser reatribuida

// Declaração de variáveis

// ==================================================
// 4. VARIAVEIS GLOBAIS E DE ESCOPO
// ==================================================

// Variavel fora de bloco pode ser acessada no restante do arquivo.
// Neste exemplo, sobrenome foi declarada fora do if.

// Variáveis globeis
 let sobrenome = "Silva"

// O bloco abaixo mostra a diferenca entre var, let e const.
// O conteudo foi mantido como exemplo didatico.
if (true) {
    // var nome = "Maria" // var tem escopo global ou de função, pode ser redeclarada e reatribuída
    // var nome = "Danilo"
    // let sobrenome = "Souza" // let tem escopo de bloco, não pode ser redeclarada, mas pode ser reatribuída
    // sobrenome = "Miguel"
    // // console.log(sobrenome)
    // const idade = 40 // const tem escopo de bloco, não pode ser redeclarada e nem reatribuída
    // // idade  = 39
    // idade = 25 // const tem escopo de bloco, não pode ser redeclarada e nem reatribuída
}

// console.log(sobrenome) // Maria
// console.log(sobrenome) // Silva
//console.log(idade) // 30

// ==================================================
// 5. HOISTING
// ==================================================

// Hoisting e o comportamento em que declaracoes sao elevadas para o topo do escopo.
// Com var, a declaracao sobe e o valor inicial fica como undefined.
// Com let e const, nao se deve acessar a variavel antes da declaracao.

// elevação
// console.log(x)
// var x = 10;

// ==================================================
// 6. ESCOPO E ENCAPSULAMENTO
// ==================================================

// Este exemplo mostra uma funcao criando um escopo proprio.
// A variavel interna pode ser acessada por meio do metodo retornado.

// function criar(){
//     let nome  = "Matheus"
//     return{
//         getNome() {return nome}
//     }
// }

// const cr = criar()
// console.log(cr.getNome())

// ==================================================
// 7. ENTRADA E SAIDA DE DADOS
// ==================================================

// Em Node.js, a entrada de dados pode ser feita com readline.
// A saida normalmente e feita com console.log().

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question("Digite seu nome: ", (nome) => {
console.log("opa " + nome)
})





// ==================================================
// 8. TIPOS DE DADOS EM JAVASCRIPT
// ==================================================

// Abaixo aparecem exemplos de tipos comuns em JavaScript:
// string, number, boolean, null, undefined, object e array.

nome = "Danilo"
numero = 45
numero_decimal - 16.2
logico =  true
entrada =  null
valor = undefined
usuario = {nome: "Danilo", idade: 40}
frutas = ["maça", "uva", "banana"]


// ==================================================
// 9. CONVERSÃO DE TIPOS DE DADOS EM JAVASCRIPT
// ==================================================

// String -> Número

let num1 = "35"
Number(num1) // saída número -> 35
let num = Number("42") // saída número 42 

let float = parseFloat("3.14"); // saída número 3.14 
let inteiro = parseInt("10.5") // saída número 10 

// Número - > String

let str = String(100) // "100"
let str2 = (12).toString() // "12"

// Boolen -> Número

console.log(Number(true)) // 1
console.log(Number(false)) // 0

// ==================================================
// 10. LITERAIS EM JAVASCRIPT
// ==================================================

let texto = "Isso é uma string"
console.log("String literal")
let template = ` Olá, ${nome}`


let fruta = "uva"
let frutas = ["Maça", "Mamão", "Melão"]

let ligado = true
let desligado = false

let pessoa = {
    nome: "Ana",
    idade: "30"
}
