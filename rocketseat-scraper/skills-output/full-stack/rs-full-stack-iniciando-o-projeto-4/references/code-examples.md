# Code Examples: Iniciando Projeto HTML com Git

## Exemplo 1: Estrutura HTML gerada pelo Emmet

Ao digitar `!` + Tab no VS Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
```

Apos ajustes do instrutor:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página de Receita</title>
</head>
<body>

</body>
</html>
```

Mudancas feitas:
- `lang="en"` → `lang="pt-br"`
- `<title>Document</title>` → `<title>Página de Receita</title>`

## Exemplo 2: Inicializacao git via terminal

```bash
# Iniciar repositorio git no diretorio atual
git init .

# Verificar status (deve mostrar index.html como untracked)
git status

# Adicionar todos os arquivos ao stage area
git add .

# Fazer o commit inicial
git commit -m "initial commit"

# Verificar que o commit foi feito
git log --oneline
# Output esperado: abc1234 initial commit
```

## Exemplo 3: Inicializacao git via VS Code UI

1. Abrir aba Source Control (icone de branches na sidebar)
2. Clicar em "Initialize Repository"
3. `index.html` aparece em "Changes" com `U` (untracked)
4. Clicar no `+` ao lado do arquivo para mover ao stage area
5. Digitar "initial commit" no campo de mensagem
6. Clicar no checkmark ou Ctrl+Enter para commitar

## Exemplo 4: Configurar git bash no Windows

No VS Code:
1. Abrir terminal (Ctrl+`)
2. Ao lado do `+`, clicar na seta para baixo
3. Selecionar "Git Bash"
4. Terminal abre com prompt do bash

Para definir como padrao:
```json
// settings.json do VS Code
{
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

## Variacao: Projeto com CSS desde o inicio

```bash
mkdir projeto && cd projeto
touch index.html style.css
```

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página de Receita</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

</body>
</html>
```

```bash
git init .
git add index.html style.css
git commit -m "initial commit: HTML structure and empty stylesheet"
```