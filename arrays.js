
// Array de strings
let frutas = ["Mamão", "Goiaba", "Morango", "Maracujá"] 

frutas.push("Uva")          // Adiciona item na lista, na ultima posicao
frutas.unshift("Goiaba")    // Adiciona item na lista, na primeira posicao

frutas.pop();               // Retira o ultimo item da lista
frutas.shift();             // Retira o primeiro item da lista

frutas.splice(1,2)          // Determina a deleção a partir daquela posição (1) e quantos itens (2)

// Array com varios tipos de dados
let misto = [42, "Texto", true, {nome: "Danilo"}, [1,2,3]]

// Length de um array
console.log(frutas[frutas.length] - 1)

////// Exemplos de diferentes Loops para arrays

// 1
frutas.forEach((fruta, index) => {
        console.log(`${index}: ${fruta}`)
    }
)
// 2
for (let i = 0; i <= frutas.length; i++){
    console.log(`Indice ${i}: para a fruta ${frutas[i]}`)
}

// 3
for (let fruta of frutas){
    console.log(fruta)
}