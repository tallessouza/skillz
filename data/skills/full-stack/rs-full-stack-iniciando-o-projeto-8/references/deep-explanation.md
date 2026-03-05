# Deep Explanation: Setup Inicial de Projeto HTML/CSS

## Filosofia do instrutor: Configurar ANTES de codar

O instrutor enfatiza que o tempo investido na configuracao inicial paga dividendos durante todo o desenvolvimento. A ideia e "colocar o maximo de coisas possiveis" no setup antes de escrever codigo de producao.

### Por que separar assets em subpastas?

O projeto de patins animado tem diversos tipos de assets: imagens de produto, icones de redes sociais, elementos do hero que serao animados. Agrupar por funcao (`images/`, `icons/`, `hero/`) facilita a referencia no CSS e JS depois.

A separacao do `hero/` e particularmente inteligente: esses assets (ellipse, patins, stars) serao animados individualmente. Ter eles isolados facilita o trabalho com CSS animations depois.

### Renomear arquivos: por que o cuidado?

O Figma exporta com nomes inconsistentes (maiusculas, espacos, nomes genericos). O instrutor renomeia tudo para:
- Minusculo com hifens (`star-1.png`, nao `Star 1.png`)
- Numeros sequenciais para imagens similares (`01.png`, `02.png`)
- Nomes semanticos para icones (`facebook.png`, nao `Group 42.png`)

Isso porque no CSS/HTML, caminhos com espacos e maiusculas sao fonte de bugs silenciosos.

### Conversao px → rem

O instrutor usa a formula `px / 16 = rem` consistentemente:
- 64px → 4rem
- 40px → 2.5rem
- 14px → 0.875rem
- 16px → 1rem

Isso garante acessibilidade (respeita preferencia de font-size do usuario) e consistencia.

### box-sizing: border-box no after/before

O seletor `*, *::after, *::before { box-sizing: border-box }` e especialmente importante neste projeto porque o instrutor antecipa o uso de pseudo-elementos (`::after`, `::before`) para as animacoes CSS. Sem o border-box neles, calculos de tamanho podem quebrar.

### Zen Mode no VSCode

O instrutor usa Zen Mode (Ctrl+Shift+P → Toggle Zen Mode) para foco total. Remove distractoes visuais — sidebar, tabs, status bar — deixando so o codigo. Util durante sessoes de configuracao detalhada.

### Processo de pensamento exposto

O instrutor propositalmente mostra seu processo iterativo: comecar com variaveis genericas, depois refinar conforme entende melhor o design. Exemplo: inicialmente colocou `font-weight: 400`, depois percebeu que nenhuma fonte usaria 400 e mudou para 500. Isso demonstra que setup nao e linear — e normal ir e voltar.

### Style Guide como fonte de verdade

Antes de qualquer codigo, o instrutor abre o Style Guide do Figma e extrai:
1. Cores → CSS custom properties no `:root`
2. Tipografia → Google Fonts imports + CSS rules
3. Espacamentos e tamanhos → variaveis rem

Essa disciplina evita "inventar" valores durante o desenvolvimento.

### Google Fonts: selecao de pesos

O instrutor seleciona apenas os pesos necessarios (500 medium, 700 bold) — nao carrega a familia inteira. Cada peso adicional e mais bytes na rede. O "OneValue" no Google Fonts permite selecionar pesos individuais.

### Organizacao CSS: index.css como hub

O `index.css` usa `@import url("global.css")` para manter separacao de responsabilidades. O global tem reset e variaveis, enquanto index sera o ponto de entrada que importa todos os outros arquivos CSS conforme o projeto cresce.