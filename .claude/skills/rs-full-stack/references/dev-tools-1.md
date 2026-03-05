---
name: rs-full-stack-dev-tools-1
description: "Guides browser DevTools usage when user asks to 'inspect element', 'debug CSS', 'check styles', 'open DevTools', 'view box model', or 'test JavaScript in console'. Covers Elements tab (DOM, styles, computed/Box Model), Console tab (JS testing), and responsive mode. Make sure to use this skill whenever user needs to inspect, debug, or understand webpage structure in the browser. Not for Node.js debugging, backend logging, or build tool configuration."
---

# Browser DevTools

> Usar DevTools para inspecionar HTML compilado (DOM), estilos aplicados e computados, Box Model, e testar JavaScript no Console.

## Key concept

DevTools e a ferramenta de desenvolvedor embutida em todo navegador moderno (Chrome, Edge, Firefox, Safari). Cada navegador tem sua interface propria, mas os conceitos fundamentais sao os mesmos. Nao e necessario dominar tudo — aprender o suficiente para fazer boas entregas e expandir gradualmente.

## Decision framework

| Quando voce precisa | Use |
|---------------------|-----|
| Ver o HTML renderizado (DOM) | Aba Elements |
| Ver estilos aplicados a um elemento | Elements → Styles (lado direito) |
| Ver o estilo final computado | Elements → Computed |
| Entender espacamento/margens de um elemento | Elements → Computed → Box Model |
| Testar codigo JavaScript rapidamente | Aba Console |
| Simular telas menores (mobile) | Modo de responsividade (device toolbar) |
| Selecionar um elemento visualmente | Icone de selecao (inspect tool) no DevTools |

## How to access

| Metodo | Atalho |
|--------|--------|
| Menu de contexto | Clique direito → Inspect |
| Teclado (universal) | `F12` |
| Chrome/Edge (Mac) | `Cmd + Option + I` |
| Chrome/Edge (Windows/Linux) | `Ctrl + Shift + I` |

## How to think about it

### Elements: HTML aplicado vs HTML original

A aba Elements mostra o DOM — o HTML "compilado". Nao e o codigo-fonte original, e o resultado final depois que o navegador processou tudo. Quando o instrutor diz "compilado", significa: o navegador analisou todas as instrucoes e este e o estado final.

### Styles vs Computed

- **Styles** mostra todas as regras CSS aplicadas ao elemento, incluindo sobrescritas e herancas
- **Computed** mostra o resultado final apos o navegador resolver conflitos entre regras — o CSS que realmente esta em efeito

### Console como playground

O Console aceita JavaScript direto. Use para testar expressoes rapidamente:

```javascript
// Operacoes simples
1 + 1  // 2
"Hello" + " Mike"  // "Hello Mike"

// Inspecionar elementos
document.querySelector('h1')
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| DevTools e igual em todos os navegadores | A interface varia — Edge, Chrome, Safari e Firefox tem layouts diferentes, mas os conceitos sao os mesmos |
| Preciso aprender tudo do DevTools | Ninguem sabe tudo — aprenda o suficiente para suas entregas e expanda aos poucos |
| O HTML no Elements e o codigo-fonte | E o DOM (HTML compilado/processado), nao o source original |
| Styles e Computed mostram a mesma coisa | Styles mostra todas as regras aplicadas; Computed mostra apenas o resultado final |

## When to apply

- Debugar por que um elemento nao aparece ou esta mal posicionado
- Entender quais estilos estao realmente aplicados vs sobrescritos
- Verificar Box Model (margin, border, padding, content) de um elemento
- Testar snippets de JavaScript antes de colocar no codigo
- Simular visualizacao em diferentes tamanhos de tela

## Limitations

- Alguns sites bloqueiam o clique direito e inspect (mas F12 geralmente funciona)
- Alteracoes feitas no DevTools sao temporarias — recarregar a pagina perde tudo
- DevTools do navegador nao substitui ferramentas de debug server-side

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-dev-tools-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-dev-tools-1/references/code-examples.md)
