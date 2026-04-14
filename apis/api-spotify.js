// ==================================================
// API DO SPOTIFY - Autenticacao OAuth 2.0
// ==================================================
//
// REQUISITOS ANTES DE RODAR ESTE ARQUIVO:
//
//   1. Acesse: https://developer.spotify.com/dashboard
//   2. Faca login com sua conta Spotify
//   3. Clique em "Create App"
//   4. Preencha nome e descricao (qualquer um)
//   5. Em "Redirect URIs", coloque: http://localhost:3000 (obrigatorio pelo form)
//   6. Salve e abra o app criado
//   7. Clique em "Settings" e copie o CLIENT_ID e CLIENT_SECRET
//   8. Cole os valores nas variaveis abaixo
//
// NENHUMA INSTALACAO EXTRA E NECESSARIA.
// Este arquivo usa o fetch nativo do Node.js (disponivel a partir do Node 18).

// Substitua pelos seus dados do Spotify Developer Dashboard.
const CLIENT_ID = "SEU_CLIENT_ID_AQUI"
const CLIENT_SECRET = "SEU_CLIENT_SECRET_AQUI"

// ==================================================
// PASSO 1: OBTER O TOKEN DE ACESSO
// ==================================================
//
// O Spotify usa o fluxo "Client Credentials" do OAuth 2.0.
// Neste fluxo, enviamos nossas credenciais para o servidor de autenticacao
// do Spotify e ele nos devolve um token temporario.
//
// O token e valido por 3600 segundos (1 hora).
// Apos expirar, e necessario solicitar um novo com esta mesma funcao.

async function obterToken() {

    // btoa() converte uma string para Base64.
    // O Spotify exige que CLIENT_ID e CLIENT_SECRET sejam combinados
    // no formato "id:secret" e codificados em Base64 para o header.
    // Isso e um requisito do protocolo OAuth 2.0 para este fluxo.
    const credenciais = btoa(CLIENT_ID + ":" + CLIENT_SECRET)

    // Requisicao POST para o endpoint de autenticacao do Spotify.
    const resposta = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",

        headers: {
            // "Basic" indica que estamos usando autenticacao basica HTTP.
            // As credenciais em Base64 ficam logo apos a palavra "Basic ".
            "Authorization": "Basic " + credenciais,

            // O body desta requisicao nao e JSON, e URL-encoded.
            // Formato: chave=valor&chave=valor (igual parametros de URL)
            "Content-Type": "application/x-www-form-urlencoded"
        },

        // grant_type informa ao Spotify qual fluxo OAuth estamos usando.
        // "client_credentials" significa: "estou me autenticando como aplicacao,
        // nao como um usuario especifico".
        body: "grant_type=client_credentials"
    })

    if (!resposta.ok) {
        console.log("Erro ao obter token. Verifique CLIENT_ID e CLIENT_SECRET.")
        console.log("Status:", resposta.status)
        return null
    }

    // Converte a resposta JSON para objeto JavaScript.
    const dados = await resposta.json()

    // dados.access_token e a string que usaremos em todas as proximas requisicoes.
    // dados.expires_in informa quantos segundos o token e valido (3600 = 1 hora).
    console.log("Token obtido! Expira em", dados.expires_in, "segundos.")

    return dados.access_token
}

// ==================================================
// PASSO 2: BUSCAR ARTISTA
// ==================================================
//
// Com o token em maos, podemos fazer qualquer requisicao a API do Spotify.
// O token e enviado no header Authorization como "Bearer <token>".
// "Bearer" indica que quem porta (carrega) este token tem permissao de acesso.

async function buscarArtista(token, nomeArtista) {

    // Codifica o nome do artista para uso seguro na URL.
    // encodeURIComponent substitui espacos e caracteres especiais.
    // Ex: "Linkin Park" vira "Linkin%20Park" para nao quebrar a URL.
    const nomeCodificado = encodeURIComponent(nomeArtista)

    // Monta a URL com os parametros de busca:
    // q     = termo de busca
    // type  = tipo de resultado (artist, track, album...)
    // limit = maximo de resultados retornados
    const url = "https://api.spotify.com/v1/search?q=" + nomeCodificado + "&type=artist&limit=3"

    const resposta = await fetch(url, {
        headers: {
            // Todas as requisicoes a API do Spotify precisam deste header.
            // O formato e sempre: "Bearer " + o token recebido no passo anterior.
            "Authorization": "Bearer " + token
        }
    })

    if (!resposta.ok) {
        console.log("Erro na busca. Status:", resposta.status)
        return
    }

    const dados = await resposta.json()

    // A resposta do Spotify para busca de artistas segue esta estrutura:
    // dados.artists.items = array com os artistas encontrados
    // Cada artista tem: name, followers, genres, popularity, external_urls
    const artistas = dados.artists.items

    if (artistas.length === 0) {
        console.log("Nenhum artista encontrado para:", nomeArtista)
        return
    }

    console.log("\n--- Resultados para: " + nomeArtista + " ---")

    artistas.forEach(function(artista) {
        console.log("Nome       :", artista.name)
        console.log("Seguidores :", artista.followers.total.toLocaleString("pt-BR"))
        console.log("Generos    :", artista.genres.join(", ") || "nao informado")
        console.log("Popularidade:", artista.popularity + "/100")
        console.log("Spotify    :", artista.external_urls.spotify)
        console.log("---")
    })
}

// ==================================================
// PASSO 3: BUSCAR MUSICAS DE UM ARTISTA
// ==================================================

async function buscarMusicas(token, nomeArtista) {

    const nomeCodificado = encodeURIComponent(nomeArtista)

    // type=track busca por faixas (musicas)
    const url = "https://api.spotify.com/v1/search?q=" + nomeCodificado + "&type=track&limit=5"

    const resposta = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    const dados = await resposta.json()
    const faixas = dados.tracks.items

    console.log("\n--- Musicas encontradas para: " + nomeArtista + " ---")

    faixas.forEach(function(faixa) {
        console.log("Musica :", faixa.name)
        console.log("Artista:", faixa.artists[0].name)
        console.log("Album  :", faixa.album.name)
        console.log("Link   :", faixa.external_urls.spotify)
        console.log("---")
    })
}

// ==================================================
// EXECUCAO PRINCIPAL
// ==================================================
//
// async/await nao funciona no nivel principal de um arquivo .js comum.
// Para contornar isso, envolvemos tudo em uma funcao anonima async e
// a chamamos imediatamente. Esse padrao e chamado IIFE (Immediately Invoked
// Function Expression) async.

async function main() {
    console.log("=== SPOTIFY API ===\n")

    // Passo 1: autentica e obtem o token
    const token = await obterToken()

    // Se nao conseguiu o token, encerra
    if (!token) {
        return
    }

    // Passo 2 e 3: usa o token para buscar dados
    await buscarArtista(token, "Linkin Park")
    await buscarMusicas(token, "Eminem")
}

main()
