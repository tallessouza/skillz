# Deep Explanation: Configurando o Jest

## Por que usar `npx jest --init`

O wizard interativo do Jest gera um `jest.config.ts` com todas as opcoes possiveis comentadas. Isso serve como documentacao inline, mas o arquivo resultante tem 200+ linhas de comentarios que poluem o projeto. A abordagem correta e rodar o wizard para gerar a estrutura base e depois limpar agressivamente, mantendo apenas as propriedades que voce realmente usa.

### Respostas recomendadas no wizard

1. **Adicionar script de teste no package.json?** — Nao (adicione manualmente depois com mais controle)
2. **Usar TypeScript?** — Sim
3. **Ambiente?** — Node (para APIs)
4. **Cobertura de codigo?** — Nao inicialmente (adicione quando tiver testes suficientes)
5. **Mecanismo de cobertura?** — V8 (mais rapido que Istanbul para Node)
6. **Limpar mocks entre testes?** — Sim (isolamento e fundamental)

## Propriedades essenciais explicadas

### `bail: true`

Faz o Jest parar na primeira suite de testes que falhar. Em desenvolvimento, voce quer feedback imediato — nao precisa esperar 50 testes rodarem para saber que algo quebrou. Em CI, considere `bail: false` para ter o relatorio completo.

### `clearMocks: true`

Equivale a chamar `jest.clearAllMocks()` automaticamente entre cada teste. Sem isso, mocks de um teste podem vazar para o proximo, causando falhas intermitentes que sao extremamente dificeis de debugar. Essa propriedade garante isolamento.

### `coverageProvider: "v8"`

O V8 e o engine JavaScript do Node.js. Usar o V8 como provider de cobertura e mais rapido que o Istanbul (alternativa) porque usa instrumentacao nativa do engine em vez de transformar o codigo. Para projetos Node.js, V8 e a escolha padrao.

### `preset: "ts-jest"`

O ts-jest e um transformer que permite ao Jest entender TypeScript nativamente. Sem ele, voce precisaria compilar TypeScript para JavaScript antes de rodar os testes, adicionando uma etapa de build e complicando o fluxo. O preset configura automaticamente o transformer e as extensoes de arquivo.

### `testEnvironment: "node"`

Define o ambiente de execucao dos testes. Para APIs Node.js, use `"node"`. Para aplicacoes frontend que precisam de DOM, use `"jsdom"`. Usar o ambiente errado causa erros como `document is not defined` (node sem DOM) ou APIs do Node indisponiveis (jsdom sem fs/path).

### `testMatch`

Define quais arquivos o Jest reconhece como testes. O padrao `<rootDir>/src/**/*.test.ts` significa:
- `<rootDir>` — raiz do projeto (onde esta o jest.config.ts)
- `src/` — busca apenas dentro da pasta src
- `**/` — qualquer nivel de subpastas
- `*.test.ts` — qualquer arquivo terminando em `.test.ts`

Convencao `.test.ts` vs `.spec.ts`: ambas sao validas. A aula usa `.test.ts`. O importante e ser consistente no projeto.

### `moduleNameMapper`

O Jest nao entende os path aliases do `tsconfig.json` automaticamente. Se seu tsconfig tem:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Voce precisa espelhar isso no Jest:

```typescript
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
}
```

A regex `^@/(.*)$` captura tudo depois de `@/` e `$1` substitui pelo caminho real em `src/`. Sem isso, imports como `import { User } from "@/entities/User"` falham nos testes com `Cannot find module '@/entities/User'`.

## Erro comum: arquivo gerado pelo wizard

O wizard gera um arquivo enorme com todas as opcoes comentadas. Muitos desenvolvedores deixam esses comentarios por "referencia futura". Isso e um anti-pattern porque:

1. Os comentarios ficam desatualizados conforme o Jest evolui
2. Dificultam encontrar as propriedades ativas
3. A documentacao oficial e sempre mais atualizada que os comentarios inline
4. Poluem o diff em code reviews

A abordagem correta e limpar tudo e manter apenas o que voce usa.