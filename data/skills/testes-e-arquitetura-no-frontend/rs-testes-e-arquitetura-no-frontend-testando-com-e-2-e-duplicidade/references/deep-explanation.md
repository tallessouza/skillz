# Deep Explanation: Testando Duplicidade com E2E

## Por que testes E2E devem ser autocontidos

O instrutor demonstra ao vivo o problema: ele ja tinha um prompt com titulo duplicado no banco do ambiente de desenvolvimento. O teste passou — mas por acaso. Ao mudar o titulo para "duplicate prompt 01", o teste quebrou porque aquele titulo nao existia no banco.

A analogia usada: **o teste e uma caixinha fechada**. Tudo que ele precisa deve estar dentro dessa caixinha. Se voce depende de algo externo (um dado que "ja esta la"), o teste nao e **repeatable** — nao pode ser rodado N vezes com o mesmo resultado.

## O conceito de Repeatable

O instrutor enfatiza: "Eu tenho que rodar ele N vezes e N vezes ele vai ter que passar." Isso e um dos principios FIRST de testes (Fast, Isolated, Repeatable, Self-validating, Timely). O R (Repeatable) e o que quebra mais frequentemente em testes E2E porque eles dependem de estado externo (banco, servidor, rede).

## Pattern: Delete + Create

A solucao e simples mas elegante:
1. **Delete** qualquer registro com o titulo que vamos usar (`deleteMany`)
2. **Create** um novo registro com esse titulo
3. Agora o teste sabe que existe exatamente 1 registro

Isso garante idempotencia: nao importa quantas vezes voce rode, o estado inicial e sempre o mesmo.

## Validacao dupla: por que contar elementos

O instrutor faz uma observacao importante: nao basta checar que o toast de erro apareceu. Voce precisa validar que o dado **nao foi salvo**. A forma escolhida: `toHaveCount(1)` — se o titulo aparece mais de uma vez na sidebar, significa que o toast apareceu mas o backend salvou mesmo assim (bug).

Essa e uma validacao de **efeito colateral negativo**: garantir que algo que nao deveria acontecer, de fato nao aconteceu.

## Global Setup vs Setup por teste

O instrutor usa duas estrategias:
- **Global Setup** (`globalSetup` no playwright config): roda o seed do Prisma antes de TODOS os testes. Prepara o ambiente base.
- **Setup por teste** (inicio do `test()`): prepara dados especificos que apenas aquele cenario precisa.

A distincao e importante: dados genericos (usuarios base, configs) vao no global setup. Dados especificos do cenario vao no proprio teste.

## WebServer config

O instrutor configura `webServer` no playwright config para nao precisar rodar `pnpm dev` manualmente. Detalhes:
- `command`: diferencia CI (`pnpm start` — precisa de build) de dev (`pnpm dev`)
- `timeout: 120_000`: tempo para o Next.js iniciar (pode demorar)
- `reuseExistingServer: !process.env.CI`: em dev, reaproveita servidor ja rodando; em CI, sempre inicia novo

## Trade-offs de testes E2E (piramide de testes)

O instrutor contextualiza na piramide de testes:
- **Topo da piramide**: E2E — poucos, caros, lentos, frageis
- **Meio**: integracao — mais, equilibrio custo/valor
- **Base**: unidade — muitos, rapidos, baratos

Motivos para manter E2E no minimo:
- Precisam de ambiente completo (banco, servidor, browser)
- Demoram mais na CI (aumenta tempo de deploy)
- Sao sensiveis a qualquer mudanca de ambiente (rede, timeouts)
- Geram custo real (infra, tempo de pipeline)

O instrutor recomenda: para a pagina de criacao, apenas 2 testes E2E fazem sentido — sucesso e erro de duplicidade. Cenarios adicionais devem ser cobertos por testes de integracao ou unidade.

## Problemas de conexao observados

Durante a aula, o instrutor enfrentou erros de conexao intermitentes. Isso exemplifica exatamente a fragilidade dos testes E2E: dependem de servidor rodando, banco acessivel, rede estavel. Ele precisou reiniciar o servidor varias vezes. Essa e a realidade de trabalhar com E2E.