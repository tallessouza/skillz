---
name: rs-full-stack-extensao-do-tailwind-css
description: "Guides installation and usage of Tailwind CSS IntelliSense extension in VS Code for autocomplete, color previews, and responsive unit hints. Use when user asks to 'setup Tailwind', 'install Tailwind extension', 'configure VS Code for Tailwind', 'Tailwind autocomplete', or 'Tailwind IntelliSense'. Make sure to use this skill whenever setting up a Tailwind CSS development environment or troubleshooting missing Tailwind suggestions in VS Code. Not for Tailwind class usage patterns, responsive design strategies, or theme configuration."
---

# Extensão do Tailwind CSS — IntelliSense no VS Code

> Instale e configure o Tailwind CSS IntelliSense no VS Code para obter autocomplete de classes, preview de cores e informações de unidades responsivas.

## Prerequisites

- VS Code instalado
- Projeto com Tailwind CSS configurado (`tailwind.config.js` ou `tailwind.config.ts` presente)

## Steps

### Step 1: Instalar a extensão

1. Abrir o painel de extensões no VS Code (Ctrl+Shift+X)
2. Pesquisar por **Tailwind CSS IntelliSense** (publisher: Tailwind Labs)
3. Clicar em **Install**
4. Se o autocomplete não funcionar imediatamente, fechar e reabrir o VS Code

### Step 2: Usar o autocomplete

```html
<!-- Digitar o prefixo da classe e Ctrl+Space para sugestões -->
<p class="text-">
  <!-- Aparece lista de cores: text-red-500, text-blue-300, etc. -->
  <!-- Aparece lista de tamanhos: text-sm, text-lg, text-2xl, etc. -->
</p>
```

### Step 3: Interpretar as informações exibidas

```
text-sm   → font-size: 0.875rem (14px)
text-2xl  → font-size: 1.5rem (24px)
font-bold → font-weight: 700
```

A extensão mostra o valor em `rem` e o equivalente em `px`, porque isso elimina a necessidade de consultar documentação para saber o tamanho real.

## Output format

Após instalação, ao digitar qualquer classe Tailwind seguida de `-`, o VS Code exibe:
- Lista de valores disponíveis (cores, tamanhos, pesos)
- Preview visual de cores (quadrado colorido ao lado da sugestão)
- Valor CSS equivalente (rem e px)

## Error handling

- Se sugestões não aparecem após instalar: fechar VS Code completamente e reabrir
- Se ainda não funciona: verificar se `tailwind.config.js` existe na raiz do projeto
- Atalho para forçar sugestões: `Ctrl+Space` dentro do atributo `class`

## Verification

- Digitar `text-` dentro de um atributo `class` e pressionar `Ctrl+Space`
- Deve aparecer lista com cores e tamanhos com previews visuais

## Heuristics

| Situação | Ação |
|----------|------|
| Autocomplete não aparece | Fechar e reabrir VS Code após instalação |
| Precisa saber tamanho em px | Passar o mouse sobre a classe — extensão mostra rem e px |
| Muitas classes no className | Normal no Tailwind — o custo-benefício compensa pela velocidade de desenvolvimento |
| Não lembra nome da cor | Digitar `text-` ou `bg-` e navegar pelas sugestões |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre produtividade com IntelliSense e adaptação ao Tailwind
- [code-examples.md](references/code-examples.md) — Exemplos práticos de autocomplete com cores, tamanhos e propriedades