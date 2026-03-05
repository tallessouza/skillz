# Deep Explanation: Listagem do Catalogo no Backend

## Por que dump SQL manual ao inves de migrations?

O instrutor escolhe deliberadamente gerenciar o banco "manualmente" com um `dump.sql`. A razao e simplicidade: em um projeto pratico/didatico, o overhead de configurar um sistema de migrations (TypeORM, Prisma, Knex) nao justifica o beneficio. O dump contem:

1. **Extensao pgVector** — habilitada logo no inicio porque o sistema vai precisar de busca por similaridade a nivel de banco
2. **DROP TABLE IF EXISTS** — permite re-executar o dump sem conflitos
3. **Seeds inline** — dados de teste (3 lojas, 36 produtos) ja no mesmo arquivo para nao depender de cadastro manual

## A decisao de precos como INTEGER

O instrutor explicitamente diz "vamos guardar aqui como integer os precos". Isso e uma pratica comum em sistemas financeiros: armazenar centavos como inteiros evita problemas de ponto flutuante que ocorrem com DECIMAL/FLOAT em operacoes aritmeticas.

## Por que separar PostgresService como servico compartilhado?

O instrutor cria o `PostgresService` em uma pasta `shared/` separada do modulo de catalogo. A razao: outros modulos (carrinho, checkout, etc.) tambem vao precisar acessar o banco. O servico e `@Injectable()` e registrado como provider no modulo que precisa dele.

## ConfigService vs process.env

O instrutor instala `@nestjs/config` e usa `configService.getOrThrow()` ao inves de `process.env` direto. Vantagens:
- **Fail fast**: se uma variavel nao existir, a aplicacao falha na inicializacao, nao em runtime
- **Tipagem**: ConfigService integra com o sistema de DI do NestJS
- **Centralizacao**: configurado uma vez no AppModule com `ConfigModule.forRoot({ isGlobal: true })`

Detalhe importante: o instrutor inicialmente instala `@nestjs/config` como dependencia de desenvolvimento por engano, depois corrige movendo para dependencias de producao.

## onApplicationBootstrap vs Constructor

O instrutor comeca fazendo a conexao no construtor, mas depois corrige: "ao inves de fazer no construtor, o nest disponibiliza uma interface `OnApplicationBootstrap`". Isso e importante porque:
- O construtor executa durante a resolucao de dependencias do NestJS
- `onApplicationBootstrap` executa depois que todas as dependencias foram resolvidas
- Permite tratamento de erro adequado sem bloquear a inicializacao do modulo

## Logger do NestJS vs console.log

O instrutor substitui `console.log` pelo `Logger` do NestJS com contexto:
```typescript
private readonly logger = new Logger(PostgresService.name)
```
Isso adiciona o nome da classe no log, facilitando identificar a origem em aplicacoes com multiplos servicos.

## Fluxo de desenvolvimento test-first

O instrutor segue um fluxo pragmatico:
1. Escreve o teste e2e primeiro (GET /catalog retorna 200 e 36 itens)
2. Roda o teste — falha (controller nao existe)
3. Cria controller retornando array vazio — falha (0 itens)
4. Cria service retornando item mockado — passa parcialmente
5. Vai conectando as camadas ate o teste passar

Esse approach permite validar o setup incrementalmente sem depender de ferramentas externas como Postman.

## Erro comum: esquecer de importar

O instrutor demonstra um erro muito comum no NestJS: criar o modulo de catalogo mas esquecer de:
1. Importar os controllers no decorador `@Module`
2. Importar o CatalogModule no AppModule
3. Chamar o metodo do service no controller (recebeu via DI mas nao chamou)

Cada um desses esquecimentos gera um tipo diferente de falha silenciosa ou erro.