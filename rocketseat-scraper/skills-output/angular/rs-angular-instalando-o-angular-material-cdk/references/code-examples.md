# Code Examples: Instalando o Angular Material CDK

## Comando de instalacao

```bash
# Instalacao correta — CDK com versao fixa
npm install @angular/cdk@19.2.11
```

## Resultado no package.json

```json
{
  "dependencies": {
    "@angular/cdk": "19.2.11"
  }
}
```

## Comparacao: CDK vs Angular Material completo

```bash
# NAO usar para este projeto — instala tudo com temas
ng add @angular/material

# USAR — instala apenas primitivos sem estilizacao
npm install @angular/cdk@19.2.11
```

## Imports futuros (nao configurar agora, apenas referencia)

```typescript
// Drag and Drop — importar quando for implementar
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Dialog — importar quando for implementar modais
import { Dialog, DialogModule } from '@angular/cdk/dialog';
```

## Documentacao de referencia

- CDK completo: https://material.angular.dev/cdk/categories
- Drag and Drop: https://material.angular.dev/cdk/drag-drop/overview
- Dialog: https://material.angular.dev/cdk/dialog/overview
- Commit da aula: https://github.com/rocketseat-education/Projeto-GoTask/commit/61c3e0b045e16391ebaa17dccd8d6e939312df78