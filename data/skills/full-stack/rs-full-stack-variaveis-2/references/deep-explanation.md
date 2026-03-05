# Deep Explanation: Variáveis no CSS

## O que são Custom Properties

Variáveis CSS (oficialmente "custom properties") funcionam como em linguagens de programação: você guarda um valor e referencia pelo nome depois. A diferença crucial é que elas participam da **cascata e herança** do CSS — isso cria o conceito de escopo.

## Escopo: a ideia central

O instrutor enfatiza que escopo é o ponto mais importante de variáveis CSS. Funciona assim:

1. **`:root` = escopo global** — A pseudo-classe `:root` seleciona o elemento raiz do documento (`<html>`). Qualquer variável declarada ali é herdada por todos os elementos do DOM.

2. **Seletor específico = escopo local** — Se você redeclara `--bg-color` dentro de `body`, todos os filhos de `body` usam o novo valor. O valor em `:root` é "sombreado" (shadowed) para aquele ramo da árvore DOM.

3. **Cascata normal** — Se `body` define `--bg-color: lightgreen` e uma `div` dentro de `body` usa `var(--bg-color)`, ela recebe `lightgreen`, não o valor de `:root`. O elemento mais próximo na árvore que define a variável vence.

### Analogia do instrutor

O instrutor usa a metáfora de "pai definindo regra para filhos": quando um elemento pai redefine uma variável, ele está dizendo "daqui para frente, para todos os meus filhos, esse valor é X". Qualquer descendente herda essa redefinição.

## Regras de nomenclatura

- **Dois traços obrigatórios** (`--`) — é a sintaxe que o browser usa para distinguir custom properties de propriedades nativas
- **Sem espaços** — traços substituem espaços (`--bg-color`, não `--bg color`)
- **Sem caracteres especiais** — acentos e símbolos podem causar problemas cross-browser
- **Evitar números no início** — `--1color` é tecnicamente válido mas causa confusão

## Como a resolução funciona

```
Elemento pede var(--bg-color)
  → Tem --bg-color definido nele mesmo? Usa.
  → Não? Sobe para o pai. Tem? Usa.
  → Continua subindo até :root.
  → Não encontrou em nenhum lugar? Usa o fallback: var(--bg-color, black)
  → Sem fallback? Propriedade fica inválida.
```

## Quando usar `:root` vs seletor local

- **`:root`** — design tokens globais: cores da marca, espaçamentos base, tipografia
- **Seletor local** — variações contextuais: tema escuro em uma seção, cor diferente em um componente específico

## Diferença de Sass/LESS variables

Variáveis CSS são **runtime** (resolvidas no navegador), enquanto Sass/LESS são **compile-time**. Isso significa que CSS custom properties podem ser alteradas via JavaScript (`element.style.setProperty('--color', 'red')`) e respondem a media queries.