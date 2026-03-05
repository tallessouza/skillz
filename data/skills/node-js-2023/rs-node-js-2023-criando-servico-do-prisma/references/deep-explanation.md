# Deep Explanation: Criando Servico do Prisma no NestJS

## Por que estender ao inves de compor?

O instrutor mostra duas abordagens e explica a evolucao:

**Abordagem 1 (composicao):** Criar uma propriedade `public client: PrismaClient` dentro do service e instanciar no construtor com `this.client = new PrismaClient()`. Funciona, mas toda vez que voce usa no controller precisa fazer `this.prisma.client.user.findMany()` — o `.client` intermediario e repetitivo e desnecessario.

**Abordagem 2 (heranca):** Como PrismaClient ja e uma classe, o service pode estende-la diretamente. O `super()` no construtor chama o construtor do PrismaClient, e tudo que voce passaria para `new PrismaClient({...})` vai no `super({...})`. Resultado: `this.prisma.user.findMany()` direto, sem intermediario.

O insight chave: "como esse prisma que ele esta estendendo PrismaClient, ele ja E o cliente em si, entao nao precisa mais do client."

## Inversao de dependencia no NestJS

O instrutor contrasta com outros frameworks: "Dentro de outros frameworks, o que a gente faria aqui e criar um arquivo prisma.ts e criar o Prisma Client." No NestJS, tudo que nao e controller vira service/provider. A conexao com banco de dados tambem e um servico.

O fluxo de DI:
1. Decore a classe com `@Injectable()`
2. Registre no array `providers` do modulo
3. Declare como parametro no construtor de quem precisa
4. O NestJS resolve automaticamente

## Lifecycle hooks: OnModuleInit e OnModuleDestroy

O instrutor explica o cenario real: "pode ser que o meu modulo seja destruido por algum erro que aconteceu na aplicacao, a aplicacao crashou." Quando isso acontece:

1. `OnModuleDestroy` e chamado → `$disconnect()` fecha a conexao com o banco
2. O auto-reload reinicia a aplicacao
3. `OnModuleInit` e chamado novamente → `$connect()` reestabelece a conexao

"E sempre legal implementar os dois quando eu estiver criando algum servico que ele conecta com um meio externo — um banco de dados, um Redis, qualquer coisa assim que precisa manter uma conexao ativa."

Isso e um padrao generalizado: qualquer servico que mantem conexao persistente com recurso externo deve implementar ambos os hooks.

## Opcoes de log no super()

O `super()` aceita todas as opcoes do PrismaClient. O instrutor demonstra com `log: ['query']` que printa as queries SQL no console — util para debug. Em producao, recomenda `log: ['warn', 'error']` para capturar apenas problemas.

## Nota sobre versoes recentes do Prisma

Versoes mais novas do Prisma configuram automaticamente um local de output onde o PrismaClient e gerado. Isso exige configuracao extra no `nest-cli.json` para que o NestJS copie os assets gerados para o diretorio de build.