# Deep Explanation: Evento de Carregamento do Conteudo

## Por que DOMContentLoaded e nao window.onload?

O `DOMContentLoaded` dispara quando o HTML foi completamente parseado e o DOM construido, sem esperar CSS, imagens ou subframes. Isso significa que o JavaScript pode manipular elementos mais cedo. O `window.onload` so dispara quando TUDO carregou (imagens, fonts, etc.), causando atraso desnecessario.

## O erro classico: DOMContentLoad vs DOMContentLoaded

O instrutor cometeu esse erro ao vivo — escreveu `DOMContentLoad` sem o "ed" no final. O resultado: **falha silenciosa**. O addEventListener simplesmente registra um listener para um evento que nunca vai disparar. Nao ha erro no console. Nada acontece. Esse e um dos bugs mais frustrantes em vanilla JS porque nao ha feedback.

**Dica de debug:** se o callback do addEventListener nao executa, o primeiro lugar para verificar e a grafia do nome do evento.

## Separacao de responsabilidades: por que load.js separado?

O instrutor enfatiza que o evento de carregamento da pagina nao e responsabilidade do formulario (`submit.js`). A logica e:

- `submit.js` — captura dados do formulario, data selecionada, define data minima
- `load.js` — reage ao DOM estar pronto, renderiza conteudo dinamico

Essa separacao por **evento** (submit vs load) e mais intuitiva do que separar por **feature** nesse caso, porque o load afeta a pagina inteira, nao so o formulario.

## Estrategia de comentar HTML em vez de deletar

O instrutor deliberadamente NAO deletou o HTML estatico dos horarios. Ele comentou, mantendo um exemplo por periodo (manha, tarde, noite). A razao e pedagogica e pratica:

1. **Referencia visual** — quem olha o HTML entende a estrutura esperada
2. **Debug facil** — pode descomentar para testar sem JS
3. **Organizacao** — separar os comentarios por periodo (`morning`, `afternoon`, `night`) mantem a estrutura legivel

Ele tambem corrigiu os data-attributes ao vivo: `period="morning"`, `period="afternoon"`, `period="night"`.

## Filtragem de horarios passados — o raciocinio

O instrutor usa a analogia: "sao quase 5 horas da tarde, entao nao posso agendar para 7 ou 9 da manha porque ja passou". O array de horarios de abertura do salao (criado em aula anterior) serve como base, e o filtro compara cada horario com `new Date()` para eliminar horarios no passado.

Isso ja foi feito para **datas** (bloqueando datas passadas no calendario/input), e agora se aplica a mesma logica para **horarios** dentro do dia selecionado. So filtra horarios passados se a data selecionada for HOJE — se for amanha ou depois, todos os horarios ficam disponiveis.

## Webpack Dev Server e hot reload

O instrutor menciona que ao salvar o arquivo, o "WebpackServer ja fez o reload" automaticamente. Isso e o Hot Module Replacement (HMR) do Webpack Dev Server. Para fins do skill, o ponto relevante e: se voce esta usando um bundler com dev server, nao precisa recarregar manualmente a pagina para testar mudancas no JS.