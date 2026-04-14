'// ==================================================
// API DA FORMULA 1 - Jolpica F1 API (gratuita, sem autenticacao)
// ==================================================
//
// O QUE E A JOLPICA F1 API?
// E a substituta oficial da Ergast API (que foi descontinuada em 2024).
// Fornece dados historicos e atuais da Formula 1:
// pilotos, construtores, corridas, resultados, voltas, pit stops e mais.
//
// REQUISITOS:
//   Nenhum! Nao precisa de cadastro, API key nem autenticacao.
//   Basta fazer GET para as URLs e os dados chegam.
//
// DOCUMENTACAO: https://jolpi.ca/ergast/
// BASE URL: https://api.jolpi.ca/ergast/f1/
//
// NENHUMA INSTALACAO EXTRA E NECESSARIA.
// Este arquivo usa o fetch nativo do Node.js (disponivel a partir do Node 18).

// ==================================================
// FUNCAO AUXILIAR - Busca generica
// ==================================================
//
// Criamos uma funcao reutilizavel para nao repetir o codigo de fetch
// em cada consulta. Recebe a URL e retorna os dados ja convertidos.

async function buscar(url) {

    console.log("Consultando:", url)

    // fetch() faz a requisicao HTTP GET para a URL informada.
    // await pausa a execucao ate a resposta chegar.
    const resposta = await fetch(url)

    // resposta.ok e true se o status for 200-299.
    if (!resposta.ok) {
        console.log("Erro na requisicao. Status:", resposta.status)
        return null
    }

    // resposta.json() converte o corpo da resposta (texto JSON) para objeto JS.
    const dados = await resposta.json()

    // A Jolpica API envolve tudo em uma estrutura padrao:
    // dados.MRData contem os dados reais.
    // MRData = Motor Racing Data (heranca do nome da Ergast API original)
    return dados.MRData
}

// ==================================================
// 1. CALENDARIO - Corridas da temporada
// ==================================================

async function verCalendario(ano) {

    // URL padrao da API: /f1/{ano}.json
    // Retorna todas as corridas da temporada escolhida.
    const dados = await buscar("https://api.jolpi.ca/ergast/f1/" + ano + ".json")

    if (!dados) return

    // dados.RaceTable.Races e o array com as corridas da temporada.
    const corridas = dados.RaceTable.Races

    console.log("\n=== CALENDARIO F1 " + ano + " ===")
    console.log("Total de corridas:", corridas.length)

    corridas.forEach(function(corrida) {
        console.log(
            "Round " + corrida.round +
            " | " + corrida.date +
            " | " + corrida.raceName +
            " | " + corrida.Circuit.circuitName +
            " (" + corrida.Circuit.Location.country + ")"
        )
    })
}

// ==================================================
// 2. PILOTOS - Lista de pilotos de uma temporada
// ==================================================

async function verPilotos(ano) {

    // URL: /f1/{ano}/drivers.json
    // Retorna todos os pilotos que participaram daquela temporada.
    const dados = await buscar("https://api.jolpi.ca/ergast/f1/" + ano + "/drivers.json")

    if (!dados) return

    const pilotos = dados.DriverStandingsTable ?
        dados.DriverStandingsTable.DriverStandings :
        dados.DriverTable.Drivers

    console.log("\n=== PILOTOS DA TEMPORADA " + ano + " ===")
    console.log("Total:", pilotos.length)

    pilotos.forEach(function(piloto) {
        console.log(
            piloto.permanentNumber + " | " +
            piloto.givenName + " " + piloto.familyName +
            " (" + piloto.nationality + ")"
        )
    })
}

// ==================================================
// 3. RESULTADO DE UMA CORRIDA ESPECIFICA
// ==================================================

async function verResultadoCorrida(ano, round) {

    // URL: /f1/{ano}/{round}/results.json
    // {round} e o numero da corrida dentro da temporada (1, 2, 3...)
    const dados = await buscar(
        "https://api.jolpi.ca/ergast/f1/" + ano + "/" + round + "/results.json"
    )

    if (!dados) return

    const corrida = dados.RaceTable.Races[0]

    if (!corrida) {
        console.log("Corrida nao encontrada.")
        return
    }

    console.log("\n=== RESULTADO: " + corrida.raceName + " " + ano + " ===")
    console.log("Circuito:", corrida.Circuit.circuitName)
    console.log("Data    :", corrida.date)
    console.log("\nTop 10:")

    corrida.Results.forEach(function(resultado) {
        const piloto = resultado.Driver.givenName + " " + resultado.Driver.familyName
        const equipe = resultado.Constructor.name
        const tempo  = resultado.Time ? resultado.Time.time : resultado.status

        console.log(
            resultado.position + "° | " +
            piloto +
            " (" + equipe + ")" +
            " | " + tempo
        )
    })
}

// ==================================================
// 4. CLASSIFICACAO DO CAMPEONATO DE PILOTOS
// ==================================================

async function verClassificacaoPilotos(ano) {

    // URL: /f1/{ano}/driverStandings.json
    // Retorna a classificacao final (ou atual) do campeonato de pilotos.
    const dados = await buscar(
        "https://api.jolpi.ca/ergast/f1/" + ano + "/driverStandings.json"
    )

    if (!dados) return

    // A resposta vem em StandingsTable > StandingsLists > array
    // StandingsLists[0] contem a ultima atualizacao disponivel.
    const lista = dados.StandingsTable.StandingsLists

    if (!lista || lista.length === 0) {
        console.log("Classificacao nao disponivel ainda para", ano)
        return
    }

    const classificacao = lista[0].DriverStandings

    console.log("\n=== CAMPEONATO DE PILOTOS " + ano + " ===")

    classificacao.forEach(function(item) {
        const piloto = item.Driver.givenName + " " + item.Driver.familyName
        const equipe = item.Constructors[0].name

        console.log(
            item.position + "° | " +
            piloto +
            " (" + equipe + ")" +
            " | " + item.points + " pts"
        )
    })
}

// ==================================================
// EXECUCAO - Escolha o que quer ver
// ==================================================

async function main() {
    console.log("=== FORMULA 1 API ===\n")

    // Ver o calendario de 2024
    await verCalendario("2024")

    // Ver resultado da corrida 1 de 2024 (Bahrain)
    await verResultadoCorrida("2024", "1")

    // Ver classificacao final do campeonato de 2024
    await verClassificacaoPilotos("2024")

    // Para ver outras temporadas, troque o ano:
    // await verCalendario("2023")
    // await verResultadoCorrida("2023", "5")
    // await verClassificacaoPilotos("2023")
}

main()
