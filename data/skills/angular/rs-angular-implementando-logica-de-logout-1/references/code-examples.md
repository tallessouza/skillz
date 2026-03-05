# Code Examples: Implementando Lógica de Logout

## Exemplo completo do componente (parte relevante)

```typescript
// header.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserTokenStoreService } from '../../services/user-token-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly _userTokenStore = inject(UserTokenStoreService);
  private readonly _router = inject(Router);

  isMenuOpen = false;

  logout(): void {
    this._userTokenStore.removeToken();
    this._router.navigate(['/auth/login']);
  }
}
```

## Template — Menu maximizado

```html
<!-- Logo -->
<a href="#"><!-- SVG do logo --></a>

<!-- Nav links -->
<nav>
  <a class="... cursor-pointer">
    <!-- SVG --> <span>Explorar</span>
  </a>
  <a class="... cursor-pointer">
    <!-- SVG --> <span>Meus Favoritos</span>
  </a>
</nav>

<!-- Logout (maximizado) -->
<div>
  <span>Olá, Usuário</span>
  <button (click)="logout()" class="... cursor-pointer">
    <!-- SVG de logout -->
  </button>
</div>
```

## Template — Menu minimizado

```html
@if (isMenuOpen) {
  <nav>
    <a class="... cursor-pointer">
      <!-- SVG --> Explorar
    </a>
    <a class="... cursor-pointer">
      <!-- SVG --> Meus Filmes
    </a>
    <button (click)="logout()" class="... cursor-pointer">
      Sair
    </button>
  </nav>
}
```

## Service de token (referência)

```typescript
// user-token-store.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserTokenStoreService {
  private readonly TOKEN_KEY = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
```

## Variação: logout com confirmação

```typescript
logout(): void {
  // Se quiser adicionar confirmação antes de sair
  const confirmed = window.confirm('Deseja realmente sair?');
  if (confirmed) {
    this._userTokenStore.removeToken();
    this._router.navigate(['/auth/login']);
  }
}
```

## Variação: logout limpando todo o estado

```typescript
logout(): void {
  this._userTokenStore.removeToken();
  // Se houver outros estados para limpar
  this._cartStore.clear();
  this._favoritesStore.clear();
  this._router.navigate(['/auth/login']);
}
```