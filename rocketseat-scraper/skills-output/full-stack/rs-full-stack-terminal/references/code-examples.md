# Code Examples: Terminal — Configuracao de Ambiente

## Comandos basicos demonstrados na aula

### Listar arquivos e diretorios

```bash
# Listar conteudo do diretorio atual
ls
```

O instrutor usa `ls` para mostrar que o terminal exibe os mesmos arquivos visiveis no explorador grafico.

### Navegacao entre diretorios

```bash
# Entrar em um diretorio
cd nome-do-diretorio

# Voltar um nivel
cd ..

# Ir para o diretorio home
cd ~
```

### Verificar diretorio atual

```bash
pwd
# Output exemplo: /home/usuario/projects
```

## Configuracao do Git Bash no VS Code

### Via dropdown (metodo demonstrado na aula)

1. Abrir terminal: `Ctrl+J` ou `Cmd+J`
2. Clicar no dropdown ao lado do `+` no painel do terminal
3. Selecionar "Git Bash"
4. Fechar terminal atual (icone de lixeira)
5. Abrir novo terminal — agora usara Git Bash

### Via settings.json (alternativa programatica)

```json
{
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

## Verificacao rapida de qual shell esta ativo

```bash
# No Bash/Git Bash:
echo $SHELL
# Output: /bin/bash ou similar

# No ZSH:
echo $SHELL
# Output: /bin/zsh
```

## Diferenca pratica entre shells no Windows

```powershell
# PowerShell — barras invertidas, comandos diferentes
dir C:\Users\usuario\projetos
```

```bash
# Git Bash — barras normais, comandos Unix
ls /c/Users/usuario/projetos
```

O Git Bash traduz os paths do Windows para formato Unix automaticamente, eliminando a incompatibilidade.