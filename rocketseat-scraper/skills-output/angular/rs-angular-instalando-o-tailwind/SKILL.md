---
name: rs-angular-instalando-o-tailwind
description: "Applies Tailwind CSS installation and configuration steps in Angular projects. Use when user asks to 'install Tailwind', 'setup Tailwind in Angular', 'configure Tailwind CSS', 'add Tailwind to project', or 'style Angular with Tailwind'. Follows pinned dependency versions and required PostCSS config. Make sure to use this skill whenever setting up Tailwind in any Angular project. Not for React, Next.js, or non-Angular Tailwind setups."
---

# Instalando Tailwind CSS no Angular

> Instale Tailwind CSS com versoes fixas e configure PostCSS para garantir reproducibilidade no projeto Angular.

## Prerequisites

- Projeto Angular criado com Angular CLI
- Node.js 18+ e npm
- VS Code (para IntelliSense)

## Steps

### Step 1: Instalar dependencias com versoes fixas

Sempre fixe versoes para evitar quebras futuras quando o Tailwind atualizar.

```bash
npm install tailwindcss@4.1.4 @tailwindcss/postcss@4.1.4 postcss@8.5.3 --force
```

Verifique no `package.json` que as tres dependencias aparecem com as versoes corretas.

### Step 2: Criar arquivo PostCSS na raiz

Crie `.postcssrc.json` na raiz do projeto (mesmo nivel do `package.json`):

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

O nome deve ser exatamente `.postcssrc.json` — erro no nome causa falha silenciosa.

### Step 3: Importar Tailwind no styles.css

Em `src/styles.css`, adicione:

```css
@import "tailwindcss";
```

Remova qualquer conteudo padrao que o Angular tenha gerado nesse arquivo.

### Step 4: Testar a instalacao

Substitua o conteudo de `src/app/app.component.html` por:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

Execute `npm run start` (ou `ng serve` se CLI global instalado) e verifique que o texto aparece com estilos aplicados.

### Step 5: Instalar extensao IntelliSense

No VS Code, instale a extensao **Tailwind CSS IntelliSense**. Reinicie o VS Code se o autocomplete nao aparecer imediatamente.

## Output format

Apos completar, o projeto deve ter:
- `package.json` com `tailwindcss`, `@tailwindcss/postcss`, `postcss` nas versoes fixas
- `.postcssrc.json` na raiz
- `src/styles.css` com `@import "tailwindcss"`
- IntelliSense funcionando (hover mostra propriedades CSS da classe)

## Error handling

- Se `npm install` falhar sem `--force`: adicione a flag `--force` ao comando
- Se classes nao aplicam estilos: verifique o nome exato do `.postcssrc.json`
- Se IntelliSense nao funciona: feche e reabra o VS Code

## Heuristics

| Situacao | Acao |
|----------|------|
| Versao diferente da documentada | Use as versoes fixas desta skill, nao `latest` |
| Projeto com CSS pre-existente | Mantenha o CSS existente, apenas adicione o import do Tailwind |
| Multiplos projetos no monorepo | `.postcssrc.json` vai na raiz do projeto Angular, nao do monorepo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
