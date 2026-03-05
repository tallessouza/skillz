# Deep Explanation: Assets e Icones no Angular

## Mudanca de `src/assets/` para `public/`

Nas versoes anteriores do Angular (pre-17), a convencao era colocar todos os arquivos estaticos em `src/assets/`. A partir do Angular 17, a CLI gera projetos com uma pasta `public/` na raiz, fora do `src/`. Essa mudanca alinha o Angular com a convencao usada por outros frameworks (Vite, Next.js, etc.) onde `public/` e servido diretamente na raiz do servidor.

O `angular.json` controla esse comportamento. A propriedade `assets` dentro de `architect > build > options` define quais diretorios sao tratados como assets pelo compilador do Angular. Qualquer arquivo dentro dos diretorios listados sera copiado diretamente para o output do build, mantendo a estrutura de pastas.

## Por que importar tudo de uma vez

O instrutor enfatiza a importancia de importar todos os icones de uma vez no inicio do projeto. A razao e pratica: se voce parar no meio da implementacao de um componente para baixar um icone do Figma, renomear, colocar na pasta correta, isso "quebra o fluxo de aprendizado" e o fluxo de desenvolvimento. E mais eficiente preparar todos os assets antes de comecar a estilizacao.

## Exportando do Figma manualmente

Caso precise exportar icones manualmente do Figma:
1. Posicione o mouse sobre o icone desejado
2. Segure `Ctrl` e clique — isso seleciona o elemento especifico
3. No painel direito, localize a secao "Export"
4. Clique no `+` para adicionar uma exportacao
5. Selecione o formato **SVG**
6. Clique em "Export" para baixar
7. Renomeie o arquivo de forma semantica (ex: `icon-close.svg`, `icon-bell.svg`)
8. Mova para `public/images/`

## Como o Angular serve assets

O Angular CLI (via Webpack ou esbuild/Vite dependendo da versao) copia os arquivos da pasta configurada como assets diretamente para o diretorio de output (`dist/`). Isso significa que `public/images/logo.svg` sera acessivel em `http://localhost:4200/images/logo.svg` sem nenhum import ou require — basta referenciar o path no HTML.

## Visualizando SVGs no VS Code

O instrutor demonstra que e possivel visualizar SVGs diretamente no VS Code clicando nos arquivos. Isso e util para verificar rapidamente se o icone correto esta no lugar certo antes de usar nos templates.