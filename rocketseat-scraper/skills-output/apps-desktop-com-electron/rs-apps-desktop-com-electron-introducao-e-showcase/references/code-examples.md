# Code Examples: Electron — Introducao e Showcase

## Nota

Esta aula e introdutoria e conceitual — nao contem exemplos de codigo. Os exemplos de codigo comecam nas aulas seguintes do curso.

## Arquitetura basica do Electron (referencia)

```
electron-app/
├── src/
│   ├── main/              # Processo principal (server-side, Node.js)
│   │   ├── index.ts       # Entry point do Electron
│   │   ├── tray.ts        # Menu de tray (perto do relogio)
│   │   └── ipc.ts         # Comunicacao entre processos
│   ├── renderer/          # Processo de renderizacao (client-side, React)
│   │   ├── App.tsx        # Componente principal React
│   │   ├── pages/         # Paginas da aplicacao
│   │   └── components/    # Componentes reutilizaveis
│   └── shared/            # Tipos e utilitarios compartilhados
├── resources/             # Icones, assets nativos
├── electron.vite.config.ts
└── package.json
```

## Duas camadas do Electron

```
┌─────────────────────────────────────┐
│         Processo Principal          │
│         (Main Process)              │
│                                     │
│  - Node.js completo                 │
│  - Acesso ao file system            │
│  - Tray menus, dock, notificacoes   │
│  - Comunicacao com SO               │
│  - "Backend" da aplicacao           │
└──────────────┬──────────────────────┘
               │ IPC (Inter-Process Communication)
┌──────────────▼──────────────────────┐
│       Processo de Renderizacao      │
│       (Renderer Process)            │
│                                     │
│  - HTML, CSS, JavaScript            │
│  - React e ecossistema              │
│  - Interface visual                 │
│  - "Frontend" da aplicacao          │
└─────────────────────────────────────┘
```

## Comparacao de tamanho de bundle

```
Electron app base:  ~200 MB
Tauri app base:     ~5-6 MB

# Electron inclui o Chromium + Node.js inteiro
# Tauri usa a webview nativa do SO
```