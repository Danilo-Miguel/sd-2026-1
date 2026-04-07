let pessoa = {
    nome: "Danilo",
    idade: 40,
    profissao: "Professor",
    endereco:{
        rua:  "Rua A",
        numero: 123
    }
}

// console.log(pessoa.nome)
// console.log(pessoa["idade"])
// console.log(pessoa.endereco.rua)


for (let chave in pessoa){
    console.log(`${chave}: ${pessoa[chave]}`)
}


console.log(Object.entries(pessoa))