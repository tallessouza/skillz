# Deep Explanation: Importando Fontes do Google Fonts

## Por que `<link>` e mais performatico que `@import`

O instrutor explica a diferenca com clareza:

**Com `<link>` no `<head>`:**
O navegador comeca a montar o HTML, encontra as tags `<link>` e ja inicia o download das fontes **em paralelo** com CSS, JavaScript e outros recursos. As tags `preconnect` aceleram ainda mais ao estabelecer conexao antecipada com os servidores do Google. A renderizacao **nao e bloqueada**.

**Com `@import` no CSS:**
O navegador encontra a folha de estilo no `<head>`, baixa o CSS, entra dentro do arquivo para analisar, encontra o `@import` da fonte e **bloqueia a renderizacao** enquanto baixa a fonte. So depois de baixar a fonte e que continua lendo o CSS e finaliza a renderizacao. E uma **cascata sequencial** em vez de downloads paralelos.

## Quando usar `@import` (caso raro)

O instrutor menciona que em alguns sistemas voce pode nao ter acesso ao HTML. Nesses casos, `@import` no styles.css e a unica opcao. Ele tambem alerta que `@import` pode ter problemas de compatibilidade com navegadores mais antigos.

## Configuracoes do Google Fonts

### Style (Change Style)
- **Full Access**: baixa normal e italico juntos
- **One Value**: escolhe entre normal OU italico

### Weight
- **Full Access**: baixa todos os pesos de 100 a 900
- **One Value**: baixa apenas o peso escolhido (ex: 300 light)
- A URL muda conforme a selecao — o instrutor destaca para prestar atencao nisso

### Width
- Geralmente mantem-se o valor normal (padrao)

## Cuidado com font-style

O instrutor demonstrou ao vivo que a fonte Roboto pode aplicar italico por padrao em certas configuracoes. Ao perceber isso, ele recomendou forcar `font-style: normal` explicitamente quando quiser o texto reto.

## Fallback com sans-serif

Sempre declare `sans-serif` como fallback apos o nome da fonte, para o caso de o servidor do Google estar inacessivel ou a fonte nao conseguir ser baixada.