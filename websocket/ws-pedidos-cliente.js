// ==================================================
// CLIENTE WEBSOCKET - Faz pedidos em tempo real
// ==================================================
//
// Como rodar:
//   Terminal 1: node ws-pedidos-servidor.js  (primeiro!)
//   Terminal 2: node ws-pedidos-cliente.js
//
// Para simular varios clientes ao mesmo tempo:
//   Abra um Terminal 3 e rode tambem: node ws-pedidos-cliente.js
//   Os dois clientes vao se ver mandando pedidos.

const WebSocket = require("ws")

// Conecta ao servidor WebSocket.
// Diferente do REST onde cada requisicao abre e fecha uma conexao,
// aqui abrimos UMA conexao e ela fica aberta durante toda a execucao.
const cliente = new WebSocket("ws://localhost:8080")

// Lista de pedidos que este cliente vai enviar, um a cada 3 segundos.
const pedidos = [
    { descricao: "Pizza de calabresa" },
    { descricao: "Refrigerante gelado" },
    { descricao: "Sorvete de chocolate" }
]

let indice = 0

// O evento "open" dispara quando a conexao com o servidor e estabelecida.
// So aqui e seguro comecar a enviar mensagens.
cliente.on("open", function() {
    console.log("Conectado ao servidor!")
    console.log("Enviando pedidos a cada 3 segundos...\n")

    // Envia um pedido a cada 3 segundos usando setInterval.
    // setInterval(funcao, intervalo_em_ms) repete a funcao no intervalo dado.
    const intervalo = setInterval(function() {

        // Verifica se ainda ha pedidos para enviar.
        if (indice >= pedidos.length) {

            console.log("\nTodos os pedidos foram enviados.")
            console.log("Encerrando conexao...")

            // Encerra o intervalo para parar de chamar a funcao.
            clearInterval(intervalo)

            // Fecha a conexao WebSocket com o servidor.
            // No REST isso acontece automaticamente. Aqui precisamos fechar.
            cliente.close()
            return
        }

        const pedido = pedidos[indice]

        // JSON.stringify converte o objeto JavaScript para uma string JSON
        // para poder ser enviado pelo WebSocket.
        const mensagem = JSON.stringify(pedido)

        console.log("Enviando pedido: " + pedido.descricao)

        // Envia a mensagem pelo canal aberto.
        // A conexao continua aberta depois disso, pronta para mais mensagens.
        cliente.send(mensagem)

        indice++

    }, 3000)
})

// O evento "message" dispara quando o SERVIDOR envia uma mensagem para este cliente.
// Isso e o que diferencia o WebSocket do REST:
// no REST o servidor so responde quando o cliente pede.
// Aqui o servidor pode mandar mensagens a qualquer momento.
cliente.on("message", function(dados) {
    console.log("Servidor respondeu: " + dados.toString())
})

// O evento "close" dispara quando a conexao e encerrada.
cliente.on("close", function() {
    console.log("Conexao encerrada.")
})

// O evento "error" dispara se nao conseguir conectar ao servidor.
// Mensagem comum: se o servidor nao estiver rodando.
cliente.on("error", function(erro) {
    console.log("Erro de conexao. O servidor esta rodando?")
    console.log("Rode primeiro: node ws-pedidos-servidor.js")
})
