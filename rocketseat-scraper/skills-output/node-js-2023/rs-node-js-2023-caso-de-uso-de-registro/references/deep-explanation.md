# Deep Explanation: Use Case Pattern — Caso de Uso de Registro

## Por que separar? A analogia do meio de transporte

O instrutor (Diego, Rocketseat) repete varias vezes um conceito central: **a funcionalidade de criacao de usuario hoje e chamada por uma rota HTTP, mas amanha pode nao ser.** Pode ser:

- Uma integracao com outro sistema
- Um sistema de mensageria (RabbitMQ, Kafka)
- Um job/cron
- Uma CLI
- Um teste automatizado

Se a logica de negocio esta dentro do controller Fastify, ela so funciona quando chamada via HTTP. Isso e **acoplamento ao meio de transporte**.

## O que vai para o Use Case vs. o que fica no Controller

### Use Case (agnostico):
- Hashear senha
- Verificar se email ja existe
- Criar usuario no banco
- Lancar erro se regra de negocio violada

### Controller (especifico HTTP):
- Parsear/validar body da requisicao
- Chamar o use case
- Traduzir erros em codigos HTTP (409, 400, 500)
- Retornar resposta HTTP

## O problema do `reply` dentro do Use Case

O instrutor enfatiza: **"nao faca isso, pelo amor de Deus"** — passar `reply` (Fastify) ou `res` (Express) para dentro do use case. Motivos:

1. `reply` so existe no contexto HTTP
2. Se amanha o use case for chamado por um worker, nao existe `reply`
3. Acopla a logica de negocio ao framework
4. Impossibilita testar o use case isoladamente

## Throw como mecanismo de comunicacao de erro

Em vez de `reply.status(409).send()`, o use case faz `throw new Error('E-mail already exists.')`. O controller captura com try/catch e decide qual codigo HTTP retornar.

O instrutor reconhece que essa abordagem inicial tem limitacoes: "mais pra frente eu posso ter outros erros que eu quero que o codigo seja diferente". Isso sera resolvido com **error classes customizadas** em aulas futuras — mas o principio de throw no use case permanece.

## Nomenclatura: Services vs. Use Cases

O instrutor menciona que os nomes mais comuns sao:
- `services/` — mais generico, muito usado na comunidade
- `use-cases/` — preferencia dele, mais explicito sobre o proposito

Ambos sao validos. O importante e a separacao, nao o nome da pasta.

## Evolucao progressiva

Esta aula e um passo intermediario. O codigo ainda tem problemas que serao resolvidos:
- Prisma esta hardcoded dentro do use case (sera resolvido com Repository Pattern + Dependency Injection)
- Erros sao `new Error()` genericos (serao resolvidos com error classes customizadas)
- Use case e uma funcao (sera convertido em classe para facilitar DI)

Mas o principio central — **separar logica de negocio do adaptador HTTP** — e permanente.