# Deep Explanation: Trabalhando com Imagens no Angular

## Por que `public/` e nao `src/assets/`?

No Angular 19+, a pasta `public/` substitui o antigo `src/assets/`. O `angular.json` configura automaticamente que todos os arquivos dentro de `public/` sao tratados como assets — ou seja, sao **apenas copiados** para a pasta `dist/` durante o build, sem nenhuma transformacao (sem minificacao, sem tree-shaking, sem bundling).

Isso contrasta com arquivos TypeScript, HTML e CSS dentro de `src/`, que sao processados, compilados e otimizados pelo Angular CLI.

## Como o Angular resolve os caminhos

Quando voce escreve `/images/skillz.png` no HTML ou CSS, o Angular sabe que esse caminho e relativo ao servidor. Durante o `ng build`, ele copia `public/images/skillz.png` para `dist/nome-do-projeto/browser/images/skillz.png`. O servidor de producao serve `dist/.../browser/` como raiz, entao `/images/skillz.png` resolve corretamente.

Por isso **nunca coloque `public/` no caminho** — esse diretorio nao existe no bundle final.

## O problema do Base64 (explicacao detalhada do instrutor)

O instrutor destaca tres problemas criticos com Base64 inline:

1. **Tamanho ~33% maior**: A codificacao Base64 expande o tamanho do arquivo em aproximadamente 33%. Uma imagem de 100KB vira ~133KB em Base64.

2. **Bloqueia carregamento paralelo**: Quando a imagem esta embutida no JavaScript, o navegador precisa baixar TODO o JS antes de exibir a imagem. Com imagens separadas, o navegador faz requisicoes paralelas — baixa JS e imagens simultaneamente.

3. **Impede cache do navegador**: Imagens separadas sao cacheadas pelo navegador. Na segunda visita, o navegador nem faz a requisicao — usa a versao em cache. Base64 dentro do JS precisa ser re-baixado toda vez que o JS muda.

### Quando Base64 e aceitavel

O instrutor menciona um caso real: imagens Base64 vindas de um servidor via HTTP, usadas temporariamente e depois descartadas. Nesse caso, a imagem nao esta chumbada no codigo — ela e efemera. Esse e o unico cenario aceitavel.

## Cache do navegador (demonstracao do instrutor)

O instrutor demonstrou ao vivo: ao navegar para outra pagina e voltar, o favicon nao foi re-baixado — o navegador usou a versao em cache. Isso so funciona com imagens servidas como arquivos separados, nao com Base64 inline.

## O `angular.json` e a configuracao de assets

No `angular.json`, dentro de `projects > nome > architect > build > options`, existe a configuracao `assets` que aponta para `public/`. Qualquer subpasta dentro de `public/` e automaticamente incluida. Voce pode adicionar pastas como `public/fonts/`, `public/icons/`, etc.

## Angular nao otimiza imagens

Ponto critico mencionado pelo instrutor: o Angular CLI **nao faz compressao ou otimizacao de imagens**. O que voce coloca em `public/` vai identico para `dist/`. A responsabilidade de comprimir e do desenvolvedor, usando ferramentas externas antes de adicionar ao projeto.