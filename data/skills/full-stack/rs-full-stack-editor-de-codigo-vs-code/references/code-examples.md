# Code Examples: Editor de Código — VSCode

## URLs de referência

```
# Versão Stable (download principal)
https://code.visualstudio.com/

# Versão Insiders (download experimental)
https://code.visualstudio.com/insiders/

# Versão Web (sem instalação)
https://vscode.dev/
```

## Verificando instalação via terminal

```bash
# Verificar se o VSCode Stable está instalado
code --version

# Verificar se o VSCode Insiders está instalado
code-insiders --version
```

## Abrindo projetos pelo terminal

```bash
# Abrir pasta atual no VSCode Stable
code .

# Abrir pasta atual no VSCode Insiders
code-insiders .

# Abrir arquivo específico
code arquivo.ts
```

## Instalação via linha de comando (alternativas)

### Windows (winget)
```bash
# Stable
winget install Microsoft.VisualStudioCode

# Insiders
winget install Microsoft.VisualStudioCode.Insiders
```

### macOS (brew)
```bash
# Stable
brew install --cask visual-studio-code

# Insiders
brew install --cask visual-studio-code-insiders
```

### Linux (snap)
```bash
# Stable
sudo snap install code --classic

# Insiders
sudo snap install code-insiders --classic
```

## Dica: Side by Side

Ambos podem ser abertos simultaneamente. O Insiders usa ícone verde para diferenciação visual:

```
# Dois editores abertos ao mesmo tempo, sem conflito
code .              # Abre Stable (ícone azul)
code-insiders .     # Abre Insiders (ícone verde)
```

## Workflow recomendado pelo instrutor

```
1. Instalar Stable → usar para trabalho
2. (Opcional) Instalar Insiders → usar para aulas/experimentos
3. Se em computador alheio → abrir vscode.dev
4. Sempre commitar código no Git independente da edição usada
```