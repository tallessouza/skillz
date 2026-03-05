# Deep Explanation: Caso de Uso de Busca de Academias

## Por que `query` e nao `title`

O instrutor explica explicitamente: "eu nao gosto de botar title, por exemplo, ah, eu quero buscar pelo titulo, porque mais pra frente pode ser que a gente queira buscar por mais informacoes, queira buscar no titulo ou na descricao, so que e a mesma informacao, entao query pode ser usado depois para buscar tanto no titulo quanto na descricao."

Esse raciocinio segue o principio de **interface estavel**: o contrato publico do use case (query + page) nao precisa mudar quando a implementacao interna evolui. Hoje o repositorio filtra por `title.includes(query)`, amanha pode fazer full-text search em titulo + descricao, e o use case permanece identico.

## Por que `searchMany` sem sufixo

Mesmo raciocinio aplicado ao nome do metodo do repositorio: "eu deixei so SearchMany, porque, novamente, nao vou botar ByTitle, porque pode ser que mais pra frente seja nao so por titulo, seja por outras informacoes."

O nome do metodo na interface do repositorio e um contrato. Se voce nomeia `searchManyByTitle`, quando precisar buscar por descricao tambem, tera que renomear o metodo e quebrar todos os consumidores.

## Paginacao com slice

O padrao de paginacao usado no projeto e consistente: `slice((page - 1) * 20, page * 20)`. Isso significa:
- Pagina 1: itens 0-19
- Pagina 2: itens 20-39
- Pagina 3: itens 40-59

O numero 20 e o tamanho de pagina padrao do projeto. No repositorio in-memory, o `filter` faz a busca e o `slice` faz a paginacao — simulando o que seria um `LIMIT/OFFSET` ou `take/skip` no banco real.

## Estrategia de testes

O instrutor usa dois testes complementares:

### Teste 1: Busca basica
Cria duas academias com titulos diferentes ("JavaScript Gym" e "TypeScript Gym"), busca por "JavaScript", e verifica que retorna apenas uma com o titulo correto. Valida que o filtro funciona.

### Teste 2: Paginacao
Cria 22 academias com titulo "JavaScript Gym {i}", busca pagina 2, e verifica que retorna exatamente 2 itens (os itens 21 e 22). Valida que a paginacao funciona.

O instrutor reutilizou a estrutura de teste do check-in history porque "a parte da paginacao e muito parecida" — demonstrando reuso de padroes de teste entre funcionalidades similares.

## Padrao de reuso entre use cases

O instrutor comecou copiando o `CreateGymUseCase` como base porque "ele vai ter uma semelhanca, porque ele usa ja o repositorio". Isso mostra o padrao do projeto: use cases de um mesmo dominio compartilham a mesma dependencia de repositorio e tem estrutura similar (request interface, response interface, constructor com DI, metodo execute).