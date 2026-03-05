---
name: rs-full-stack-terminal
description: "Configures terminal environment for cross-platform development workflows. Use when user asks to 'setup terminal', 'configure VS Code terminal', 'install git bash', 'setup dev environment', or mentions terminal issues on Windows/Linux/Mac. Guides correct terminal selection per OS and VS Code integration. Make sure to use this skill whenever helping with initial environment setup or terminal configuration. Not for shell scripting, CLI tool development, or advanced terminal customization like themes/plugins."
---

# Terminal — Configuracao de Ambiente

> Garantir que o terminal usado seja consistente entre plataformas para evitar problemas de compatibilidade com comandos.

## Rules

1. **Windows: usar Git Bash** — nao PowerShell, nao CMD, porque Git Bash usa barras normais (`/`) e comandos Unix-like compativeis com tutoriais e projetos multiplataforma
2. **Linux: terminal padrao (Bash)** — ja vem configurado corretamente, nenhuma instalacao adicional necessaria
3. **Mac: terminal padrao ou ZSH** — ambos funcionam, ZSH ja e o padrao no macOS moderno
4. **VS Code: abrir terminal integrado** — usar `Ctrl+J` (Windows/Linux) ou `Cmd+J` (Mac) para toggle do terminal sem sair do editor
5. **VS Code: verificar qual shell esta ativo** — olhar no canto do painel do terminal qual shell esta selecionado, porque o VS Code pode abrir PowerShell por padrao no Windows

## Steps

### Step 1: Instalar Git Bash (Windows apenas)

Acessar o site oficial do Git (`git-scm.com`), fazer download para Windows e instalar com opcoes padrao. O Git Bash vem incluido na instalacao.

### Step 2: Configurar VS Code para usar Git Bash

1. Abrir VS Code
2. Abrir terminal integrado (`Ctrl+J` ou menu Terminal > New Terminal)
3. No painel do terminal, localizar o dropdown ao lado do botao `+`
4. Selecionar **Git Bash** como shell padrao
5. Fechar o terminal atual e abrir um novo — confirmara que Git Bash esta ativo

### Step 3: Verificar funcionamento

```bash
# Testar navegacao basica
ls
cd ~/projects
pwd
```

## Output format

Terminal integrado do VS Code rodando Git Bash (Windows), Bash (Linux) ou ZSH (Mac), com comandos Unix-like funcionando corretamente.

## Error handling

- Se Git Bash nao aparece no dropdown do VS Code: reinstalar Git garantindo que a opcao "Add to PATH" esta marcada, reiniciar VS Code
- Se `ls` nao funciona: voce esta no PowerShell ou CMD, trocar para Git Bash no dropdown
- Se barras invertidas (`\`) aparecem nos paths: voce esta no terminal errado, verificar shell ativo

## Verification

- Rodar `ls` e ver listagem de arquivos no formato Unix
- Rodar `pwd` e ver o path com barras normais (`/`)
- Verificar no canto do terminal do VS Code que mostra "bash" ou "zsh"

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de terminal por plataforma
- [code-examples.md](references/code-examples.md) — Comandos basicos de navegacao e configuracao