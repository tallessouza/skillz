# Deep Explanation: Prettier & ESLint no Monorepo

## Por que pacotes separados para config?

O instrutor remove deliberadamente todas as configs de ESLint, Prettier e TypeScript da raiz do monorepo. A razao: em um monorepo com Turborepo, cada app/package pode ter necessidades diferentes. Um projeto Next.js precisa de regras diferentes de um backend Node.js. Centralizar tudo na raiz cria conflitos.

A solucao e criar **pacotes dedicados** dentro de `config/`:
- `config/prettier` — configuracao unica de formatacao
- `config/eslint-config` — multiplas configs por tipo de projeto
- `config/ts-config` — configuracoes TypeScript (criadas sob demanda)

## Symbolic links do pnpm workspace

Quando voce referencia `"@saas/prettier": "workspace:*"` e roda `pnpm install`, o pnpm cria um **symbolic link** no `node_modules`. O instrutor destaca isso explicitamente: "os arquivos nao estao realmente aqui [...] essa pasta ta so refletindo o conteudo da pasta do prettier que eu tenho aqui embaixo."

Isso significa que alteracoes no pacote de config sao **refletidas imediatamente** em todos os consumidores, sem precisar reinstalar.

## Por que `private: true`?

O instrutor explica: "e bem comum em monorepos que a gente tem muitos pacotes, alguns deles a gente querer publicar, principalmente se a gente esta desenvolvendo alguma lib. E o private true ele evita isso." Pacotes de configuracao nunca devem ser publicados no npm.

## JSDoc `@typedef` para autocomplete

Como os arquivos de config sao JavaScript puro (`.mjs` ou `.js`), nao ha type checking nativo. O instrutor usa um pattern com JSDoc:

```javascript
/** @typedef {import('prettier').Config} PrettierConfig */
/** @type {PrettierConfig} */
const config = { ... }
```

Isso faz o VS Code oferecer autocomplete completo sem precisar de TypeScript. O instrutor demonstra: "se eu dou um ctrl espaco aqui dentro, eu tenho todas as configuracoes que eu posso colocar no prettier."

## `simple-import-sort` como `error` vs `warn`

O instrutor faz questao de explicar por que usa `"error"` e nao `"warn"`: "quando voce salvar um arquivo, como ele vai identificar a ordem dos imports como um erro, e nao como um aviso, ele vai fazer o autofix sozinho. Se a gente deixar o padrao, que e o aviso [...] o autofix nao faz o fix automatico."

Isso e um detalhe tecnico importante — o behavior de autofix do ESLint no VS Code so dispara para regras marcadas como `error`.

## Prettier ativado via `package.json` (sem arquivo dedicado)

O instrutor mostra que em vez de criar `.prettierrc` na raiz, voce pode referenciar o pacote diretamente no `package.json`:

```json
{ "prettier": "@saas/prettier" }
```

Isso e mais limpo e segue o padrao de config-as-package.

## ESLint dentro do proprio pacote de ESLint config

Uma descoberta interessante do instrutor: o pacote `eslint-config` tambem pode usar ESLint em si mesmo, referenciando suas proprias configs:

```json
{
  "eslintConfig": { "extends": "./library.js" }
}
```

O instrutor reage: "legal a gente descobrir que da pra fazer isso, isso e bem interessante."

## TypeScript config adiada

O instrutor deliberadamente esvazia o pacote de TypeScript config: "como a gente nao criou nenhum projeto ainda, eu nao vou mexer nestas configuracoes do TypeScript ainda." Isso segue o principio de nao configurar o que nao esta sendo usado — YAGNI aplicado a config de monorepo.

## Tres configs ESLint: next, node, library

| Config | Estende | Uso |
|--------|---------|-----|
| `next.js` | `@skillz/eslint-config/next` | Apps Next.js (frontend) |
| `node.js` | `@skillz/eslint-config/node` | APIs Node.js (backend) |
| `library.js` | `@skillz/eslint-config/react` | Pacotes de biblioteca React |

O instrutor explica que `library.js` usa a config de React porque as bibliotecas do monorepo serao componentes React.