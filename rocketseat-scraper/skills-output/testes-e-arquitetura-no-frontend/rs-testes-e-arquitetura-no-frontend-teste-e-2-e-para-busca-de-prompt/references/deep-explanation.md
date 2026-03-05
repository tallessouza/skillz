# Deep Explanation: Teste E2E para Busca de Prompt

## Por que seedar dados com unicidade?

O instrutor enfatiza que o fator mais importante de qualquer teste — nao so E2E, mas unidade e integracao tambem — e ser **repetivel**. Se voce hardcoda um titulo como "Meu Prompt" no teste, ele pode colidir com dados de outra execucao ou de outro desenvolvedor.

A solucao e usar `Date.now()` concatenado ao identificador:
```typescript
const uniqueAlpha = `e2e-search-alpha-${Date.now()}`
```

Isso garante que:
- Cada execucao cria dados unicos
- Nao ha colisao entre execucoes paralelas
- Outro dev pode puxar o codigo e rodar sem preparacao

## O ponto sobre repetibilidade

O instrutor destaca: "Se eu apagar todos os dados que tenho em memoria e rodar novamente, vai continuar passando. Se voce subir a aplicacao e outro desenvolvedor do seu time puxar, vai funcionar."

Isso e o conceito de **teste auto-contido**: o teste cria seu proprio ambiente, executa, e os dados criados nao interferem em nada porque sao unicos.

## Diferenca entre fill() do Playwright e type() do Jest/Testing Library

No Jest com Testing Library, ao usar `userEvent.type()`, o texto e concatenado ao valor existente no campo. Voce precisa limpar o campo antes com `userEvent.clear()`.

No Playwright, `fill()` ja limpa o campo automaticamente antes de inserir o novo valor. Isso simplifica testes que precisam buscar multiplos termos sequencialmente.

## toHaveCount vs toBeVisible

O instrutor comeca usando `toBeVisible()` mas depois evolui para `toHaveCount(1)`. A razao: se existe exatamente 1 elemento com aquele texto, ele necessariamente esta visivel. Mas `toHaveCount` tambem valida que nao ha duplicatas — e mais preciso.

Para termos inexistentes, `toHaveCount(0)` e a unica opcao correta (nao existe `toNotBeVisible` para algo que nao esta no DOM).

## Fragilidade de testes E2E

O instrutor menciona que "esses testes sao mais frageis" — referindo-se a testes E2E em geral comparados a unidade/integracao. Por isso a enfase em:
- Dados unicos (evitar falsos negativos por colisao)
- Ambiente preparado (banco rodando, container up)
- Desconexao apos seed (evitar conexoes pendentes)

## Setup do banco no teste

O padrao usado e conectar ao banco via Prisma diretamente no teste, usando a mesma connection string da aplicacao (`process.env.DATABASE_URL`). Isso funciona porque os testes E2E rodam contra a aplicacao real, nao contra mocks.

A sequencia e:
1. Criar adapter com connection string
2. Instanciar Prisma Client
3. `createMany` para inserir dados de teste
4. `$disconnect` para liberar conexao
5. Navegar para a pagina e testar