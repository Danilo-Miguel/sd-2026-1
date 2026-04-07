
// Set = conjunto que não permite a repetição de valores
let conj = new Set([1,2,3,4,5,6,6])

console.log(conj)

// Adicionar itens
conj.add(7)
conj.add(2)

// Deletar itens
conj.delete(3)

// Iterando
conj.forEach(valor => console.log(valor))

// Validar valor
console.log(conj.has(2))

// Remover todos os valores
conj.clear()