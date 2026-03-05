# Code Examples: Ambiente de Desenvolvimento Web

## Links oficiais das ferramentas

### Navegadores
- Chrome: https://www.google.com/chrome/
- Edge: https://www.microsoft.com/edge
- Firefox: https://www.mozilla.org/firefox/
- Safari: pre-instalado no macOS

### Editores de codigo
- VS Code (local): https://code.visualstudio.com/
- VS Code (online): https://vscode.dev/
- Front Editor: https://front-editor.dev/

### Design
- Figma: https://www.figma.com/

### Anotacoes e mapas mentais
- Whimsical: https://whimsical.com/

## Verificacao de instalacao

### Verificar se VS Code esta instalado
```bash
code --version
```

### Abrir projeto no VS Code via terminal
```bash
# Navegar ate a pasta do projeto
cd ~/meu-projeto

# Abrir VS Code na pasta atual
code .
```

### Abrir VS Code online
```
# No navegador, acesse:
https://vscode.dev/

# Ou, em qualquer repositorio GitHub, pressione "." (ponto)
# para abrir o editor online integrado
```

## Configuracao inicial minima do VS Code

### settings.json basico para iniciantes
```json
{
  "editor.fontSize": 16,
  "editor.lineHeight": 26,
  "editor.fontFamily": "Fira Code, monospace",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "files.autoSave": "afterDelay",
  "emmet.syntaxProfiles": {
    "html": "html"
  }
}
```

## Extensoes essenciais para o curso (VS Code)

```
# Instalar via terminal
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.LiveServer
code --install-extension bradlc.vscode-tailwindcss
```

## Atalhos uteis do navegador (DevTools)

```
# Abrir DevTools
F12 ou Ctrl+Shift+I (Cmd+Option+I no Mac)

# Console
Ctrl+Shift+J (Cmd+Option+J no Mac)

# Inspecionar elemento
Ctrl+Shift+C (Cmd+Shift+C no Mac)

# Modo responsivo
Ctrl+Shift+M (Cmd+Shift+M no Mac)
```

## Estrutura de pasta basica para exercicios do curso

```
meu-projeto/
├── index.html
├── style.css
└── script.js
```

### index.html minimo
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Meu Projeto</title>
</head>
<body>
  <h1>Hello World</h1>
  <script src="script.js"></script>
</body>
</html>
```