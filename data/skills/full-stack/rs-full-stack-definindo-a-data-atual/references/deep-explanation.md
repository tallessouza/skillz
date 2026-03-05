# Deep Explanation: Captura de Formulario e Inicializacao de Data

## Por que modularizar em `modules/`?

O instrutor cria a pasta `src/modules/` e dentro dela subpastas por feature (`form/`). A razao explicita: "facilitar a manutencao e deixar o codigo bem organizado com cada arquivo com uma responsabilidade separada."

Nao e uma regra absoluta — o proprio instrutor diz "aqui nao e uma regra, essa estrutura de pastas e arquivos que eu estou fazendo" — mas e uma convencao que escala bem. A ideia e que conforme o projeto cresce, voce sabe exatamente onde procurar: tudo relacionado ao formulario esta em `modules/form/`.

### Separacao de imports no main.js

O instrutor faz questao de separar visualmente imports CSS de imports JS com comentarios:

```javascript
import "./style/global.css"

// JS
import "./modules/form/submit.js"
```

Isso e um pattern de organizacao visual — quando o main.js crescer com mais modulos, voce sabe rapidamente o que e estilo e o que e logica.

## preventDefault — por que e a primeira coisa no handler?

O comportamento padrao de um `<form>` HTML ao submeter e recarregar a pagina (fazer um GET/POST para a action URL). Em SPAs e aplicacoes modernas, isso e quase sempre indesejado porque:

1. Perde o estado da aplicacao
2. Faz uma navegacao completa desnecessaria
3. Impede o envio via fetch/AJAX

Por isso `event.preventDefault()` e sempre a primeira linha do handler — antes de qualquer outra logica.

## Data atual no input — a experiencia do usuario

O instrutor observa que sem inicializacao, o input mostra o placeholder "dd/mm/aaaa" — que nao ajuda o usuario. Ao pre-carregar com a data atual:

1. O usuario ve imediatamente qual e a data de hoje
2. Reduz cliques necessarios (se o agendamento for para hoje, nao precisa selecionar)
3. O calendario abre ja posicionado na data correta

## Bloqueio de datas passadas com `.min`

A propriedade `min` do input HTML5 `type="date"` impede nativamente a selecao de datas anteriores. O instrutor destaca: "o certo e nao deixar fazer um agendamento para ontem, que ja passou."

Isso e uma validacao no front-end — ainda precisa de validacao no back-end, mas melhora a UX impedindo erros obvios.

## DRY — extraindo `inputToday`

O instrutor percebe a repeticao ao usar o mesmo `dayjs(new Date()).format("YYYY-MM-DD")` tanto para `.value` quanto para `.min`. A solucao: extrair em uma constante `inputToday`.

A justificativa: "se eu quiser mudar aqui, nao preciso sair mudando nos dois lugares." Esse e o principio DRY (Don't Repeat Yourself) aplicado de forma pratica e simples.

## Formato `YYYY-MM-DD`

O input HTML5 `type="date"` exige internamente o formato ISO `YYYY-MM-DD`, independente de como o navegador exibe para o usuario. O instrutor usa `dayjs().format("YYYY-MM-DD")` especificamente por esse motivo — o `.value` precisa estar nesse formato para funcionar corretamente.