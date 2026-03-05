# Code Examples: Feature Based Components

## Estrutura inicial (antes da organizacao)

```
app/
├── components/
│   ├── header/
│   ├── main-content/
│   ├── task-card/
│   ├── task-comments-modal/
│   ├── task-form-modal/
│   ├── task-list-section/
│   └── welcome-section/
├── enums/
├── interfaces/
│   ├── comment.interface.ts
│   ├── task.interface.ts
│   ├── task-form-controls.interface.ts
│   └── task-form-modal-data.interface.ts
├── services/
│   ├── task.service.ts
│   └── modal-controller.service.ts
├── types/
│   └── task-status.type.ts
└── utils/
    └── generate-id.ts
```

## Estrutura final (Feature Based Components)

```
app/
├── core/
│   ├── layout/
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.css
│   │   └── welcome-section/
│   │       ├── welcome-section.component.ts
│   │       ├── welcome-section.component.html
│   │       └── welcome-section.component.css
│   ├── services/
│   │   ├── task.service.ts
│   │   └── modal-controller.service.ts
│   └── interfaces/
│       ├── task-form-controls.interface.ts
│       └── task-form-modal-data.interface.ts
├── domain/
│   └── tasks/
│       ├── interfaces/
│       │   ├── task.interface.ts
│       │   └── comment.interface.ts
│       ├── enums/
│       │   └── task-category.enum.ts
│       └── types/
│           └── task-status.type.ts
├── shared/
│   └── utils/
│       └── generate-id.ts
└── tasks/
    └── components/
        ├── task-card/
        │   ├── task-card.component.ts
        │   ├── task-card.component.html
        │   └── task-card.component.css
        ├── task-list-section/
        │   ├── task-list-section.component.ts
        │   ├── task-list-section.component.html
        │   └── task-list-section.component.css
        ├── task-form-modal/
        │   ├── task-form-modal.component.ts
        │   ├── task-form-modal.component.html
        │   └── task-form-modal.component.css
        ├── task-comments-modal/
        │   ├── task-comments-modal.component.ts
        │   ├── task-comments-modal.component.html
        │   └── task-comments-modal.component.css
        └── main-content/
            ├── main-content.component.ts
            ├── main-content.component.html
            └── main-content.component.css
```

## Passo a passo da movimentacao

### Passo 1: Criar as pastas base
```bash
mkdir -p src/app/core/layout
mkdir -p src/app/core/services
mkdir -p src/app/core/interfaces
mkdir -p src/app/domain/tasks/interfaces
mkdir -p src/app/domain/tasks/enums
mkdir -p src/app/domain/tasks/types
mkdir -p src/app/shared/utils
mkdir -p src/app/tasks/components
```

### Passo 2: Mover componentes da feature
```bash
# Feature tasks — componentes especificos do dominio
mv src/app/components/task-list-section src/app/tasks/components/
mv src/app/components/task-form-modal src/app/tasks/components/
mv src/app/components/task-comments-modal src/app/tasks/components/
mv src/app/components/task-card src/app/tasks/components/
mv src/app/components/main-content src/app/tasks/components/
```

### Passo 3: Mover componentes de layout para core
```bash
mv src/app/components/header src/app/core/layout/
mv src/app/components/welcome-section src/app/core/layout/
```

### Passo 4: Mover services para core
```bash
mv src/app/services/task.service.ts src/app/core/services/
mv src/app/services/modal-controller.service.ts src/app/core/services/
```

### Passo 5: Mover tipagens para domain
```bash
mv src/app/interfaces/task.interface.ts src/app/domain/tasks/interfaces/
mv src/app/interfaces/comment.interface.ts src/app/domain/tasks/interfaces/
mv src/app/enums/ src/app/domain/tasks/enums/
mv src/app/types/ src/app/domain/tasks/types/
```

### Passo 6: Mover tipagens internas da core
```bash
mv src/app/interfaces/task-form-controls.interface.ts src/app/core/interfaces/
mv src/app/interfaces/task-form-modal-data.interface.ts src/app/core/interfaces/
```

### Passo 7: Mover utils para shared
```bash
mv src/app/utils/ src/app/shared/utils/
```

### Passo 8: Corrigir imports
Apos cada movimentacao, use o VSCode:
1. Abra cada arquivo com erro de import
2. Remova os imports com erro
3. Use "Add all missing imports" (Ctrl+Shift+P → "Add all missing imports")
4. Salve o arquivo

### Passo 9: Testar
```bash
ng serve
# Verificar no navegador: todas funcionalidades devem continuar funcionando
# Verificar console: sem erros
```

## Arvore de dependencias resultante

```
shared/        ← sem dependencias (folha)
  └── utils/

domain/        ← sem dependencias (folha)
  └── tasks/interfaces, enums, types

core/          ← depende de: domain, shared
  ├── layout/     ← pode importar de domain, shared
  ├── services/   ← pode importar de domain, shared
  └── interfaces/ ← sem dependencias externas

tasks/ (feature) ← depende de: core, domain, shared
  └── components/ ← pode importar de core, domain, shared
```

**Regra de dependencia (direcao permitida):**
```
feature → core → domain
feature → core → shared
feature → domain
feature → shared
core → domain
core → shared
shared → (nada)
domain → (nada)
```

**Nunca permitido:**
```
core → feature    ❌
domain → core     ❌
domain → feature  ❌
shared → core     ❌
shared → feature  ❌
```