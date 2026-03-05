# Code Examples: Criando Rotas em Angular

## 1. Arquivo de rotas completo

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { CertificadosComponent } from './pages/certificados/certificados.component';
import { CertificadoFormComponent } from './pages/certificado-form/certificado-form.component';
import { CertificadoComponent } from './pages/certificado/certificado.component';

export const routes: Routes = [
  // Rota raiz — string vazia, sem barra
  { path: '', component: CertificadosComponent },

  // Rota de criacao — formulario de novo certificado
  { path: 'certificados/novo', component: CertificadoFormComponent },

  // Rota de item especifico — :id captura o parametro
  { path: 'certificados/:id', component: CertificadoComponent },
];
```

## 2. Template principal com router-outlet

```html
<!-- app.component.html -->
<!-- Componentes fixos (nao mudam com a rota) -->
<app-navbar />

<!-- Componente dinamico (muda de acordo com a rota) -->
<router-outlet />

<!-- Outro componente fixo -->
<app-base-layout />
```

## 3. Antes do router-outlet (manual)

```html
<!-- app.component.html — ANTES (troca manual) -->
<app-navbar />
<app-certificado-form />  <!-- Trocava manualmente para testar -->
<app-base-layout />
```

## 4. Comando de limpeza de imports

```bash
# Para aplicacao Angular — remove imports nao utilizados
ng generate @angular/core:cleanup-unused-imports
```

Saida esperada:
```
Scanning...
Removed 6 unused imports in app.component.ts
```

## 5. URLs resultantes

| URL | Componente renderizado |
|-----|----------------------|
| `http://localhost:4200/` | CertificadosComponent |
| `http://localhost:4200/certificados/novo` | CertificadoFormComponent |
| `http://localhost:4200/certificados/1` | CertificadoComponent |
| `http://localhost:4200/certificados/abc-uuid` | CertificadoComponent |

## 6. Explorando atributos de rota (Ctrl+Space)

O objeto de rota aceita muitos atributos alem de `path` e `component`. Os dois usados nesta aula:

```typescript
{
  path: string,      // Caminho da URL (sem barra inicial)
  component: Type,   // Componente Angular a ser renderizado
  // Outros atributos existem (guards, resolvers, lazy loading)
  // mas nao foram abordados nesta aula
}
```