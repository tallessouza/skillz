# Code Examples: RouterLink e RouterLinkActive

## Exemplo completo da aula

### Layout HTML (authentication layout)

```html
<div class="flex gap-2">
  <button
    routerLink="/login"
    routerLinkActive="bg-[#2C2C30] rounded font-medium text-purple-800 shadow"
    class="flex-1 py-2 text-sm text-gray-400 hover:text-white transition cursor-pointer">
    Login
  </button>
  <button
    routerLink="/register"
    routerLinkActive="bg-[#2C2C30] rounded font-medium text-purple-800 shadow"
    class="flex-1 py-2 text-sm text-gray-400 hover:text-white transition cursor-pointer">
    Cadastro
  </button>
</div>
```

### Component TypeScript

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {}
```

## Variacoes

### Com routerLinkActiveOptions para match exato

```html
<a
  routerLink="/dashboard"
  routerLinkActive="text-white border-b-2 border-purple-500"
  [routerLinkActiveOptions]="{ exact: true }"
  class="px-4 py-2 text-gray-400">
  Dashboard
</a>
```

Sem `exact: true`, a rota `/dashboard` ficaria ativa mesmo em `/dashboard/settings`. Com `exact: true`, so ativa no match exato.

### Navbar com multiplos links

```html
<nav class="flex gap-4">
  <a *ngFor="let item of menuItems"
    [routerLink]="item.path"
    routerLinkActive="font-bold text-white bg-gray-800 rounded-lg"
    class="px-3 py-1 text-gray-400 transition">
    {{ item.label }}
  </a>
</nav>
```

### Acessando estado ativo no TypeScript via template variable

```html
<a routerLink="/profile"
   routerLinkActive #rla="routerLinkActive"
   class="flex items-center gap-2">
  <span [class.font-bold]="rla.isActive">Perfil</span>
  <span *ngIf="rla.isActive" class="w-2 h-2 bg-green-500 rounded-full"></span>
</a>
```

A variavel `#rla` expoe a propriedade `isActive` para uso condicional no template.