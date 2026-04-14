// ==================================================
// MONOLITO - Servidor HTTP com Express
// ==================================================
//
// O que e um monolito?
// E uma aplicacao onde TUDO fica em um unico lugar:
// as rotas, as regras de negocio, os dados.
// Diferente de microsservicos, onde cada funcionalidade
// seria um servidor separado.
//
// O que e o Express?
// Express e uma biblioteca (framework) para Node.js que facilita
// a criacao de servidores HTTP. Sem ele, seria necessario usar o
// modulo nativo "http" do Node, muito mais verboso.
// Para instalar: npm install express
//
// O que e uma rota?
// E o endereco que o servidor "escuta". Quando o cliente (navegador,
// Postman, outro servidor...) faz uma requisicao para esse endereco,
// o servidor executa a funcao associada e devolve uma resposta.

// --------------------------------------------------
// IMPORTACAO E CONFIGURACAO
// --------------------------------------------------

// Importa o modulo express instalado via npm.
// require() e o sistema de modulos do Node.js (equivale ao import).
const express = require("express");

// Cria a instancia do servidor Express.
// "app" e o objeto principal que usaremos para registrar rotas e middleware.
const app = express();

// Middleware: funcao que roda ANTES de chegar na rota.
// express.json() instrui o servidor a interpretar o corpo (body) das
// requisicoes no formato JSON automaticamente.
// Sem isso, req.body seria undefined em POST, PUT e PATCH.
app.use(express.json());

// --------------------------------------------------
// BANCO DE DADOS SIMULADO (em memoria)
// --------------------------------------------------

// Como nao temos banco de dados aqui, usamos arrays simples.
// ATENCAO: esses dados somem quando o servidor e reiniciado.
let usuarios = []; // lista de usuarios cadastrados
let pedidos = [];  // lista de pedidos criados

// ==================================================
// ROTAS DE USUARIOS
// ==================================================

// --------------------------------------------------
// POST /usuarios - Criar um novo usuario
// --------------------------------------------------
// Metodo POST: envia dados no BODY da requisicao para criar um recurso.
// URL: http://localhost:3000/usuarios
// Body esperado (JSON): { "nome": "Ana", "email": "ana@email.com" }
app.post("/usuarios", (req, res) => {

    // req.body contem o JSON enviado pelo cliente no corpo da requisicao.
    // Ex: { "nome": "Ana", "email": "ana@email.com" }
    const usuario = req.body;

    // Gera um ID automatico baseado na quantidade atual de usuarios.
    // usuarios.length retorna o numero de elementos no array.
    // Se ha 0 usuarios, o primeiro recebe id = 1. Se ha 1, o proximo recebe id = 2.
    usuario.id = usuarios.length + 1;

    // Adiciona o usuario ao array (nosso banco de dados em memoria).
    usuarios.push(usuario);

    // res.status(201) define o codigo de status HTTP da resposta.
    // 201 Created: significa que um recurso foi criado com sucesso.
    // .json() serializa o objeto JavaScript para JSON e envia como resposta.
    res.status(201).json({ message: "Usuário criado com sucesso", usuario });
});

// --------------------------------------------------
// GET /usuarios - Listar todos os usuarios
// --------------------------------------------------
// Metodo GET: busca dados sem alterar nada no servidor.
// URL: http://localhost:3000/usuarios
// Sem body. Retorna o array completo de usuarios.
app.get("/usuarios", (req, res) => {

    // 200 OK: requisicao bem-sucedida.
    // Retorna o array inteiro de usuarios em formato JSON.
    res.status(200).json(usuarios);
});

// --------------------------------------------------
// GET /usuarios/:id - Buscar um usuario especifico
// --------------------------------------------------
// O :id na URL e um parametro dinamico.
// Exemplos de URL: http://localhost:3000/usuarios/1
//                  http://localhost:3000/usuarios/2
app.get("/usuarios/:id", (req, res) => {

    // req.params contem os parametros dinamicos da URL.
    // req.params.id extrai o valor do :id da URL (ex: "1", "2").
    // parseInt() converte de string para numero inteiro,
    // pois os IDs guardados no array sao numeros.
    const id = parseInt(req.params.id);

    // Array.find() percorre o array e retorna o PRIMEIRO elemento
    // cuja condicao seja verdadeira. Se nenhum for encontrado, retorna undefined.
    // Aqui buscamos o usuario cujo id seja igual ao id da URL.
    const usuario = usuarios.find(u => u.id === id);

    // Se usuario for undefined (nao encontrado), retorna erro 404.
    // "return" encerra a funcao aqui para nao executar o codigo abaixo.
    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // 200 OK: usuario encontrado, retorna seus dados.
    res.status(200).json(usuario);
});

// --------------------------------------------------
// PUT /usuarios/:id - Substituir completamente um usuario
// --------------------------------------------------
// Metodo PUT: substitui o recurso INTEIRO pelo que vem no body.
// Todos os campos devem ser enviados, mesmo os que nao mudaram.
// URL: http://localhost:3000/usuarios/1
// Body esperado: { "nome": "Ana Silva", "email": "ana.silva@email.com" }
app.put("/usuarios/:id", (req, res) => {

    // Extrai e converte o ID da URL para numero.
    const id = parseInt(req.params.id);

    // Array.findIndex() percorre o array e retorna o INDICE (posicao)
    // do primeiro elemento que satisfaz a condicao.
    // Diferente do find(), que retorna o elemento em si, findIndex()
    // retorna a POSICAO no array (0, 1, 2...).
    // Se nao encontrar, retorna -1.
    const index = usuarios.findIndex(u => u.id === id);

    // Se index for -1, o usuario nao existe.
    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Substitui o elemento na posicao "index" do array.
    // O spread operator { ...req.body, id } copia todos os campos do body
    // e garante que o ID original seja mantido (nao pode ser alterado pelo cliente).
    // Ex: se req.body = { nome: "Ana Silva", email: "nova@email.com" }
    //     resultado  = { nome: "Ana Silva", email: "nova@email.com", id: 1 }
    usuarios[index] = { ...req.body, id };

    // 200 OK: substituicao realizada com sucesso.
    res.status(200).json({ message: "Usuário atualizado completamente", usuario: usuarios[index] });
});

// --------------------------------------------------
// PATCH /usuarios/:id - Atualizar parcialmente um usuario
// --------------------------------------------------
// Metodo PATCH: atualiza APENAS os campos enviados no body.
// Campos nao enviados permanecem com o valor original.
// URL: http://localhost:3000/usuarios/1
// Body (so o que muda): { "email": "novo@email.com" }
app.patch("/usuarios/:id", (req, res) => {

    // Extrai e converte o ID da URL.
    const id = parseInt(req.params.id);

    // Busca a posicao do usuario no array pelo ID.
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Mescla o objeto existente com os novos campos recebidos.
    // O spread operator funciona assim:
    //   { ...usuarios[index] } copia todos os campos atuais do usuario.
    //   { ...req.body }        sobrescreve APENAS os campos que vieram no body.
    // Campos que nao vieram no body continuam com o valor original.
    //
    // Exemplo:
    //   usuarios[index] antes = { id: 1, nome: "Ana", email: "ana@email.com" }
    //   req.body               = { email: "nova@email.com" }
    //   resultado              = { id: 1, nome: "Ana", email: "nova@email.com" }
    usuarios[index] = { ...usuarios[index], ...req.body };

    // 200 OK: atualizacao parcial realizada.
    res.status(200).json({ message: "Usuário atualizado parcialmente", usuario: usuarios[index] });
});

// --------------------------------------------------
// DELETE /usuarios/:id - Remover um usuario
// --------------------------------------------------
// Metodo DELETE: exclui o recurso identificado pelo ID da URL.
// URL: http://localhost:3000/usuarios/1
// Sem body.
app.delete("/usuarios/:id", (req, res) => {

    // Extrai e converte o ID da URL.
    const id = parseInt(req.params.id);

    // Busca a posicao do usuario no array.
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Array.splice(inicio, quantidade) remove elementos do array.
    // splice(index, 1) remove 1 elemento na posicao "index".
    // Retorna um array com os elementos removidos, por isso [0] pega o primeiro.
    const removido = usuarios.splice(index, 1);

    // 200 OK com confirmacao e dados do usuario removido.
    res.status(200).json({ message: "Usuário removido", usuario: removido[0] });
});

// ==================================================
// ROTAS DE PEDIDOS
// ==================================================

// --------------------------------------------------
// POST /pedidos - Criar um novo pedido
// --------------------------------------------------
// URL: http://localhost:3000/pedidos
// Body esperado: { "produto": "Notebook", "quantidade": 1, "usuarioId": 1 }
app.post("/pedidos", (req, res) => {

    // Captura os dados enviados no body da requisicao.
    const pedido = req.body;

    // Gera ID automatico para o pedido.
    pedido.id = pedidos.length + 1;

    // Adiciona o pedido ao array em memoria.
    pedidos.push(pedido);

    // 201 Created: pedido criado com sucesso.
    res.status(201).json({ message: "Pedido criado com sucesso", pedido });
});

// --------------------------------------------------
// GET /pedidos - Listar todos os pedidos
// --------------------------------------------------
// URL: http://localhost:3000/pedidos
app.get("/pedidos", (req, res) => {
    res.status(200).json(pedidos);
});

// ==================================================
// ROTA GERAL
// ==================================================

// --------------------------------------------------
// GET /dados - Retorna todos os recursos do servidor de uma vez
// --------------------------------------------------
// Util para inspecionar o estado atual do servidor durante testes.
// URL: http://localhost:3000/dados
app.get("/dados", (req, res) => {

    // Retorna um objeto com os dois arrays: usuarios e pedidos.
    // A sintaxe { usuarios, pedidos } e um atalho para
    // { usuarios: usuarios, pedidos: pedidos }
    res.status(200).json({ usuarios, pedidos });
});

// --------------------------------------------------
// INICIALIZACAO DO SERVIDOR
// --------------------------------------------------

// app.listen(porta, callback) coloca o servidor para "escutar"
// requisicoes na porta informada.
// Porta 3000 e convencao em desenvolvimento local.
// Acesso: http://localhost:3000
app.listen(3000, () => console.log("Servidor rodando na porta 3000"))