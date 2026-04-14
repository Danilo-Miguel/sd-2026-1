// ==================================================
// SERVIDOR WEBSOCKET - Sistema de Pedidos
// ==================================================
//
// Como rodar:
//   Terminal 1: node ws-pedidos-servidor.js
//   Terminal 2: node ws-pedidos-cliente.js
//
// O que acontece:
//   - O servidor fica aguardando conexoes de clientes
//   - Quando um cliente envia um pedido, o servidor exibe no console
//     e confirma de volta para aquele cliente
//   - Se houver mais de um cliente conectado, todos recebem o aviso

// O que e a biblioteca "ws"?
// "ws" e uma biblioteca de WebSocket para Node.js.
// O Node.js nao tem suporte a WebSocket por padrao (diferente do navegador,
// que ja tem WebSocket disponivel globalmente).
// Para instalar: npm install ws
// Documentacao: https://github.com/websockets/ws
const WebSocket = require("ws")
// require("ws") carrega a biblioteca ws instalada na pasta node_modules.
// WebSocket aqui e um objeto com tudo necessario para criar servidores
// e conexoes WebSocket. E parecido com o require("express") que ja usamos.

// Cria o servidor WebSocket na porta 8080.
// WebSocket.Server e a classe que cria o servidor.
// { port: 8080 } e a configuracao minima: apenas a porta onde escutar.
// Diferente do Express (HTTP na porta 3000), o WebSocket usa o protocolo WS.
// URLs WebSocket comecam com ws:// (ou wss:// quando tem criptografia, como https).
const servidor = new WebSocket.Server({ port: 8080 })

console.log("---------------------------------------------")
console.log("Servidor de pedidos rodando em ws://localhost:8080")
console.log("Aguardando clientes se conectarem...")
console.log("---------------------------------------------")

// O evento "connection" dispara quando qualquer cliente abre uma conexao.
// "conexao" representa o canal aberto com aquele cliente especifico.
servidor.on("connection", function(conexao) {

    console.log("[ NOVO CLIENTE CONECTADO ]")

    // Manda uma mensagem de boas-vindas so para este cliente.
    conexao.send("Conexao estabelecida. Pode enviar pedidos!")

    // O evento "message" dispara quando este cliente envia qualquer dado.
    conexao.on("message", function(dados) {

        // O parametro "dados" chega como Buffer, nao como string.
        // Buffer e um formato binario que o Node usa internamente para trafego de rede.
        // .toString() converte esse Buffer para uma string de texto legivel.
        // Sem isso, o console mostraria algo como: <Buffer 7b 22 64 65 73...>
        const texto = dados.toString()

        // O que e JSON.parse?
        // JSON.parse() converte uma string no formato JSON em um objeto JavaScript.
        // Exemplo:
        //   string recebida : '{"descricao": "Pizza de calabresa"}'
        //   apos JSON.parse : { descricao: 'Pizza de calabresa' }  (objeto JS)
        //
        // O que e try/catch?
        // try/catch e usado para tratar erros que podem acontecer durante a execucao.
        // Se o codigo dentro do "try" lancar um erro, o "catch" captura e evita
        // que o servidor quebre. Aqui usamos porque o cliente pode enviar texto
        // simples (nao JSON), o que faria JSON.parse lancar um erro.
        //
        // Se o parse funcionar: pedido vira o objeto { descricao: "..." }
        // Se o parse falhar  : pedido vira { descricao: texto } (texto bruto como fallback)
        let pedido
        try {
            pedido = JSON.parse(texto)
        } catch (erro) {
            pedido = { descricao: texto }
        }

        console.log("[ PEDIDO RECEBIDO ]", pedido)

        // Monta a confirmacao para devolver ao cliente que fez o pedido.
        const confirmacao = "Pedido recebido: " + pedido.descricao

        // Envia a confirmacao de volta para o cliente que enviou o pedido.
        conexao.send(confirmacao)

        // Se houver outros clientes conectados (ex: um painel de cozinha),
        // notifica todos os outros sobre o novo pedido.
        //
        // servidor.clients e um Set (conjunto) com todas as conexoes ativas no momento.
        // forEach percorre cada conexao, uma por uma.
        servidor.clients.forEach(function(cliente) {

            // Duas verificacoes antes de enviar:
            //
            // 1. cliente !== conexao
            //    Garante que nao vamos reenviar a mensagem para o mesmo cliente
            //    que acabou de mandar o pedido. Seria redundante ele receber
            //    tanto a confirmacao quanto o aviso de fila.
            //
            // 2. cliente.readyState === WebSocket.OPEN
            //    readyState e o estado atual da conexao daquele cliente.
            //    WebSocket.OPEN e uma constante com valor 1, que significa
            //    "conexao aberta e pronta para trocar mensagens".
            //    Outros estados possiveis:
            //      WebSocket.CONNECTING (0) - ainda conectando
            //      WebSocket.CLOSING    (2) - esta fechando
            //      WebSocket.CLOSED     (3) - ja fechou
            //    Verificar isso evita erro ao tentar enviar para uma conexao morta.
            if (cliente !== conexao && cliente.readyState === WebSocket.OPEN) {
                cliente.send("[ NOVO PEDIDO NA FILA ] " + pedido.descricao)
            }
        })
    })

    // O evento "close" dispara quando o cliente encerra a conexao.
    conexao.on("close", function() {
        console.log("[ CLIENTE DESCONECTADO ]")
    })
})
