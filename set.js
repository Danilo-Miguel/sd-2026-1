// # set
//
// ## Definicao
// Set e uma estrutura de dados que armazena valores unicos.
// Isso significa que elementos repetidos sao ignorados automaticamente.

// Cria um Set com valores iniciais.
// O valor 6 repetido aparece apenas uma vez no conjunto final.
let conj = new Set([1,2,3,4,6,6])

// Exibe o Set completo.
console.log(conj)

// add insere novos valores no Set.
// Se o valor ja existir (como o 2), ele nao e duplicado.
conj.add(7)
conj.add(2)

// delete remove um valor especifico do Set.
conj.delete(3)

// forEach percorre todos os valores do Set.
conj.forEach(valor => console.log(valor))

// has verifica se um valor existe no Set.
console.log(conj.has(2))

// clear remove todos os valores do Set.
conj.clear()