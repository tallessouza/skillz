---
name: rs-discover-configurando-o-vscode
description: "Applies VSCode configuration for Rocketseat web development projects. Use when user asks to 'setup VSCode', 'configure editor', 'start a new web project', 'install extensions', or 'configure prettier'. Sets up .vscode folder with settings.json and extensions.json following Rocketseat standards. Make sure to use this skill whenever setting up a new HTML/CSS/JS project environment. Not for backend-specific IDE configs, Vim/Neovim setup, or JetBrains IDEs."
---

# Configurando o VSCode para Projetos Web

> Configurar o VSCode com extensoes, tema e formatacao automatica antes de comecar a codar.

## Prerequisites

- Visual Studio Code instalado
- Git Bash instalado (Windows)
- Se extensoes nao aparecerem: verificar conexao com internet e reabrir o VSCode

## Steps

### Step 1: Instalar extensoes

Instalar estas 4 extensoes pelo painel de extensoes (Ctrl+Shift+X):

1. **Live Server** (`ritwickdey.LiveServer`) — servidor local com reload automatico
2. **Omni Theme** (`rocketseat.theme-omni`) — tema visual da Rocketseat
3. **Material Icon Theme** (`PKief.material-icon-theme`) — icones para arquivos no explorer
4. **Prettier** (`esbenp.prettier-vscode`) — formatacao automatica de codigo

Apos instalar Omni Theme, clicar em "Set Color Theme". Apos Material Icon Theme, clicar em "Set File Icon Theme".

### Step 2: Criar pasta do projeto

Criar uma pasta para o projeto e abrir no VSCode (arrastar a pasta para o editor ou File > Open Folder).

### Step 3: Criar .vscode/settings.json

Criar a pasta `.vscode` na raiz do projeto. Dentro dela, criar `settings.json`:

```json
{
  "editor.wordWrap": "on",
  "editor.fontSize": 18,
  "editor.lineHeight": 30,
  "editor.tabSize": 2,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "explorer.compactFolders": false,
  "workbench.editor.enablePreview": false,
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "Omni",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.enable": true,
  "prettier.singleQuote": false,
  "prettier.tabWidth": 2,
  "prettier.semi": false,
  "terminal.integrated.fontSize": 16,
  "terminal.integrated.profiles.windows": {
    "Git Bash": {
      "source": "Git Bash"
    }
  },
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

### Step 4: Criar .vscode/extensions.json

Na mesma pasta `.vscode`, criar `extensions.json`:

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

## Output format

```
projeto/
└── .vscode/
    ├── settings.json
    └── extensions.json
```

## Verification

- Digitar `@recommended` na barra de busca de extensoes — deve listar as 4 extensoes
- Tema escuro Omni ativo
- Icones do Material Icon Theme visiveis no explorer
- Salvar um arquivo deve formatar automaticamente (Prettier)

## Error handling

- Se o tema nao aplicar: Ctrl+Shift+P > "Color Theme" > selecionar "Omni"
- Se formatacao nao funcionar ao salvar: verificar que `"editor.formatOnSave": true` esta no settings.json e Prettier esta instalado
- Se nomes de arquivo estiverem errados (`Settings.json` em vez de `settings.json`), as configuracoes nao serao aplicadas — nomes sao case-sensitive

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Configurar settings no User Settings global | Usar `.vscode/settings.json` por projeto, porque cada projeto pode ter configs diferentes |
| Instalar extensoes sem extensions.json | Criar extensions.json com recommendations, porque facilita onboarding de outros devs |
| Ignorar erros de nome de arquivo | Verificar exatamente: `settings.json`, `extensions.json`, `.vscode` — tudo minusculo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada configuracao e por que ela existe
- [code-examples.md](references/code-examples.md) — Arquivos de configuracao completos com variacoes