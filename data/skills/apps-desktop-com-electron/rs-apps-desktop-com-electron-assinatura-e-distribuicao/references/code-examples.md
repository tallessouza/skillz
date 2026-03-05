# Code Examples: Assinatura e Distribuição de Apps Electron

## Auto-update alternativo via GitHub Releases API

### Checando versao atual no package.json

```typescript
// main process - ao iniciar o app
import { app } from 'electron'

const currentVersion = app.getVersion() // le do package.json
```

### Consultando ultima release no GitHub

```typescript
interface GitHubRelease {
  tag_name: string
  html_url: string
}

async function checkForUpdates(): Promise<{ hasUpdate: boolean; releaseUrl: string } | null> {
  const owner = 'seu-usuario'
  const repo = 'seu-repo'

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )

  if (!response.ok) return null

  const release: GitHubRelease = await response.json()
  const latestVersion = release.tag_name.replace('v', '')
  const currentVersion = app.getVersion()

  if (latestVersion !== currentVersion) {
    return {
      hasUpdate: true,
      releaseUrl: release.html_url,
    }
  }

  return null
}
```

### Notificando o usuario no renderer

```typescript
// renderer process
import { shell } from 'electron'

function showUpdateModal(releaseUrl: string) {
  // Exibir modal com mensagem:
  // "Nova versao disponivel! Clique para baixar."
  // Ao clicar:
  shell.openExternal(releaseUrl)
}
```

### Fluxo completo no main process

```typescript
app.whenReady().then(async () => {
  createWindow()

  const updateInfo = await checkForUpdates()

  if (updateInfo?.hasUpdate) {
    // Enviar para renderer via IPC
    mainWindow.webContents.send('update-available', updateInfo.releaseUrl)
  }
})
```

## Configuracao basica do Electron Builder (package.json)

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "build": {
    "appId": "com.example.meuapp",
    "mac": {
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

## Semantic versioning para releases

```bash
# Patch (bug fix)
npm version patch  # 1.0.0 -> 1.0.1

# Minor (nova feature)
npm version minor  # 1.0.1 -> 1.1.0

# Major (breaking change)
npm version major  # 1.1.0 -> 2.0.0
```

## Estrutura de GitHub Release

```
Release v1.2.0
├── meu-app-1.2.0.dmg        (macOS)
├── meu-app-1.2.0-setup.exe  (Windows)
├── meu-app-1.2.0.AppImage   (Linux)
└── CHANGELOG.md
```