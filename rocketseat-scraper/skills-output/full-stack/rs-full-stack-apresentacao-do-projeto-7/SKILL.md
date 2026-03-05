---
name: rs-full-stack-apresentacao-do-projeto-7
description: "Applies HTML form project setup structure when creating enrollment forms or multi-field HTML form projects. Use when user asks to 'create a form', 'setup form project', 'build enrollment form', 'organize form assets', or 'export SVG icons from Figma'. Covers folder structure, SVG asset export workflow, and icon organization. Make sure to use this skill whenever starting an HTML form project with custom inputs like radio and checkbox. Not for form validation logic, backend processing, or JavaScript form handling."
---

# Setup de Projeto de Formulário HTML

> Organize assets, pastas e ícones SVG antes de começar a codar o formulário.

## Prerequisites

- Editor de código (VS Code)
- Acesso ao layout no Figma (style guide disponível)
- Pasta local para o projeto

## Steps

### Step 1: Criar estrutura de pastas

```
formulario-de-matricula/
├── assets/
│   ├── icons/          # Ícones SVG individuais
│   └── ilustration.svg # Ilustração principal
├── index.html
└── style.css
```

Nomeie pastas e arquivos sem acentos — evita erros causados por acentuação em paths.

### Step 2: Exportar ilustração do Figma

1. Selecionar o frame da ilustração no Figma
2. Exportar como **SVG**
3. Salvar em `assets/ilustration.svg`

### Step 3: Exportar ícones em lote

1. Clicar no primeiro ícone do grupo
2. Segurar **Shift** e clicar no último — seleciona todos
3. Clicar no **+** de export, selecionar **SVG**
4. Verificar quantas layers serão exportadas (ex: "Export 5 layers", "Export 8 layers")
5. Exportar para `assets/icons/`

### Step 4: Exportar logo

1. Selecionar o frame do logo
2. Exportar como SVG
3. Renomear para `logo.svg`
4. Salvar em `assets/`

### Step 5: Verificar assets exportados

Conferir que todos os ícones necessários estão presentes. Se faltar algum, exportar individualmente do Figma.

## Output format

```
assets/
├── icons/
│   ├── alert-circle.svg
│   ├── mail.svg
│   ├── user.svg
│   ├── lock.svg
│   └── ... (demais ícones)
├── ilustration.svg
└── logo.svg
```

## Heuristics

| Situação | Ação |
|----------|------|
| Nome de pasta/arquivo | Sem acentos, sem espaços, lowercase |
| Ícone será inline no HTML | Exportar como SVG (XML legível, inserível direto no HTML) |
| Ilustração decorativa | Exportar como SVG para assets/ |
| Ícone faltando | Exportar individualmente do Figma depois |

## Elementos do formulário cobertos neste projeto

| Tipo de input | Detalhe |
|---------------|---------|
| Texto | Campos de entrada padrão |
| Data | Seletor de data |
| Seleção | Dropdowns |
| Textarea | Texto multilinha |
| Upload de arquivo | Envio de arquivos |
| Radio | Customização via CSS (desafiador) |
| Checkbox | Customização via CSS (desafiador) |

## Anti-patterns

| Evite | Faça |
|-------|------|
| Acentos em nomes de pasta (`formulário/`) | Sem acentos (`formulario/`) |
| Exportar ícones como PNG | Exportar como SVG (são XML, inseríveis no HTML) |
| Todos os assets soltos na raiz | Organizar em `assets/icons/`, `assets/` |
| Exportar ícones um por um | Selecionar todos com Shift e exportar em lote |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estrutura de projeto e SVG como XML
- [code-examples.md](references/code-examples.md) — Exemplos de estrutura de pastas e workflow de export