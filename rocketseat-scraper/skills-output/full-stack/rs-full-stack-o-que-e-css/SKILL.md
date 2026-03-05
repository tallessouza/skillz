---
name: rs-full-stack-o-que-e-css
description: "Applies CSS foundational mental model when writing or reviewing stylesheets. Use when user asks to 'style a page', 'add CSS', 'write styles', 'create a stylesheet', or 'explain CSS basics'. Enforces property-value pair thinking and cascade awareness in every styling decision. Make sure to use this skill whenever generating CSS or explaining styling concepts to beginners. Not for JavaScript logic, HTML structure, or backend code."
---

# O que é CSS

> CSS é um arquivo onde se empilham pares de propriedade e valor, um após o outro, para modificar a aparência do HTML — essa é a regra de cascata.

## Key concept

CSS (Cascading Style Sheet — Folha de Estilo em Cascata) recebeu esse nome porque o princípio fundamental é o empilhamento: cada declaração é um par propriedade-valor terminado em ponto e vírgula, e o acúmulo dessas declarações transforma o HTML visualmente. Cores, posicionamentos e até animações são definidos dessa forma.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa mudar aparência do HTML | Criar/editar arquivo `.css` com pares propriedade-valor |
| Estilo não está funcionando | Verificar a cascata — estilos posteriores sobrescrevem anteriores |
| Dúvida sobre o que CSS pode fazer | Cores, posicionamentos, tamanhos, animações — tudo visual |
| Código misturando lógica e estilo | Separar estilos em arquivo `.css` dedicado |

## How to think about it

### O modelo mental da cascata

Pense em CSS como uma pilha de instruções visuais. Cada linha adiciona ou sobrescreve um estilo anterior. A ordem importa — o que vem depois tem prioridade.

```css
/* Cada declaração é propriedade: valor; */
background-color: #ff0000;
color: white;
font-size: 16px;
```

### Propriedade + Valor = Unidade fundamental

Tudo em CSS se resume a aprender novas propriedades e seus valores possíveis. Conforme se estuda mais, o vocabulário de propriedades cresce, e com ele a capacidade de estilização.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| CSS é só para cores | CSS controla cores, posicionamento, layout, animações, responsividade |
| A ordem não importa | A cascata significa que a ordem das declarações afeta o resultado final |
| CSS é opcional | Todo front-end web depende de CSS para apresentação visual |
| Precisa decorar tudo | O modelo é sempre o mesmo: propriedade + valor. Aprender CSS é expandir esse vocabulário |

## When to apply

- Sempre que gerar HTML que precisa de estilização visual
- Ao criar componentes front-end
- Ao revisar código que mistura estilos inline com arquivos CSS
- Ao explicar conceitos de estilização web para iniciantes

## Limitations

- CSS não controla lógica ou comportamento — isso é JavaScript
- CSS não define estrutura do conteúdo — isso é HTML
- Regras avançadas (especificidade, herança, media queries) vão além deste modelo básico

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cascata, analogias e contexto histórico
- [code-examples.md](references/code-examples.md) — Exemplos de código expandidos com variações