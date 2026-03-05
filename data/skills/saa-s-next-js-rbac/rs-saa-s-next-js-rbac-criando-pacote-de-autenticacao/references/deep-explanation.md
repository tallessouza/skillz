# Deep Explanation: Criando Pacote de Autenticacao Compartilhado

## Por que compartilhar permissoes como pacote?

O instrutor explica um cenario concreto: no frontend, se o usuario nao tem permissao para deletar projetos, o botao de deletar deve ficar invisivel. Mas no backend, a rota de deletar projetos TAMBEM precisa validar a permissao — nao se pode depender do frontend para seguranca.

Isso cria uma necessidade real de compartilhamento: a mesma logica de "quem pode fazer o que" precisa existir em dois lugares. Duplicar seria um erro porque qualquer mudanca precisaria ser feita em dois lugares, e inevitavelmente eles divergem.

A regra geral do instrutor: **"Tudo o que eu tenho compartilhado entre mais de um projeto vira um pacote."** Configuracoes compartilhadas (ESLint, Prettier, TSConfig) tambem seguem essa logica — sao pacotes de configuracao.

## Permissoes no codigo vs banco de dados

O instrutor menciona que existem varias estrategias para definir permissoes por cargo. A estrategia escolhida e definir permissoes nos proprios arquivos de codigo, nao no banco de dados. Ele promete explicar vantagens, desvantagens e alternativas nas proximas aulas, mas ja antecipa que armazenar no banco de dados tambem funcionaria.

A escolha de permissoes em codigo favorece:
- Type safety (TypeScript valida em compile time)
- Compartilhamento facil via pacote
- Versionamento junto com o codigo (git)
- Sem queries ao banco para verificar permissoes

## Anatomia do package.json para pacotes internos

### Campo `main` e `types`

```json
{
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

O `main` diz qual arquivo carregar quando outro projeto importa o pacote. O `types` diz ao TypeScript onde encontrar as tipagens. Em pacotes internos de monorepo, ambos apontam para o mesmo arquivo `.ts` — nao precisa buildar para `.js` e gerar `.d.ts` separados.

### Campo `private: true`

Impede publicacao acidental no npm. O instrutor tambem remove `publish-config` porque nao vai publicar no npm.

### Campo `version: "0.0.0"`

Convencao para pacotes internos que nunca serao publicados. A versao nao importa porque o workspace protocol resolve por symlink.

## ESLint e Prettier inline no package.json

O instrutor faz uma escolha pragmatica: em vez de criar `.eslintrc.js` e `.prettierrc` separados (que adicionariam 2 arquivos ao pacote), ele usa os campos nativos do package.json:

```json
{
  "prettier": "@saas/prettier",
  "eslintConfig": {
    "extends": ["@saas/eslint-config/library"]
  }
}
```

A justificativa: "daqui a pouco vai ficando muito arquivo aqui dentro, arquivos muito pequenos". Para pacotes com configuracao minima, inline e preferivel.

O perfil `library` do ESLint e usado (em vez de `next` ou `node`) porque o pacote nao e nem aplicacao React nem aplicacao Node — e uma biblioteca generica.

## TSConfig para pacotes cross-platform

### O problema

O pacote auth sera usado tanto por React (frontend) quanto Node (backend). Configs de TypeScript especificas para Node (ex: `moduleResolution: node`) podem conflitar com configs de React, e vice-versa.

### A solucao: ts-config-bases

O instrutor referencia o repositorio `ts-config-bases` que tem templates prontos. Ele escolhe `vite-react` como "meio-termo" — nao e perfeito para nenhum dos dois, mas funciona para ambos.

### Criando library.json no pacote de config

O instrutor cria um novo arquivo `library.json` dentro do pacote `@saas/tsconfig` e o registra no campo `files` do package.json desse pacote para que seja encontravel por outros pacotes.

### include com glob

O instrutor encontra um erro: `No inputs were found in config file`. A causa: o `include` estava como `["src"]` sem glob pattern. A correcao foi usar `["src/**/*.ts"]` para que o TypeScript encontre os arquivos recursivamente.

## Reload do VSCode

Detalhe pratico importante: apos configurar ESLint e Prettier pela primeira vez (ou alterar a configuracao), os plugins do VSCode precisam de um reload para ler as novas configuracoes. O instrutor demonstra isso ao vivo — o linting so comeca a funcionar apos `Ctrl+Shift+P > Reload Window`.