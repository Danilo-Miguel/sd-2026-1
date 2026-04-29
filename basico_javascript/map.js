
// Mapa (chave - valor)
let mapa = new Map()

// Atribuindo chaves de tipos diferentes com respectivos valores
mapa.set("nome", "Victor")
mapa.set(42, "Numero como chave")
mapa.set(false, "Chave booleana")

// Recuperando o valor daquela chave (get) e se ela existe (has)
console.log(mapa.get("nome"))
console.log(mapa.has(true))

// Pegar o tamanho do Map
console.log(mapa.size)

// Iterando sobre um Map
mapa.forEach((valor,chave) => {
    console.log(`${chave}: ${valor}`)
})

// Iterando de forma condicional, cuidado com o tempo de operações e processamento
for(const[chave,valor] of mapa){
    if(valor == "f"){
        console.log(chave, valor)
        break // so para nao consumir tanto processamento
    }
}

// Operacao condicional com Map
if(mapa.has(false)){
    console.log(mapa.get(false))
}

// Remover itens do Map (por chave)
mapa.delete(false)

// Remover todos os elementos
mapa.clear()