# Code Examples: Ferramentas e Ambiente

## Configuracao Base Completa (da aula)

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

## Variacao: Tela menor (laptop 13-14")

```json
{
  "chat.fontSize": 16,
  "editor.fontSize": 16,
  "terminal.integrated.fontSize": 14,
  "zenMode.hideActivityBar": true,
  "zenMode.centerLayout": false,
  "zenMode.fullScreen": false,
  "zenMode.hideLineNumbers": true,
  "zenMode.showTabs": "none",
  "zenMode.silentNotifications": true
}
```

## Variacao: Monitor grande (27"+)

```json
{
  "chat.fontSize": 20,
  "editor.fontSize": 20,
  "terminal.integrated.fontSize": 18,
  "zenMode.hideActivityBar": true,
  "zenMode.centerLayout": true,
  "zenMode.fullScreen": false,
  "zenMode.hideLineNumbers": true,
  "zenMode.showTabs": "none",
  "zenMode.silentNotifications": true
}
```

## Como acessar as configuracoes

### Via Command Palette
```
Windows/Linux: Ctrl+P → "> settings user"
Mac: Cmd+P → "> settings user"
Selecionar: "Preferences: Open User Settings (JSON)"
```

### Via menu
```
File → Preferences → Settings → icone de JSON no canto superior direito
```

## Como ativar Zen Mode manualmente

```
Windows/Linux: Ctrl+K Z
Mac: Cmd+K Z
```

Ou via Command Palette:
```
Ctrl+Shift+P → "View: Toggle Zen Mode"
```

## Como instalar extensao via terminal integrado

```bash
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

## Profile limpo (alternativa ao Insiders)

Em vez de usar o Insiders como Mayk, crie um profile limpo:
```
File → Preferences → Profiles → Create Profile
Nome: "Estudo" ou "Clean"
Desmarcar todas as extensoes
Aplicar as configuracoes JSON acima
```

Isso da o mesmo efeito de "ambiente limpo" sem precisar de outro editor.