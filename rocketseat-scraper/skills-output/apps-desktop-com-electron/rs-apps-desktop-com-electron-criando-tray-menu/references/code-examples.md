# Code Examples: Criando Tray Menu no Electron

## Exemplo 1: Tray basico (estrutura minima)

```typescript
// tray.ts
import { app, Tray, Menu } from 'electron'
import path from 'node:path'

app.whenReady().then(() => {
  const tray = new Tray(path.resolve(__dirname, 'RotionTemplate.png'))

  const menu = Menu.buildFromTemplate([
    { label: 'Rotion' },
  ])

  tray.setContextMenu(menu)
})
```

```typescript
// main.ts — importar o tray
import './tray'
```

## Exemplo 2: Menu com multiplos itens e tipos

```typescript
app.whenReady().then(() => {
  const tray = new Tray(path.resolve(__dirname, 'RotionTemplate.png'))

  const menu = Menu.buildFromTemplate([
    { label: 'Rotion' },
    { label: 'Rotion' },
    { label: 'Rotion' },
    { label: 'Rotion', enabled: false },  // item desabilitado (cinza)
    { type: 'separator' },                // linha divisoria
    { label: 'Ativar modo dark', type: 'checkbox' },  // toggle com check
  ])

  tray.setContextMenu(menu)
})
```

## Exemplo 3: Usando NativeImage (alternativa)

```typescript
import { app, Tray, Menu, nativeImage } from 'electron'
import path from 'node:path'

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(
    path.resolve(__dirname, 'RotionTemplate.png')
  )
  const tray = new Tray(icon)

  const menu = Menu.buildFromTemplate([
    { label: 'Rotion' },
  ])

  tray.setContextMenu(menu)
})
```

O instrutor testou ambas as abordagens e confirmou que passar o path direto como string tambem funciona, sendo mais simples.

## Estrutura de arquivos para icones

```
resources/
├── RotionTemplate.png      # 16x16 (1x)
├── RotionTemplate@2x.png   # 32x32 (2x)
└── RotionTemplate@3x.png   # 48x48 (3x)
```

### Regras do Figma para exportacao:
1. Selecionar o icone no Figma
2. Definir altura ou largura (o que for maior) como 16px
3. Exportar em 3 escalas: 1x, 2x, 3x
4. O Figma calcula automaticamente: 16px, 32px, 48px

## Tipos de menu item disponiveis

```typescript
// Todas as opcoes de type que o TypeScript mostra:
Menu.buildFromTemplate([
  { label: 'Normal', type: 'normal' },        // padrao
  { label: 'Toggle', type: 'checkbox' },       // checkbox
  { label: 'Opcao A', type: 'radio' },         // radio
  { type: 'separator' },                        // divisor
  {
    label: 'Submenu',
    submenu: [                                   // submenu aninhado
      { label: 'Sub item 1' },
      { label: 'Sub item 2' },
    ]
  },
])
```

## Propriedades uteis de menu items

```typescript
{
  label: 'Texto visivel',
  enabled: false,          // cinza, nao clicavel
  type: 'checkbox',        // com check toggle
  // Outras propriedades disponiveis:
  // click: () => {},      // handler de clique (proxima aula)
  // icon: nativeImage,    // icone ao lado do item
  // accelerator: 'CmdOrCtrl+Q',  // atalho de teclado
  // visible: true,        // mostrar/esconder
}
```