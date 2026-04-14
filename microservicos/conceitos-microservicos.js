// ==================================================
// CONCEITOS DE MICROSSERVICOS (material didatico executavel)
// ==================================================
//
// O que sao microsservicos?
// E um estilo de arquitetura onde o sistema e dividido em servicos menores,
// cada um com uma responsabilidade de negocio bem definida.
//
// Exemplo neste projeto:
// - usuarios-service: cuida de usuarios
// - pedidos-service: cuida de pedidos
// - api-gateway: porta unica de entrada para o cliente
//
// --------------------------------------------------
// MONOLITO x MICROSSERVICOS
// --------------------------------------------------
// Monolito:
// - tudo no mesmo processo
// - deploy unico
// - mais simples no inicio
// - mais dificil escalar partes isoladas
//
// Microsservicos:
// - servicos independentes
// - cada servico pode subir/parar sem derrubar todos
// - escalabilidade por dominio (ex: subir 3 instancias de pedidos)
// - exige mais disciplina de observabilidade e comunicacao entre servicos
//
// --------------------------------------------------
// COMUNICACAO ENTRE SERVICOS
// --------------------------------------------------
// Neste exemplo, a comunicacao e sincrona via HTTP:
// pedidos-service chama usuarios-service para validar usuarioId.
//
// Fluxo de criacao de pedido:
// 1. Cliente chama POST /pedidos no API Gateway
// 2. Gateway encaminha para pedidos-service
// 3. pedidos-service chama GET /usuarios/:id no usuarios-service
// 4. Se usuario existir, pedido e criado
// 5. Resposta volta para o cliente
//
// --------------------------------------------------
// PORTAS USADAS
// --------------------------------------------------
// api-gateway      -> 4000
// usuarios-service -> 4001
// pedidos-service  -> 4002
//
// Cliente deve falar apenas com a porta 4000.
// As portas 4001 e 4002 ficam internas para os servicos.
//
// --------------------------------------------------
// COMO RODAR
// --------------------------------------------------
// Terminal 1:
//   npm run micro:usuarios
//
// Terminal 2:
//   npm run micro:pedidos
//
// Terminal 3:
//   npm run micro:gateway
//
// --------------------------------------------------
// TESTES RAPIDOS (via curl)
// --------------------------------------------------
// Criar usuario:
// curl -X POST http://localhost:4000/usuarios -H "Content-Type: application/json" -d "{\"nome\":\"Ana\",\"email\":\"ana@email.com\",\"idade\":28}"
//
// Criar pedido para usuario 1:
// curl -X POST http://localhost:4000/pedidos -H "Content-Type: application/json" -d "{\"produto\":\"Notebook\",\"quantidade\":1,\"usuarioId\":1}"
//
// Tentar criar pedido com usuario inexistente (erro esperado):
// curl -X POST http://localhost:4000/pedidos -H "Content-Type: application/json" -d "{\"produto\":\"Mouse\",\"quantidade\":2,\"usuarioId\":999}"
//
// Ver dados agregados:
// curl http://localhost:4000/dados

console.log("Arquivo de conceitos carregado.")
console.log("Este arquivo e didatico. Consulte os comentarios para estudar a arquitetura.")
