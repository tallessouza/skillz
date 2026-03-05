# Code Examples: Configurando o VSCode

## settings.json completo (como ensinado na aula)

```json
{
  // editor
  "editor.wordWrap": "on",
  "editor.fontSize": 18,
  "editor.lineHeight": 30,
  "editor.tabSize": 2,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,

  // explorer
  "explorer.compactFolders": false,

  // workbench
  "workbench.editor.enablePreview": false,
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "Omni",

  // prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.enable": true,
  "prettier.singleQuote": false,
  "prettier.tabWidth": 2,
  "prettier.semi": false,

  // terminal
  "terminal.integrated.fontSize": 16,
  "terminal.integrated.profiles.windows": {
    "Git Bash": {
      "source": "Git Bash"
    }
  },
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

## extensions.json completo

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "PKief.material-icon-theme",
    "rocketseat.theme-omni",
    "ritwickdey.LiveServer"
  ]
}
```

## Variacao: settings.json para macOS/Linux

No macOS e Linux, a secao de terminal muda porque Git Bash e especifico do Windows:

```json
{
  // ... mesmas configs de editor, explorer, workbench e prettier ...

  // terminal (macOS)
  "terminal.integrated.fontSize": 16,
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

```json
{
  // ... mesmas configs ...

  // terminal (Linux)
  "terminal.integrated.fontSize": 16,
  "terminal.integrated.defaultProfile.linux": "bash"
}
```

## Variacao: Prettier com aspas simples e ponto-e-virgula

Alguns projetos preferem aspas simples e ponto-e-virgula. Nesse caso:

```json
{
  "prettier.singleQuote": true,
  "prettier.semi": true
}
```

## Estrutura final do projeto

```
projeto/
├── .vscode/
│   ├── extensions.json    ← recomendacoes de extensoes
│   └── settings.json      ← configuracoes do workspace
├── index.html             ← (criado nas proximas aulas)
└── style.css              ← (criado nas proximas aulas)
```

## Como verificar se tudo esta funcionando

1. Abrir a pasta do projeto no VSCode
2. Ctrl+Shift+X → digitar `@recommended` → devem aparecer 4 extensoes
3. Criar um arquivo `teste.js` com codigo mal formatado:
   ```javascript
   const x=1;const y    =2
   ```
4. Salvar (Ctrl+S) — Prettier deve formatar automaticamente:
   ```javascript
   const x = 1
   const y = 2
   ```
   (sem ponto-e-virgula, porque `semi: false`)
5. Se formatou, tudo esta configurado corretamente. Deletar `teste.js`.