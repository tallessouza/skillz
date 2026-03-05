# Deep Explanation: Instalando e Executando o Webpack

## Por que usar um empacotador?

O instrutor demonstra um ponto fundamental: mesmo com ES Modules nativos funcionando no browser (`<script type="module">`), o empacotador resolve problemas que o browser nao resolve sozinho:

1. **Resolucao de dependencias** — O Webpack analisa o grafo de imports e gera um unico arquivo. Em vez de N requests HTTP para N modulos, o browser carrega 1 arquivo.

2. **Separacao de responsabilidades** — O HTML nao precisa saber quais arquivos JS existem. O `<script>` aponta para o bundle final, e o empacotador resolve o resto.

3. **Convencao de mercado** — O Webpack e um dos empacotadores mais utilizados. Mesmo que existam alternativas modernas (Vite, esbuild), entender Webpack e fundamental porque muitos projetos legados e frameworks o utilizam.

## A convencao src/

O instrutor enfatiza que `src/` (source) e uma convencao de mercado, nao uma exigencia tecnica. O objetivo e organizacional:

- **`src/`** — Codigo criado pelo desenvolvedor (HTML, JS, CSS, assets)
- **Raiz** — Arquivos de configuracao (`package.json`, `webpack.config.js`, `.gitignore`)

Essa separacao facilita:
- Saber imediatamente o que e codigo vs configuracao
- Configurar ferramentas (linters, bundlers) para processar apenas `src/`
- Manter a raiz limpa conforme o projeto cresce

## Entry point e o grafo de dependencias

O instrutor mostra que o Webpack precisa de um **entry point** — o arquivo principal (`index.js`). A partir dele, o Webpack:

1. Le o `index.js`
2. Encontra `import { title } from "./components.js"`
3. Le o `components.js`
4. Resolve todas as dependencias recursivamente
5. Gera um unico arquivo (`dist/main.js`) com tudo empacotado

O codigo gerado e minificado e dificil de ler ("olha que maluquice que e esse codigo", diz o instrutor), mas contem toda a funcionalidade dos arquivos originais.

## O warning de mode

Ao rodar `npm run build`, o Webpack mostra um warning pedindo para definir o `mode` (production ou development). O instrutor orienta a ignorar por enquanto — sera configurado na aula sobre `webpack.config.js`. Em production, o codigo e minificado; em development, mantem source maps para debug.

## webpack-cli

O pacote `webpack-cli` e separado do `webpack` core. Ele fornece os comandos de terminal (`webpack`, `webpack serve`, etc.). Sem ele, nao e possivel executar o Webpack via scripts npm.

## --save-dev

O instrutor usa `--save-dev` porque Webpack e uma ferramenta de build, nao uma dependencia de runtime. O codigo final (`dist/main.js`) nao precisa do Webpack para rodar — ele ja esta empacotado.