# Deep Explanation: Manipulacao de Estilos via DOM

## Duas abordagens para estilizar elementos com JS

O instrutor apresenta duas estrategias distintas, cada uma com seu caso de uso:

### 1. classList — Manipulacao de classes CSS

A propriedade `classList` do elemento DOM expoe metodos para gerenciar as classes CSS aplicadas:

- **`add('classe')`** — Adiciona a classe ao elemento. Se ja existe, nao duplica.
- **`remove('classe')`** — Remove a classe. Se nao existe, nao da erro.
- **`toggle('classe')`** — Comportamento inteligente: adiciona se ausente, remove se presente.
- **`contains('classe')`** — Retorna boolean (util para verificacoes, mas toggle elimina a necessidade na maioria dos casos).

**Por que preferir classList:** O estilo fica definido no CSS (onde pertence). O JS apenas controla QUANDO aplicar. Isso mantem a separacao de responsabilidades e facilita manutencao — o designer pode mudar a aparencia sem tocar no JS.

### 2. element.style — Propriedades inline

Acessa diretamente as propriedades CSS do elemento, equivalente a escrever `style="..."` no HTML.

**Conversao de nomes:** Propriedades CSS com hifen usam camelCase no JS:
- `background-color` → `backgroundColor`
- `font-size` → `fontSize`
- `border-radius` → `borderRadius`
- `z-index` → `zIndex`

**Valores sao sempre strings:** `element.style.fontSize = '16px'` (com unidade).

### Quando usar cada abordagem

O instrutor demonstra que classes pre-definidas (como `inputError` no CSS) sao a abordagem preferida para estilos conhecidos. O `element.style` e reservado para quando o valor e dinamico.

## O poder do toggle

O instrutor enfatiza toggle como especialmente util para padroes de UI comuns:

- **Modal:** Usuario clica no botao → `toggle('visible')` abre. Clica no X → `toggle('visible')` fecha.
- **Menu hamburger:** Clica no icone → `toggle('open')` abre/fecha.
- **Acordeao:** Clica no header → `toggle('expanded')` expande/colapsa.

A elegancia e que **um unico metodo** substitui toda a logica condicional de verificar estado atual e decidir o que fazer.

## Seletores no querySelector

O instrutor mostra que `querySelector` aceita qualquer seletor CSS valido:
- `'#name'` — por ID (mais especifico)
- `'button'` — por tag (funciona se so tem um, mas arriscado)
- `'.classe'` — por classe

Ele nota que usar a tag direto (`'button'`) funciona quando so existe um elemento daquele tipo, mas geralmente e melhor usar ID para pegar um elemento especifico.

## Contexto pratico: validacao de formulario

O exemplo do `inputError` simula um cenario real: quando o usuario submete um formulario com campo invalido, o JS adiciona a classe de erro visualmente (borda vermelha). Quando o usuario corrige, remove a classe. Esse padrao e a base de toda validacao visual de formularios.