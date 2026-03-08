---
name: rs-full-stack-design-figma
description: "Configures Figma setup and project duplication workflow for development teams. Use when user asks to 'setup Figma', 'duplicate a Figma project', 'configure design tools', or 'prepare design environment'. Covers account creation, project duplication, and file organization. Make sure to use this skill whenever setting up a new project's design workflow. Not for creating designs, prototyping, or advanced Figma features like components or auto-layout."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: developer-tools
  tags: [Figma, design, setup, project-duplication, workflow]
---

# Design - Figma: Setup e Duplicação de Projetos

> Configure o Figma e duplique projetos de referência para manter uma cópia editável na sua pasta pessoal.

## Prerequisites

- Conta no Figma (gratuita em [figma.com](https://www.figma.com/))
- Login ativo (pode usar conta Google)

## Steps

### Step 1: Criar conta e fazer login

1. Acessar [figma.com](https://www.figma.com/)
2. Criar conta (Google ou email)
3. Fazer login — a página inicial aparecerá vazia inicialmente

### Step 2: Abrir projeto de referência

1. Abrir o link do projeto compartilhado (fornecido na aula ou equipe)
2. O projeto abrirá em modo visualização

### Step 3: Duplicar o projeto

1. Clicar no botão de duplicar projeto (menu superior)
2. O Figma salva automaticamente uma cópia na sua pasta pessoal
3. Verificar em "Seus arquivos" que o projeto duplicado aparece

### Step 4: Editar livremente

1. Abrir o projeto duplicado — agora com permissão total de edição
2. Modificar conforme necessário para o desenvolvimento

## Output format

Após a duplicação, a estrutura esperada no Figma:

```
Seus Arquivos/
└── {Nome do Projeto} (copy)   ← versão editável
```

## Error handling

- Se o projeto não aparece após duplicar: recarregar a página de arquivos
- Se não consegue editar: verificar se abriu a cópia (não o original)
- Se login falha com Google: tentar email/senha direto no Figma

## Verification

- [ ] Projeto duplicado aparece em "Seus arquivos"
- [ ] Consegue selecionar e mover elementos no projeto duplicado
- [ ] Alterações são salvas automaticamente

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Projeto nao aparece apos duplicar | Pagina nao recarregou | Recarregue a pagina de "Seus arquivos" |
| Nao consigo editar elementos | Abriu o projeto original, nao a copia | Feche e abra a copia em "Seus arquivos" |
| Login com Google falha | Problema temporario do provedor | Tente criar conta com email/senha diretamente |
| Projeto duplicado perdeu assets | Assets de time nao sao copiados | Exporte manualmente os assets necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o papel do Figma no fluxo de desenvolvimento
- [code-examples.md](references/code-examples.md) — Exemplos práticos de uso do Figma em projetos full-stack