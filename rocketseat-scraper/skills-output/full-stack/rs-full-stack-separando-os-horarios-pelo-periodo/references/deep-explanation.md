# Deep Explanation: Separando Horarios por Periodo

## Por que agrupar por periodo?

O instrutor destaca que listar horarios em uma lista plana dificulta a visualizacao. Quando o usuario ve 12+ horarios seguidos (9h ate 21h), precisa fazer contagem mental para entender em que parte do dia esta. Separar em Manha/Tarde/Noite cria "chunks" cognitivos que facilitam a leitura.

## Decisao arquitetural: cabecalhos como `<li>`

Uma decisao importante da aula: os cabecalhos de periodo sao elementos `<li>` dentro da mesma `<ul>`, nao elementos `<h3>` ou `<div>` separados. Isso porque:

1. Mantem a estrutura HTML valida (so `<li>` dentro de `<ul>`)
2. Simplifica o JavaScript — tudo e `append` na mesma lista
3. A diferenciacao visual vem inteiramente do CSS via classe `hour-period`

## Funcao interna ao hoursLoad

O instrutor cria a funcao `hourHeaderAdd` DENTRO de `hoursLoad`, nao como funcao global. Isso e intencional:
- A funcao so faz sentido no contexto de carregamento de horarios
- Ela tem acesso a `hoursList` via closure
- Encapsula logica auxiliar sem poluir escopo externo

## Thresholds de periodo

Os valores 9, 13, 18 sao convencoes:
- **9h** = inicio do expediente comercial (manha)
- **13h** = apos almoco (tarde)
- **18h** = fim do expediente (noite)

A verificacao usa `===` (igualdade estrita) porque so queremos inserir o cabecalho uma vez, exatamente quando o horario coincide com o threshold.

## Tratamento de disponibilidade via CSS

O instrutor enfatiza que o bloqueio visual de horarios indisponiveis e 100% CSS:
- `cursor: not-allowed` — feedback visual imediato
- Hover desabilitado — nao mostra efeito de selecao
- Opacity reduzida — indica visualmente que esta bloqueado

A vantagem: JavaScript so precisa adicionar/remover a classe `unavailable`. Toda a logica visual fica no CSS, facilitando ajustes de design sem tocar no JS.

## Consulta ao HTML existente como referencia

O instrutor menciona que deixou o HTML estatico como referencia proposital: "por isso que eu nao apaguei tudo, deixei uma referencia pra gente ir olhando e consultando pra poder reproduzir isso dinamicamente no javascript". Essa e uma tecnica pratica — ao converter HTML estatico para dinamico, mantenha o original como referencia ate completar a conversao.

## Horario atual como criterio de disponibilidade

Os horarios disponiveis dependem do horario que o usuario esta acessando. O instrutor mostra que para ele, assistindo a aula a noite, so os horarios noturnos aparecem como disponiveis. Isso reforca que a logica de disponibilidade e dinamica e baseada em `new Date().getHours()`.