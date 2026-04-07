
// Objeto: conjunto de dados agrupados por chave e valor
let pessoa = {
    nome: "Victor",
    idade: 21,
    profissao: "Analista CRM",
    endereco: {
        rua: "Av. Cecilia",
        numero: 61
    }
}

// Diferentes formas de resgatar valores de objetos
console.log(pessoa.nome)
console.log(pessoa["idade"])
console.log(pessoa.endereco.rua)

// Iterando objetos
for (let chave in pessoa){
    console.log(`${chave}: ${pessoa[chave]}`)
}

// Transformar objeto em um array
console.log(Object.entries(pessoa))