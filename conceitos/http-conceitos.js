// ==================================================
// # HTTP - HyperText Transfer Protocol
// ==================================================
//
// ## Definicao
// HTTP e o protocolo de comunicacao usado na web.
// Toda vez que um navegador ou aplicativo se comunica com um servidor,
// ele usa HTTP para enviar uma REQUISICAO e o servidor devolve uma RESPOSTA.
//
// Modelo basico:
//
//   Cliente (front-end / app)  -->  [REQUISICAO]  -->  Servidor
//   Cliente (front-end / app)  <--  [RESPOSTA]    <--  Servidor
//
// Uma requisicao HTTP tem:
//   - Metodo   : o tipo de operacao (GET, POST, PUT...)
//   - URL      : o endereco do recurso (/usuarios, /pedidos/1...)
//   - Headers  : informacoes extras (tipo do conteudo, autenticacao...)
//   - Body     : dados enviados ao servidor (nem todos os metodos possuem)

const express = require("express")
const app = express()
app.use(express.json())

// ==================================================
// 1. METODOS HTTP
// ==================================================
//
// Os metodos HTTP definem a INTENCAO da requisicao.
// Cada um tem uma semantica propria e indica que tipo de operacao
// deve ser realizada sobre o recurso.

let produtos = [
    { id: 1, nome: "Teclado", preco: 150 },
    { id: 2, nome: "Mouse", preco: 80 },
]


// --------------------------------------------------
// GET - Buscar / Ler dados
// --------------------------------------------------
// Usado para CONSULTAR um recurso sem modificar nada no servidor.
// Pode retornar uma lista ou um item especifico.
// Nao possui body na requisicao.

// GET - retorna todos os produtos
app.get("/produtos", (req, res) => {
    // 200 OK: a requisicao foi bem-sucedida e retornou dados
    res.status(200).json(produtos)
})

// GET - retorna um produto por ID
app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        // 404 Not Found: o recurso solicitado nao foi encontrado
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    res.status(200).json(produto)
})


// --------------------------------------------------
// POST - Criar um novo recurso
// --------------------------------------------------
// Usado para ENVIAR dados ao servidor e criar um novo registro.
// O body da requisicao contem os dados do novo recurso.
// Retorna normalmente 201 Created.

app.post("/produtos", (req, res) => {
    const novoProduto = req.body

    // Valida se os dados necessarios foram enviados
    if (!novoProduto.nome || !novoProduto.preco) {
        // 400 Bad Request: a requisicao esta incompleta ou com dados invalidos
        return res.status(400).json({ erro: "Nome e preco sao obrigatorios" })
    }

    novoProduto.id = produtos.length + 1
    produtos.push(novoProduto)

    // 201 Created: recurso criado com sucesso
    res.status(201).json({ message: "Produto criado", produto: novoProduto })
})


// --------------------------------------------------
// PUT - Substituir / Atualizar completamente
// --------------------------------------------------
// Usado para ATUALIZAR um recurso existente por completo.
// O body deve conter todos os campos do recurso, mesmo os que nao mudaram.
// Se o recurso nao existir, alguns servidores criam um novo (upsert).

app.put("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        // 404 Not Found: nao ha produto com esse ID para substituir
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    // Substitui o produto inteiro pelo body recebido, mantendo o ID
    produtos[index] = { ...req.body, id }

    // 200 OK: atualizacao realizada com sucesso
    res.status(200).json({ message: "Produto atualizado completamente", produto: produtos[index] })
})


// --------------------------------------------------
// PATCH - Atualizar parcialmente
// --------------------------------------------------
// Usado para MODIFICAR apenas alguns campos de um recurso.
// Diferente do PUT, nao exige que todos os campos sejam enviados.
// Ideal para atualizacoes pequenas (mudar apenas o preco, por exemplo).

app.patch("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    // Mescla os dados existentes com os campos enviados no body
    produtos[index] = { ...produtos[index], ...req.body }

    // 200 OK: atualizacao parcial realizada com sucesso
    res.status(200).json({ message: "Produto atualizado parcialmente", produto: produtos[index] })
})


// --------------------------------------------------
// DELETE - Remover um recurso
// --------------------------------------------------
// Usado para EXCLUIR um recurso do servidor.
// Normalmente retorna 200 com confirmacao ou 204 sem body.

app.delete("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    const removido = produtos.splice(index, 1)

    // 200 OK com mensagem de confirmacao
    res.status(200).json({ message: "Produto removido", produto: removido[0] })

    // Alternativa: 204 No Content (sem body na resposta)
    // res.status(204).send()
})


// ==================================================
// 2. CODIGOS DE STATUS HTTP
// ==================================================
//
// O codigo de status e um numero de 3 digitos que o servidor envia na resposta.
// Ele indica se a operacao foi bem-sucedida ou qual problema ocorreu.
// Sao agrupados em familias pelo primeiro digito:
//
//   1xx - Informacional  : requisicao recebida, processando
//   2xx - Sucesso        : operacao realizada com exito
//   3xx - Redirecionamento: o recurso mudou de endereco
//   4xx - Erro do cliente : o cliente enviou algo errado
//   5xx - Erro do servidor: o problema esta no servidor

// Rota apenas para demonstrar os status codes mais comuns
app.get("/status-demo/:codigo", (req, res) => {
    const codigo = parseInt(req.params.codigo)

    const explicacoes = {
        // --- 2xx Sucesso ---
        200: "200 OK - A requisicao foi bem-sucedida. Usado na maioria dos GETs e DELETEs.",
        201: "201 Created - Recurso criado com sucesso. Usado apos um POST bem-sucedido.",
        204: "204 No Content - Sucesso, mas sem nada para retornar. Comum em DELETE.",

        // --- 3xx Redirecionamento ---
        301: "301 Moved Permanently - O recurso foi movido para outra URL de forma permanente.",
        302: "302 Found - Redirecionamento temporario para outra URL.",

        // --- 4xx Erro do cliente ---
        400: "400 Bad Request - Requisicao invalida ou com dados incorretos.",
        401: "401 Unauthorized - O cliente nao esta autenticado (precisa fazer login).",
        403: "403 Forbidden - Autenticado, mas sem permissao para acessar o recurso.",
        404: "404 Not Found - O recurso solicitado nao existe no servidor.",
        405: "405 Method Not Allowed - O metodo HTTP nao e permitido para essa rota.",
        409: "409 Conflict - Conflito de dados (ex: email duplicado no cadastro).",
        422: "422 Unprocessable Entity - Dados enviados sao invalidos semanticamente.",

        // --- 5xx Erro do servidor ---
        500: "500 Internal Server Error - Erro generico no servidor. Algo inesperado aconteceu.",
        502: "502 Bad Gateway - O servidor recebeu uma resposta invalida de outro servidor.",
        503: "503 Service Unavailable - Servidor fora do ar ou sobrecarregado.",
    }

    const mensagem = explicacoes[codigo]

    if (!mensagem) {
        return res.status(400).json({ erro: "Codigo de status nao mapeado neste exemplo" })
    }

    res.status(codigo === 204 ? 200 : codigo).json({ status: codigo, explicacao: mensagem })
})


// ==================================================
// 3. RESUMO RAPIDO - METODOS x OPERACOES CRUD
// ==================================================
//
//   Metodo  | Operacao CRUD | Exemplo de uso
//   --------|---------------|----------------------------------
//   GET     | Read          | Buscar usuario, listar produtos
//   POST    | Create        | Cadastrar novo usuario, criar pedido
//   PUT     | Update total  | Substituir todos os dados de um produto
//   PATCH   | Update parcial| Atualizar so o preco de um produto
//   DELETE  | Delete        | Remover um registro pelo ID

app.listen(3001, () => console.log("Servidor de conceitos HTTP rodando na porta 3001"))
