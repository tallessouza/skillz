# Code Examples: VS Code + Extensoes para Angular

## Instalacao via linha de comando

### Instalar todas as extensoes de uma vez

```bash
# Extensoes obrigatorias
code --install-extension Angular.ng-template
code --install-extension EditorConfig.EditorConfig
code --install-extension Mikael.Angular-BeastCode

# Extensao opcional (visual)
code --install-extension PKief.material-icon-theme
```

### Script de setup para novos desenvolvedores

```bash
#!/bin/bash
# setup-angular-vscode.sh
# Instala extensoes essenciais para desenvolvimento Angular

echo "Instalando extensoes Angular para VS Code..."

extensions=(
  "Angular.ng-template"
  "EditorConfig.EditorConfig"
  "Mikael.Angular-BeastCode"
  "PKief.material-icon-theme"
)

for ext in "${extensions[@]}"; do
  code --install-extension "$ext" --force
  echo "  ✓ $ext instalado"
done

echo "Setup completo! Reinicie o VS Code."
```

## Arquivo .editorconfig padrao do Angular

Quando voce roda `ng new meu-projeto`, o Angular CLI gera este arquivo automaticamente:

```ini
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

A extensao EditorConfig for VS Code le este arquivo e aplica as configuracoes automaticamente.

## Verificacao do ambiente completo

```bash
# 1. Verificar Node
node --version
# Esperado: v18+ ou v20+

# 2. Verificar Angular CLI
ng version
# Esperado: Angular CLI 19.x

# 3. Verificar VS Code
code --version
# Esperado: qualquer versao recente

# 4. Verificar extensoes
code --list-extensions | grep -E "(Angular|EditorConfig|BeastCode|material-icon)"
# Esperado:
# Angular.ng-template
# EditorConfig.EditorConfig
# Mikael.Angular-BeastCode
# PKief.material-icon-theme
```

## Configuracao recomendada do VS Code para Angular

Apos instalar as extensoes, estas settings complementam o ambiente:

```jsonc
// .vscode/settings.json (na raiz do projeto)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "angular.enable.strict": true
}
```