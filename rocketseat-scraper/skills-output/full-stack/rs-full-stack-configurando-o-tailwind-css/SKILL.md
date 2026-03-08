---
name: rs-full-stack-configurando-o-tailwind-css
description: "Applies Tailwind CSS theme customization when configuring project colors, fonts, and custom sizes using the @theme directive. Use when user asks to 'customize Tailwind theme', 'add custom colors', 'change default font', 'create custom font size', or 'configure Tailwind CSS'. Covers @theme block in index.css, CSS variable overrides, font-family defaults, and custom rem calculations. Make sure to use this skill whenever setting up a Tailwind CSS design system or adding project-specific design tokens. Not for Tailwind utility class usage, component styling, or responsive layout patterns."
---

# Configurando o Tailwind CSS

> Personalize o tema do Tailwind CSS usando a diretiva `@theme` no `index.css` para definir cores, fontes e tamanhos específicos do projeto.

## Prerequisites

- Tailwind CSS v4+ instalado e configurado no projeto
- Arquivo `index.css` com o import do Tailwind (`@import "tailwindcss"`)
- Fonte desejada importada via Google Fonts (link no HTML ou `@import`)

## Steps

### Step 1: Adicionar o bloco @theme

No `index.css`, após o `@import "tailwindcss"`, adicionar o bloco `@theme`:

```css
@import "tailwindcss";

@theme {
  /* variáveis do tema aqui */
}
```

### Step 2: Customizar cores

Usar variáveis CSS no formato `--color-{nome}-{peso}` para definir cores do projeto:

```css
@theme {
  --color-gray-100: #1f2523;
  --color-gray-200: #4d5c57;
  --color-gray-300: #cdd5d2;
  --color-gray-400: #e4ece9;
  --color-gray-500: #f9fbfa;

  --color-green-100: #1f8459;
  --color-green-200: #2cb178;
}
```

As cores definidas no `@theme` sobrescrevem as cores padrão do Tailwind com o mesmo nome. Usar com classes utilitárias: `text-green-200`, `bg-gray-100`.

### Step 3: Definir fonte padrão

Usar `--default-font-family` para definir a font-family padrão de toda a aplicação:

```css
@theme {
  --default-font-family: "Open Sans", serif;
}
```

O valor segue o mesmo formato do CSS `font-family` — nome da fonte entre aspas, seguido de fallback.

### Step 4: Criar tamanhos de fonte customizados

Para tamanhos que não existem no Tailwind (ex: `xxs` = 10px), usar a variável `--text-{nome}` com valor em `rem`:

```css
@theme {
  --text-xxs: 0.625rem;
}
```

**Cálculo:** dividir o valor desejado em pixels por 16 (tamanho base). Exemplo: `10 / 16 = 0.625rem`.

Usar com a classe `text-xxs` no HTML.

## Output format

Arquivo `index.css` completo:

```css
@import "tailwindcss";

@theme {
  --default-font-family: "Open Sans", serif;

  --color-gray-100: #1f2523;
  --color-gray-200: #4d5c57;
  --color-gray-300: #cdd5d2;
  --color-gray-400: #e4ece9;
  --color-gray-500: #f9fbfa;

  --color-green-100: #1f8459;
  --color-green-200: #2cb178;

  --text-xxs: 0.625rem;
}
```

## Error handling

- Se a cor customizada não aparece: verificar se o nome da variável segue o padrão `--color-{nome}-{peso}` e se o bloco `@theme` está após o `@import`
- Se a fonte não muda: verificar se o import da fonte (Google Fonts) está no HTML e se o nome da fonte está exatamente igual ao `font-family` do Google Fonts
- Se o tamanho customizado não funciona: verificar se usou `rem` (não `px`) e se o cálculo `valor / 16` está correto

## Verification

- Alterar uma classe de cor no HTML (ex: `text-green-200`) e confirmar que a cor renderizada corresponde ao hex definido no tema
- Inspecionar qualquer texto no DevTools e verificar que o `font-family` mostra a fonte definida
- Usar a classe customizada (ex: `text-xxs`) e verificar no DevTools que o `font-size` calculado corresponde ao valor esperado em pixels

## Heuristics

| Situação | Ação |
|----------|------|
| Cores do design não existem no Tailwind | Criar variáveis `--color-{nome}-{peso}` no `@theme` |
| Precisa de fonte específica do projeto | Importar via Google Fonts + `--default-font-family` no `@theme` |
| Tamanho de fonte não existe no Tailwind | Calcular `px / 16 = rem` e criar `--text-{nome}` |
| Quer sobrescrever cor padrão do Tailwind | Usar o mesmo nome de variável (ex: `--color-red-800`) no `@theme` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o sistema de temas, variáveis disponíveis e como o @theme sobrescreve valores
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações e cenários adicionais