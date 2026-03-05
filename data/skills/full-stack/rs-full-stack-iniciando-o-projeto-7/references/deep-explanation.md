# Deep Explanation: Setup de Projeto Responsivo

## Por que duas telas no Responsively App?

O instrutor configura exatamente duas telas: 375px (mobile) e 1280px (desktop). A razao e pratica — durante o desenvolvimento responsivo, voce precisa ver simultaneamente os dois extremos do design. Telas intermediarias (tablets) sao ajustadas depois, quando os dois extremos ja funcionam.

375px e o padrao porque corresponde ao iPhone 6/7/8 — o menor viewport comum que ainda tem participacao significativa no mercado. 1280x800 cobre a maioria dos laptops.

## Organizacao de assets: SVG vs PNG

O instrutor separa assets em duas categorias:
- **SVGs** vao para `assets/icons/` — sao icones vetoriais (check, discord, tiktok, twitter, etc.)
- **PNGs** ficam na raiz de `assets/` — sao imagens maiores, fotos, screenshots

A razao principal: icones SVG podem ser manipulados via CSS (cor, tamanho), enquanto PNGs sao estaticos. O instrutor menciona que descobriu "uma maneira de fazer isso quase via codigo" para alterar cores dos icones — isso sera abordado em aulas futuras.

## CSS modular desde o inicio

A separacao entre `index.css` e `global.css` desde o primeiro arquivo e intencional:
- `global.css` contem reset, variaveis CSS, tipografia base
- `index.css` importa o global e contem estilos especificos da pagina

Isso evita o problema classico de um unico arquivo CSS monolitico que cresce descontroladamente.

## Responsively App vs DevTools

O instrutor escolhe o Responsively App em vez do Device Mode do Chrome DevTools por uma razao especifica: ver AMBAS as telas ao mesmo tempo, lado a lado. No DevTools, voce so ve uma tela por vez e precisa ficar alternando. Com o Responsively App, qualquer scroll ou interacao e sincronizada entre todas as telas.

## .gitignore no Mac

O arquivo `.DS_Store` e criado automaticamente pelo macOS em toda pasta que voce abre no Finder. Se nao for ignorado, aparece em todo commit e polui o historico. O instrutor lembra disso como um "detalhezinho" mas e essencial para manter o repositorio limpo.

## Fluxo de trabalho proposto

O instrutor estabelece um fluxo que sera usado nas proximas aulas:
1. Escrever codigo no VS Code
2. Live Preview gera uma URL local
3. Responsively App consome essa URL
4. Alternar entre o editor e o Responsively App para observar as mudancas em ambos os viewports

Esse fluxo permite feedback visual instantaneo em multiplos dispositivos sem precisar fazer deploy ou usar tuneis.