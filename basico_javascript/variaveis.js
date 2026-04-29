/* Variaveis em javascript são Case-Sensitive (nome != NOME)

Var:    tem escopo global ou de função, pode ser redeclarada e reatríbuida;
Let:    tem escopo de bloco, não pode ser redeclarada, mas pode ser reatribuida;
const:  tem escopo de bloco, não pode ser redeclarada e nem reatribuida;

*/

if (true) {
    var nome = "Maria"
    var nome = "Victor"
    let sobrenome = "Martins"
    sobrenome = "Almeida"
    
    console.log(sobrenome)

    const idade = 21
}

console.log(nome)

// armazenando variavel de um input (ainda via console)
const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin
    ,output: process.stdout
})
rl.question("Digite seu nome: ", (nome) => {
    console.log("Bem vindo: " + nome)
})

// elevação: conseguimos acessar a variavel antes de declarar, porém ela fica indefinidad
console.log(x)
var x = 10

// encapsulamento (getter and setter)
function criar(){
    let nome = "Matheus"
    return{
        getNome(){return nome}
    }
}

const cr = criar()
console.log(cr.getNome())