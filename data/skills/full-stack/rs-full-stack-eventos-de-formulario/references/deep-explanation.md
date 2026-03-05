# Deep Explanation: Eventos de Formulário

## Por que addEventListener e não onsubmit?

A diferença fundamental é o modelo de registro de eventos:

### Modelo de propriedade (onsubmit, onclick, etc.)

Quando você faz `form.onsubmit = handler`, está atribuindo uma propriedade do objeto DOM. Como qualquer propriedade JavaScript, uma segunda atribuição **sobrescreve** a anterior. Isso significa que em um codebase real, se dois módulos diferentes tentarem registrar handlers no mesmo formulário via onsubmit, **só o último funciona** — e o primeiro é silenciosamente perdido. Isso é uma fonte de bugs difíceis de rastrear.

### Modelo addEventListener

`addEventListener` mantém uma **lista interna** de listeners. Cada chamada **acumula** um novo listener. Todos são executados na ordem em que foram registrados. Isso é fundamental para separação de responsabilidades — um módulo pode fazer validação, outro analytics, outro UX feedback, todos no mesmo evento.

### Demonstração do instrutor

O instrutor criou 4 listeners para provar o ponto:
- `form.onsubmit = handler1` (mensagem 1)
- `form.onsubmit = handler2` (mensagem 2)
- `form.addEventListener('submit', handler3)` (mensagem 3)
- `form.addEventListener('submit', handler4)` (mensagem 4)

Resultado: apenas mensagens 2, 3 e 4 apareceram. A mensagem 1 foi sobrescrita pela 2.

## Submit vs Click

O evento `submit` é disparado pelo **formulário** (não pelo botão) em duas situações:
1. Clique no botão de submit dentro do form
2. Pressionar Enter em qualquer input dentro do form

O evento `click` no botão captura apenas a primeira situação. Como formulários são tipicamente usados com teclado (preencheu campo → Enter), capturar apenas click deixa uma lacuna na UX.

## preventDefault

O comportamento padrão de um `<form>` ao receber submit é fazer uma requisição HTTP e recarregar a página (herança do HTML pré-SPA). Em aplicações modernas, quase sempre queremos impedir isso com `event.preventDefault()` e tratar o submit via JavaScript.

## A mesma lógica se aplica a outros eventos

O instrutor menciona que o mesmo comportamento de onsubmit vs addEventListener se aplica a onclick, onchange, etc. Todos os handlers de propriedade `on*` sofrem do mesmo problema de sobrescrita. A recomendação de usar addEventListener é universal.