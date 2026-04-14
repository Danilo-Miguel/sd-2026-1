// ==================================================
// CONSUMINDO APIs EXTERNAS
// ==================================================
//
// O QUE E UMA API?
// API (Application Programming Interface) e uma interface que permite
// que dois sistemas se comuniquem. Quando falamos em "consumir uma API",
// estamos falando em fazer requisicoes HTTP para um servidor externo
// e usar os dados que ele devolve.
//
// POR QUE CONSUMIR APIs?
// Porque nao precisamos reinventar a roda. Em vez de:
//   - Construir um banco de musicas do zero  --> usamos a API do Spotify
//   - Calcular rotas e mapas do zero         --> usamos a API do Google Maps
//   - Construir sistema de pagamento do zero --> usamos a API do Stripe
//
// E exatamente o que fazemos no monolito.js, mas ao contrario:
//   - No monolito.js: SOMOS o servidor, respondemos requisicoes
//   - Consumindo APIs: SOMOS o cliente, fazemos requisicoes para outros servidores
//
// ==================================================
// TIPOS DE AUTENTICACAO EM APIs
// ==================================================
//
// Nem toda API e aberta. Cada uma tem requisitos diferentes:
//
// 1. ABERTA (sem autenticacao)
//    Qualquer um pode usar sem se identificar.
//    Exemplo: API da Formula 1 (Jolpica), BrasilAPI, PokeAPI
//    Basta fazer GET para a URL e os dados chegam.
//
// 2. API KEY (chave de acesso)
//    A API exige que voce se cadastre e receba uma chave unica.
//    Essa chave e enviada junto com cada requisicao (no header ou na URL).
//    Exemplo: OpenWeatherMap, NewsAPI, Google Maps
//
//    Como funciona:
//      GET https://api.openweathermap.org/data/2.5/weather?q=Sao+Paulo&appid=SUACHAVE
//
//    Por que existe?
//      - Controlar quem usa a API
//      - Limitar o numero de requisicoes por usuario (rate limit)
//      - Cobrar pelo uso se necessario
//
// 3. OAUTH 2.0 (autorizacao delegada)
//    O mais complexo. Usado quando a API precisa agir em nome de um usuario.
//    Exemplo: Spotify, Google, GitHub, Facebook
//
//    Existem varios "fluxos" (flows) do OAuth. O mais simples para servidores e:
//
//    Client Credentials Flow (servidor para servidor, sem usuario):
//      Passo 1: voce envia seu CLIENT_ID e CLIENT_SECRET para o servidor de autenticacao
//      Passo 2: o servidor devolve um ACCESS TOKEN (uma string temporaria)
//      Passo 3: voce usa esse token em todas as requisicoes seguintes
//      Passo 4: quando o token expirar, voce pede um novo
//
//    O token e enviado no header da requisicao assim:
//      Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
//
// ==================================================
// O QUE E UM TOKEN? O QUE E "BEARER"?
// ==================================================
//
// Token e uma string gerada pelo servidor de autenticacao que prova
// que voce tem permissao para usar a API. E como um ingresso temporario.
//
// "Bearer" e o tipo do token. No header HTTP fica assim:
//   Authorization: Bearer <o_token_aqui>
// Isso informa ao servidor: "quem porta (bears) este token tem permissao".
//
// Tokens tem prazo de validade (ex: 1 hora no Spotify).
// Apos expirar, e necessario solicitar um novo.
//
// ==================================================
// O QUE E RATE LIMIT?
// ==================================================
//
// Rate limit e o limite de requisicoes que uma API permite em um periodo.
// Exemplo: "maximo de 1000 requisicoes por hora por chave de API".
//
// Se voce ultrapassar, a API retorna 429 Too Many Requests.
// APIs pagas geralmente tem limites maiores.
//
// ==================================================
// O QUE E fetch()?
// ==================================================
//
// fetch() e a funcao nativa do JavaScript (disponivel no navegador e no
// Node.js a partir da versao 18) para fazer requisicoes HTTP.
// Ela retorna uma Promise, por isso usamos await para esperar a resposta.
//
// Sem fetch, seria necessario usar o modulo "https" do Node ou instalar
// bibliotecas como axios ou node-fetch.
//
// Fluxo basico:
//   1. fetch(url)            --> faz a requisicao, retorna um objeto Response
//   2. response.json()       --> converte o body da resposta de JSON para objeto JS
//   3. usa os dados          --> acessa as propriedades do objeto
//
// ==================================================
// EXEMPLO PRATICO - BrasilAPI (aberta, sem autenticacao)
// ==================================================
//
// BrasilAPI e uma API brasileira gratuita com dados de CEP, bancos,
// feriados, CNPJ e muito mais. Nao precisa de cadastro nem de chave.
// Documentacao: https://brasilapi.com.br/docs

async function buscarCEP(cep) {

    console.log("Buscando CEP:", cep)

    // fetch() faz uma requisicao GET para a URL informada.
    // await pausa a execucao aqui ate a resposta chegar do servidor externo.
    // O resultado e um objeto Response com status, headers e body.
    const resposta = await fetch("https://brasilapi.com.br/api/cep/v1/" + cep)

    // resposta.ok e true se o status HTTP for entre 200 e 299.
    // Serve para verificar se a requisicao foi bem-sucedida antes de ler os dados.
    if (!resposta.ok) {
        console.log("CEP nao encontrado. Status:", resposta.status)
        return
    }

    // resposta.json() le o corpo da resposta e converte o texto JSON
    // para um objeto JavaScript. Tambem retorna uma Promise, por isso await.
    const dados = await resposta.json()

    // Neste ponto, "dados" e um objeto JS normal com as propriedades do CEP.
    console.log("Logradouro:", dados.street)
    console.log("Bairro    :", dados.neighborhood)
    console.log("Cidade    :", dados.city)
    console.log("Estado    :", dados.state)
}

// Chama a funcao com um CEP de exemplo (Avenida Paulista, Sao Paulo)
buscarCEP("01310100")

// ==================================================
// RESUMO: CHECKLIST ANTES DE USAR UMA API
// ==================================================
//
//   [ ] A API e gratuita? Tem plano free com limites?
//   [ ] Precisa de cadastro para obter chave ou credenciais?
//   [ ] Como a autenticacao funciona? API Key? OAuth?
//   [ ] Qual o rate limit? (requisicoes por hora/dia)
//   [ ] Tem documentacao clara dos endpoints e campos retornados?
//   [ ] Tem termos de uso? Posso usar os dados no meu projeto?
