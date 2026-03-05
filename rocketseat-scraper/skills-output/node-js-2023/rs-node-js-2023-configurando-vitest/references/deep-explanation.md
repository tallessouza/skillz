# Deep Explanation: Configurando Vitest

## Por que testes nao sao opcionais no back-end

O instrutor Diego enfatiza um ponto forte: testes no back-end **nao sao opcionais**. A mentalidade de "depois eu faco", "um dia eu tiro uma semana pra escrever testes" e descrita como **totalmente inutil**. A razao:

> "Se voce tirar um tempo depois para escrever os testes, voce ja nem lembra mais o que voce precisa testar."

Quando voce esta implementando a regra de negocio, os testes sao fundamentais para validar que voce esta cumprindo os requisitos daquela tarefa. A proximidade temporal entre implementacao e teste e o que da valor ao teste.

## TDD como opcao, nao obrigacao

O instrutor menciona TDD (Test-Driven Development) — escrever o teste antes para dar erro e saber qual caminho seguir. Porem, ele faz uma distincao importante:

> "A metodologia nao e mais importante. O mais importante e: escreva testes."

Ou seja: TDD e uma ferramenta valida, mas o ato de testar importa mais que a ordem em que voce testa. Nao use "nao sei TDD" como desculpa para nao testar.

## Por que vite-tsconfig-paths e necessario

O Vitest, por padrao, nao entende os path aliases configurados no `tsconfig.json`. Quando voce configura:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

O TypeScript compiler entende, mas o Vitest usa o Vite como bundler e precisa de um plugin separado para resolver esses aliases. O `vite-tsconfig-paths` le o `tsconfig.json` e configura automaticamente o Vite para resolver os mesmos paths.

Sem esse plugin, qualquer `import { something } from '@/use-cases/register'` dentro de um arquivo `.spec.ts` vai falhar com erro de modulo nao encontrado.

## Diferenca entre vitest run e vitest

- **`vitest run`**: Executa todos os testes uma unica vez e encerra o processo. Ideal para CI/CD e verificacoes pontuais.
- **`vitest`** (sem `run`): Entra em watch mode. Fica observando mudancas nos arquivos e re-executa automaticamente os testes relacionados as mudancas. Ideal para desenvolvimento local.

O watch mode e inteligente — ele nao roda todos os testes a cada mudanca, apenas os testes relacionados aos arquivos que mudaram.

## Estrutura do arquivo de configuracao

O `vite.config.ts` usa `defineConfig` importado de `vitest/config` (nao de `vite` diretamente). Isso garante que os tipos do Vitest estejam disponiveis na configuracao. A funcao recebe um objeto com `plugins` como array, onde cada plugin e uma funcao invocada.

## Convencao de nomes de arquivos de teste

O instrutor cria `register.spec.ts` dentro da pasta de use-cases. A convencao `.spec.ts` e a mais comum no ecossistema Node.js/Vitest, embora `.test.ts` tambem funcione por padrao.