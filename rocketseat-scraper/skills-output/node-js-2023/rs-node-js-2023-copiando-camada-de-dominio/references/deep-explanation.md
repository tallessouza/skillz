# Deep Explanation: Migracao de Camada de Dominio

## Por que `{}` nao significa objeto vazio em TypeScript

O instrutor explica um ponto crucial que muitos desenvolvedores nao entendem: em TypeScript, `{}` como tipo **nao significa objeto vazio**. Significa "qualquer valor nao-nulo". Isso acontece porque JavaScript e uma linguagem baseada em orientacao a objetos onde **tudo e objeto** — strings, numeros, arrays. Entao `{}` aceita literalmente qualquer coisa.

Quando o retorno de um use case pode ser um erro ou "nada" (operacao bem-sucedida sem retorno), `null` e semanticamente muito mais correto que `{}`. Null diz explicitamente: "nao houve retorno".

## Por que `unknown` e melhor que `any`

Ambos aceitam qualquer valor, mas com uma diferenca critica:
- `any`: desabilita o type system completamente. Voce pode acessar `.name`, `.foo`, `.qualquerCoisa` sem erro.
- `unknown`: aceita qualquer valor mas **impede acesso a propriedades** sem antes fazer type narrowing (type guard, assertion, etc).

O instrutor muda todos os `any` por `unknown` nas classes de Domain Events e entidades base, porque essas classes genericas nao sabem o tipo exato que vao receber, mas nao devem permitir acesso irrestrito.

## Adjacencia de getters/setters no TypeScript

Esse erro aparece por causa de uma atualizacao do TypeScript que introduziu uma regra mais estrita: `all content signatures should be adjacent`. Nao e algo que o instrutor mudou no projeto — e a propria evolucao da linguagem.

A convencao recomendada pelo instrutor: **sempre colocar o `set` imediatamente abaixo do `get`** do mesmo campo. Isso melhora a leitura porque ao ver o getter, voce imediatamente ve como o valor pode ser modificado.

## Pattern de `new` para side effects

Em varias partes do codigo de Domain Events, o `new` e usado apenas para disparar o constructor (que chama `setupSubscriptions`), sem armazenar a instancia. O ESLint reclama porque normalmente `new` deveria produzir um valor que voce usa.

No contexto de Domain Events, isso e um pattern valido — o constructor registra listeners como side effect. O instrutor desativa a regra `no-new` no ESLint para esse caso.

## Estrategia de validacao incremental

O instrutor demonstra um ciclo claro:

1. **`tsc --noEmit`** — verifica tipos sem gerar build (mais rapido que `npm run build`)
2. **Corrigir erros de dependencia** — instalar libs faltantes
3. **Repetir tsc** ate zero erros de tipo
4. **`pnpm lint --fix`** — corrigir erros de estilo automaticamente
5. **`pnpm lint`** — ver erros remanescentes que precisam correcao manual
6. **`pnpm test`** — validacao final com testes unitarios

Essa abordagem incremental evita ter que debugar dezenas de erros ao mesmo tempo.

## Separacao de testes: unitarios vs e2e

O instrutor relembra a configuracao do Vitest com dois arquivos de configuracao:
- `vitest.config.ts` (padrao) — roda testes unitarios com `pnpm test`
- `vitest.config.e2e.ts` — roda testes end-to-end com `pnpm test:e2e`

Isso permite rodar os testes unitarios rapidamente (validando a camada de dominio copiada) sem precisar subir infraestrutura para testes e2e.