---
name: rs-full-stack-ferramentas-e-ambiente
description: "Applies VS Code setup with Zen Mode and GitHub Copilot configuration for focused coding environments. Use when user asks to 'setup vscode', 'configure copilot', 'zen mode settings', 'clean coding environment', or 'vscode for learning'. Ensures optimal font sizes, distraction-free mode, and AI assistant integration. Make sure to use this skill whenever setting up a new VS Code environment for programming study. Not for terminal emulator setup, Neovim config, or non-VS Code editors."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: dev-environment
  tags: [vscode, zen-mode, copilot, setup, editor, font-size]
---

# Ferramentas e Ambiente — VS Code + GitHub Copilot

> Configure um ambiente limpo e focado no VS Code com Zen Mode e GitHub Copilot para maximizar o aprendizado de programacao.

## Rules

1. **Use VS Code estavel, nao Insiders** — Insiders recebe features experimentais diariamente que podem quebrar, porque estabilidade importa mais que novidade no dia a dia
2. **Ative Zen Mode para foco** — esconde activity bar, line numbers, tabs e notificacoes, porque distracao visual reduz produtividade de aprendizado
3. **Configure tamanhos de fonte adequados** — editor 18px, chat 18px, terminal 16px, porque legibilidade reduz fadiga e erros
4. **Mantenha extensoes no minimo** — comece sem extensoes alem do Copilot, porque cada extensao adiciona ruido e complexidade
5. **Use modelo "Auto" no Copilot** — nao perca tempo escolhendo modelos, porque Auto ja seleciona o melhor para cada situacao
6. **Foque na ferramenta, nao nos detalhes** — aprenda o workflow pratico antes de explorar opcoes avancadas, porque dominar o basico gera mais resultado

## Setup

### Step 1: Abrir User Settings (JSON)

```
Ctrl+P (ou Cmd+P no Mac) → digitar "> settings user" → selecionar "Open User Settings (JSON)"
```

### Step 2: Aplicar configuracoes

```json
{
  "chat.fontSize": 18,
  "editor.fontSize": 18,
  "terminal.integrated.fontSize": 16,
  "zenMode.hideActivityBar": true,
  "zenMode.centerLayout": false,
  "zenMode.fullScreen": false,
  "zenMode.hideLineNumbers": true,
  "zenMode.showTabs": "none",
  "zenMode.silentNotifications": true
}
```

### Step 3: Instalar GitHub Copilot

1. Abrir Extensions (`Ctrl+Shift+X`)
2. Buscar "GitHub Copilot"
3. Instalar a extensao oficial da GitHub
4. Clicar em "Use AI Features" quando aparecer
5. Fazer login com conta GitHub se solicitado

### Step 4: Verificar Copilot Chat

1. Abrir o chat lateral do Copilot
2. Confirmar que o modelo "Auto" esta selecionado
3. Testar com uma pergunta simples

## Heuristics

| Situacao | Faca |
|----------|------|
| VS Code com muitas extensoes | Crie um profile limpo separado para estudo |
| Copilot nao abre chat | Verifique login GitHub e se a extensao esta ativa |
| Quer experimentar features novas | Use Insiders em paralelo, mantenha estavel como principal |
| Aluno Skillz | Acesso Premium ao Copilot incluso na parceria |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Instalar dezenas de extensoes no primeiro dia | Comece apenas com Copilot, adicione conforme necessidade |
| Usar VS Code Insiders como editor principal | Use a versao estavel para trabalho real |
| Ficar trocando modelos de IA no Copilot | Deixe no "Auto" e foque no aprendizado |
| Tentar entender todas as opcoes do Copilot de uma vez | Aprenda o basico pratico primeiro |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Copilot Chat nao abre | Login GitHub ausente ou extensao desativada | Verificar login e status da extensao em Extensions |
| Zen Mode esconde demais (ex: terminal) | Configuracoes de Zen Mode muito restritivas | Ajustar `zenMode.*` no settings.json conforme necessidade |
| Fonte muito pequena ou grande | Configuracao de fontSize nao aplicada | Verificar `editor.fontSize` no User Settings JSON |
| "Use AI Features" nao aparece | Copilot nao instalado ou versao do VS Code antiga | Atualizar VS Code e reinstalar extensao Copilot |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre VS Code Insiders vs estavel, filosofia de ambiente limpo
- [code-examples.md](references/code-examples.md) — Configuracoes JSON completas e variacoes