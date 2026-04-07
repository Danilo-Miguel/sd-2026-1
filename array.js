// # **Arrays (Listas Ordenadas)**
//
// ### **Definicao**
// Um array e uma estrutura de dados que armazena varios valores em uma unica variavel.
// Os elementos ficam em posicoes numeradas chamadas de indices, que comecam em 0.

// Exemplo visual de indices em um array:
// Arrays   [4] [11] [15] [9]  
//           0   1    2   3



// Declaracao de um array de numeros.
let numeros = [10, 20, 30, 40]

// Acesso direto por indice (posicao).
console.log(numeros[0])
console.log(numeros[2])


// Declaracao de um array de strings.
let frutas = ["Mamão", "Melão", "Morango", "Maracujá"]

// Insercao de elementos:
// push adiciona no final, unshift adiciona no inicio.
frutas.push("Uva")
frutas.unshift("Goiaba")


// Remocao de elementos:
// pop remove o ultimo, shift remove o primeiro.
frutas.pop();
frutas.shift();

// splice(inicio, quantidade) remove elementos a partir de um indice.
frutas.splice(0,4) 

// Exibe o estado atual do array apos as operacoes acima.
console.log(frutas)

// forEach percorre todos os elementos com indice e valor.
frutas.forEach(( fruta, index) =>{
    console.log(`${index}: ${fruta}`)

}
)


// Array com tipos mistos (number, string, boolean, objeto e outro array).
let misto =  [42, "Texto", true, {nome: "Danilo"}, [1, 2, 3]]

// Exemplo envolvendo tamanho do array (length).
console.log(frutas[frutas.length] - 1)

// Loop for tradicional: usa contador numerico.
for (let i = 0; i < frutas.length; i++){
    console.log(`Indice ${i}: para a fruta ${frutas[i]}`)
}

// Loop for...of: percorre os valores diretamente.
for (let fruta of frutas){
    console.log(fruta)
}


// Loop for...in: percorre os indices/chaves do array.
for (let indice in frutas){
 console.log(`Indice ${indice}: para a fruta ${frutas[indice]}`)}