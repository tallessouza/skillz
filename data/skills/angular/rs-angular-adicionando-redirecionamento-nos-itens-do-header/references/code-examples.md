# Code Examples: RouterLink e RouterLinkActive no Header

## Exemplo completo do nav principal (desktop)

```html
<!-- header.component.html — Nav principal -->
<nav>
  <!-- Explorar -->
  <a
    class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
    routerLink="/explore"
    routerLinkActive="!border-purple-400 font-bold text-white"
  >
    <svg class="h-5 w-5" routerLinkActive="text-purple-400">
      <!-- icone explorar -->
    </svg>
    Explorar
  </a>

  <!-- Meus Favoritos -->
  <a
    class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
    routerLink="/favorites"
    routerLinkActive="!border-purple-400 font-bold text-white"
  >
    <svg class="h-5 w-5" routerLinkActive="text-purple-400">
      <!-- icone favoritos -->
    </svg>
    Meus Favoritos
  </a>
</nav>
```

## Exemplo completo do menu minimizado (mobile)

```html
<!-- header.component.html — Menu minimizado -->
@if (isMenuOpen) {
<nav>
  <!-- Explorar -->
  <a
    class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
    routerLink="/explore"
    routerLinkActive="bg-white/10 font-bold border-l-4 border-purple-500 hover:bg-white/20 text-white"
  >
    <svg class="h-5 w-5" routerLinkActive="text-purple-400">
      <!-- icone explorar (sem text-purple-400 fixo) -->
    </svg>
    Explorar
  </a>

  <!-- Meus Favoritos -->
  <a
    class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
    routerLink="/favorites"
    routerLinkActive="bg-white/10 font-bold border-l-4 border-purple-500 hover:bg-white/20 text-white"
  >
    <svg class="h-5 w-5" routerLinkActive="text-purple-400">
      <!-- icone favoritos -->
    </svg>
    Meus Favoritos
  </a>
</nav>
}
```

## Import necessario no componente

```typescript
// header.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenuOpen = false;
}
```

## Variacao: usando routerLinkActive com opcoes avancadas

```html
<!-- Ativar apenas em match exato (util para rota raiz "/") -->
<a
  routerLink="/"
  routerLinkActive="text-white font-bold"
  [routerLinkActiveOptions]="{ exact: true }"
>
  Home
</a>
```

## Variacao: multiplos links compartilhando padrao

Quando varios links seguem o mesmo padrao de classes base e ativo, extraia para variaveis no componente ou use um pattern consistente:

```html
<!-- Padrao replicavel para cada item de navegacao -->
<a
  *ngFor="let item of navItems"
  class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
  [routerLink]="item.route"
  routerLinkActive="!border-purple-400 font-bold text-white"
>
  {{ item.label }}
</a>
```