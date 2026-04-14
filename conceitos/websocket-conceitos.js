// ==================================================
// REST vs WebSocket
// ==================================================
//
// RESPOSTA DIRETA: Sim, tudo que fizemos no monolito.js e REST.
// Cada rota (GET /usuarios, POST /pedidos...) e uma chamada REST.
//
// ==================================================
// O QUE E REST?
// ==================================================
//
// REST (Representational State Transfer) e um estilo de comunicacao
// baseado em requisicao e resposta.
//
// O ciclo de vida de uma comunicacao REST e sempre assim:
//
//   1. Cliente envia uma requisicao  -->  Servidor
//   2. Servidor processa
//   3. Servidor devolve uma resposta -->  Cliente
//   4. A conexao e ENCERRADA.
//
// Caracteristicas do REST:
//   - Quem inicia a comunicacao e SEMPRE o cliente.
//   - O servidor NUNCA fala com o cliente por conta propria.
//   - Cada requisicao e independente (sem memoria da anterior).
//   - Usa os metodos HTTP: GET, POST, PUT, PATCH, DELETE.
//
// Quando usar REST:
//   - Buscar dados (listar usuarios, buscar um produto)
//   - Criar, editar ou deletar registros
//   - Qualquer operacao onde o cliente pede e o servidor responde
//
// Exemplo do dia a dia:
//   Voce abre o Instagram --> o app faz GET /feed --> servidor responde com as fotos.
//   A conexao termina. Para atualizar, voce puxa para baixo e uma NOVA requisicao e feita.
//
// ==================================================
// O QUE E WEBSOCKET?
// ==================================================
//
// WebSocket e um protocolo de comunicacao que cria um canal PERSISTENTE
// e BIDIRECIONAL entre cliente e servidor.
//
// O ciclo funciona assim:
//
//   1. Cliente abre uma conexao com o servidor (handshake)
//   2. A conexao FICA ABERTA
//   3. Qualquer lado pode enviar mensagens a qualquer momento
//   4. A conexao so fecha quando um dos lados decidir fechar
//
// Caracteristicas do WebSocket:
//   - Tanto o cliente QUANTO o servidor podem enviar mensagens.
//   - A conexao e continua (nao abre e fecha a cada mensagem).
//   - Muito mais rapido para comunicacao em tempo real.
//   - Nao usa os metodos HTTP (GET, POST...) apos a conexao ser aberta.
//
// Quando usar WebSocket:
//   - Chat em tempo real
//   - Notificacoes ao vivo (sem precisar atualizar a pagina)
//   - Jogos online
//   - Cotacoes de acoes atualizando em tempo real
//   - Colaboracao simultanea (tipo Google Docs)
//
// Exemplo do dia a dia:
//   Voce abre o WhatsApp Web --> uma conexao WebSocket e aberta com o servidor.
//   Quando alguem te manda mensagem, o servidor EMPURRA a mensagem para voce
//   automaticamente, sem voce ter pedido nada.
//
// ==================================================
// COMPARACAO: REST x WebSocket
// ==================================================
//
//   Caracteristica        | REST                        | WebSocket
//   ----------------------|-----------------------------|---------------------------
//   Quem inicia           | Sempre o cliente            | Qualquer lado
//   Conexao               | Abre e fecha por requisicao | Fica aberta
//   Comunicacao           | Uma via por vez             | Duas vias simultaneas
//   Velocidade            | Mais lenta (overhead HTTP)  | Mais rapida (canal direto)
//   Uso tipico            | CRUD, APIs                  | Tempo real, eventos ao vivo
//   Protocolo             | HTTP                        | WS (ws:// ou wss://)
//
// IMPORTANTE: REST e WebSocket nao competem entre si.
// Sao usados para propositos diferentes e frequentemente coexistem
// no mesmo sistema. Ex: um app de e-commerce usa REST para
// cadastrar produtos e WebSocket para notificar o vendedor
// quando um pedido chega em tempo real.
//
// ==================================================
// EXEMPLO PRATICO COM WEBSOCKET
// ==================================================
//
// Para este exemplo precisamos instalar a biblioteca "ws":
//   npm install ws
//
// O que este exemplo faz:
//   - Cria um servidor WebSocket na porta 8080
//   - Quando um cliente conecta, o servidor manda uma mensagem de boas-vindas
//   - Quando o cliente manda uma mensagem, o servidor ecoa de volta para TODOS
//     os clientes conectados (comportamento de chat simples)

const WebSocket = require("ws")

// Cria o servidor WebSocket escutando na porta 8080.
// wss.clients e um Set com todos os clientes conectados no momento.
const wss = new WebSocket.Server({ port: 8080 })

console.log("Servidor WebSocket rodando em ws://localhost:8080")

// O evento "connection" dispara toda vez que um novo cliente se conecta.
// "ws" aqui representa a conexao com AQUELE cliente especifico.
wss.on("connection", function(ws) {

    console.log("Novo cliente conectado")

    // Envia uma mensagem so para este cliente que acabou de conectar.
    // ws.send() envia dados pelo canal aberto.
    ws.send("Bem-vindo ao servidor WebSocket!")

    // O evento "message" dispara quando este cliente envia uma mensagem.
    // "dados" contem o conteudo da mensagem recebida.
    ws.on("message", function(dados) {

        const mensagem = dados.toString()
        console.log("Mensagem recebida: " + mensagem)

        // Reenvia (ecoa) a mensagem para TODOS os clientes conectados.
        // wss.clients e o conjunto de todas as conexoes ativas.
        wss.clients.forEach(function(cliente) {

            // Verifica se a conexao do cliente esta aberta antes de enviar.
            // WebSocket.OPEN e uma constante que representa o estado "conectado".
            if (cliente.readyState === WebSocket.OPEN) {
                cliente.send("Echo: " + mensagem)
            }
        })
    })

    // O evento "close" dispara quando o cliente se desconecta.
    ws.on("close", function() {
        console.log("Cliente desconectado")
    })
})

// ==================================================
// COMO TESTAR ESTE SERVIDOR
// ==================================================
//
// Opcao 1 - No navegador, abra o Console (F12) e cole:
//
//   const ws = new WebSocket("ws://localhost:8080")
//   ws.onmessage = (evento) => console.log(evento.data)
//   ws.send("ola servidor")
//
// Opcao 2 - Use a extensao "WebSocket King" ou "Thunder Client" no VS Code.
//   URL de conexao: ws://localhost:8080
//
// O que voce vai ver:
//   1. Ao conectar, recebe: "Bem-vindo ao servidor WebSocket!"
//   2. Ao enviar "ola servidor", recebe de volta: "Echo: ola servidor"
//   3. Se dois clientes estiverem conectados, ambos recebem o echo
