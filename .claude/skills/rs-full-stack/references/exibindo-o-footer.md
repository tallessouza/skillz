---
name: rs-full-stack-exibindo-o-footer
description: "Applies DOM class toggling patterns to show/hide elements dynamically with classList.add/remove. Use when user asks to 'show an element', 'toggle visibility', 'hide a section', 'display results', or 'manipulate CSS classes via JavaScript'. Enforces try-catch around DOM manipulation with graceful show/hide on success/error. Make sure to use this skill whenever toggling element visibility with JavaScript classList API. Not for CSS-only solutions, animations, or framework-specific conditional rendering."
---

# Exibindo Elementos Dinamicamente com classList

> Controle a visibilidade de elementos alternando classes CSS via JavaScript, sempre dentro de try-catch para garantir fallback visual em caso de erro.

## Rules

1. **Selecione elementos com querySelector usando contexto hierarquico** — `document.querySelector("main footer")` nao `document.querySelector("footer")`, porque garante que voce pega o elemento correto quando existem multiplos footers ou elementos similares
2. **Use classList.add/remove, nunca style.display direto** — porque classes CSS sao reutilizaveis, testáveis e separam responsabilidades (JS controla estado, CSS controla aparencia)
3. **Envolva manipulacao DOM em try-catch** — classList.add no try, classList.remove no catch, porque erros na logica de conversao/processamento devem ocultar resultados parciais
4. **Organize selecoes de elementos em um unico bloco** — agrupe todos os querySelector juntos no topo, porque facilita manutencao e visualizacao de dependencias do DOM
5. **Use classes semanticas com nome descritivo** — `show-result` nao `visible` ou `active`, porque o nome comunica a intencao (mostrar resultado) nao o efeito generico

## How to write

### Selecao organizada de elementos

```javascript
// Obtendo os elementos do formulario
const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const currency = document.querySelector("#currency")
const footer = document.querySelector("main footer")
```

### Toggle de visibilidade com try-catch

```javascript
try {
  // Logica de processamento aqui...

  // Aplica a classe que exibe o footer com o resultado
  footer.classList.add("show-result")
} catch (error) {
  // Remove a classe do footer, removendo ele da tela
  footer.classList.remove("show-result")
  alert("Nao foi possivel converter. Tente novamente mais tarde.")
  console.log(error)
}
```

## Example

**Before (sem controle de visibilidade):**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()
  const value = amount.value
  convertCurrency(value, 5.27, "$")
  // Footer fica sempre visivel ou sempre oculto
}
```

**After (com toggle dinamico via classList):**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  try {
    const value = amount.value
    convertCurrency(value, 5.27, "$")

    // Aplica a classe que exibe o footer com o resultado
    footer.classList.add("show-result")
  } catch (error) {
    // Remove a classe do footer, removendo ele da tela
    footer.classList.remove("show-result")
    alert("Nao foi possivel converter. Tente novamente mais tarde.")
    console.log(error)
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento deve aparecer apos acao do usuario | classList.add dentro do try |
| Erro no processamento | classList.remove no catch para ocultar resultado parcial |
| Multiplos elementos do mesmo tipo no DOM | Use seletor hierarquico: `"main footer"` |
| Varios querySelector no arquivo | Agrupe todos no topo em bloco comentado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `footer.style.display = "block"` | `footer.classList.add("show-result")` |
| `footer.style.display = "none"` | `footer.classList.remove("show-result")` |
| `document.querySelector("footer")` sem contexto | `document.querySelector("main footer")` |
| Manipulacao DOM sem try-catch | Envolva em try-catch com fallback visual |
| `footer.className = "show-result"` | `footer.classList.add("show-result")` (preserva outras classes) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre classList vs style direto, analogias do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exibindo-o-footer/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exibindo-o-footer/references/code-examples.md)
