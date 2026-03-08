# Deep Explanation: Configurando Suite de Testes com Jest e TypeScript

## Por que ts-node é necessário

O Jest por padrão não entende TypeScript. O `ts-node` atua como um transpilador em tempo de execução — quando o Jest encontra um arquivo `.test.ts`, o ts-node converte para JavaScript antes da execução. Sem ele, o Jest falha com erro de sintaxe ao encontrar anotações de tipo.

A versão `10.9.2` é especificada porque versões mais recentes podem ter incompatibilidades com certas configurações de `tsconfig.json`. Fixar a versão garante reprodutibilidade.

## Experimental VM Modules

A flag `--experimental-vm-modules` do Node.js habilita suporte a ES Modules dentro do ambiente de VM que o Jest usa internamente. O Jest executa cada arquivo de teste em uma VM isolada (sandbox). Sem essa flag, imports com `import/export` podem falhar dependendo da configuração do projeto.

É passada via `node --experimental-vm-modules` antes do `npx jest` porque precisa ser uma flag do Node.js, não do Jest.

## Watch vs WatchAll — diferença sutil mas importante

- `--watch`: Observa apenas arquivos rastreados pelo git (usa `git status` internamente). Se o projeto não tem git inicializado ou o arquivo é novo e não foi commitado, o watch não detecta mudanças.
- `--watchAll`: Observa todos os arquivos no diretório, independente do estado no git. É mais permissivo e funciona sempre.

O instrutor inicialmente usou `--watch` e teve que trocar para `--watchAll`. Esse é um erro comum — a mensagem de erro não é óbvia e pode parecer que o Jest simplesmente "não funciona".

## RunInBand — execução sequencial

Por padrão, o Jest executa testes em paralelo usando workers. Isso é rápido para testes isolados, mas causa problemas quando testes compartilham recursos (banco de dados, arquivos, portas de rede). A flag `--runInBand` força execução sequencial — um teste só começa quando o anterior termina.

Para uma API de entregas com banco de dados, isso é essencial: testes que criam/deletam registros podem colidir se executados simultaneamente.

## Estrutura de pastas: src/tests/

A convenção do projeto coloca testes em `src/tests/` em vez de na raiz ou ao lado dos arquivos fonte. Isso separa claramente código de produção de código de teste, facilitando exclusão no build final.

O padrão de nomenclatura `{entidade}-controller.test.ts` conecta cada arquivo de teste ao controller correspondente, tornando a navegação intuitiva.

## Describe como agrupador

O `describe` no Jest cria uma "suite de testes" — um agrupamento lógico. O nome deve refletir o módulo sendo testado (ex: "Users controller"). Suites podem ser aninhadas:

```typescript
describe("Users controller", () => {
  describe("POST /users", () => {
    it("cria usuário com dados válidos", () => { ... })
  })
  describe("GET /users", () => {
    it("lista todos os usuários", () => { ... })
  })
})
```

Um `describe` sem nenhum `it` dentro causa erro porque o Jest espera que toda suite contenha pelo menos um teste executável.

## Processo iterativo de configuração

O instrutor enfatiza que erros durante configuração são normais: "vai acontecendo esses detalhezinhos a gente vai corrigindo, faz parte do processo de desenvolvimento". Primeiro o ts-node não estava instalado, depois a flag watch precisou ser trocada por watchAll. Cada erro revelou uma peça faltante na configuração.

Esse é o fluxo real de setup — raramente funciona na primeira tentativa. O importante é ler a mensagem de erro, identificar o que falta, e corrigir incrementalmente.