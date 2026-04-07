// # maps
//
// ## Definicao
// Map e uma estrutura de dados para armazenar pares chave-valor.
// Diferente de objetos comuns, um Map aceita qualquer tipo como chave
// (string, numero, boolean, objeto, etc.) e preserva a ordem de insercao.

// Cria um Map vazio.
let mapa = new Map()

// Adiciona pares chave-valor com diferentes tipos de chave.
mapa.set("nome", "Danilo")
mapa.set(42, "Número como chave")
mapa.set(false, "Chave booleana")

// get retorna o valor associado a uma chave.
console.log(mapa.get("nome"))

// has verifica se uma chave existe no Map (retorna true ou false).
console.log(mapa.has(true))

// Percorre todos os pares do Map com forEach.
// mapa.forEach((valor, chave) =>{
//     console.log(`${chave} : ${valor}`)
// })


// Exemplo de leitura condicional: so acessa a chave se ela existir.
if(mapa.has(false)){
    console.log(mapa.get(false))
}


// Percorre o Map com for...of (desestruturando em chave e valor).
// O break encerra o loop assim que a condicao for atendida.
for(const[chave, valor] of mapa){
    if(valor == "f") {
        console.log(chave, valor)
        break
    }
}


// size retorna a quantidade de elementos no Map.
console.log(mapa.size)


// delete remove uma entrada por chave.
mapa.delete(42)

// clear remove todas as entradas do Map.
mapa.clear()