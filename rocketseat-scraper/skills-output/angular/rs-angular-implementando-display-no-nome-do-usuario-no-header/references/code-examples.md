# Code Examples: Signal Store para Estado de Usuário

## Exemplo completo: UserInfosStore

```typescript
// core/services/user-infos-store.ts
import { Injectable, signal } from '@angular/core';
import { IUserInfos } from '../../shared/models/user-infos';

@Injectable({ providedIn: 'root' })
export class UserInfosStore {
  // Signal privado — ninguem de fora pode fazer .set()
  private readonly user = signal<IUserInfos | undefined>(undefined);

  // Exposicao read-only para consumidores
  userInfos = this.user.asReadOnly();

  // Unico ponto de mutacao
  setUserInfos(user: IUserInfos): void {
    this.user.set(user);
  }
}
```

## Interface do modelo

```typescript
// shared/models/user-infos.ts
export interface IUserInfos {
  id: number;
  name: string;
  email: string;
}
```

## Populando o store no login (UserApi service)

```typescript
// Dentro do service de API de usuario
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { UserInfosStore } from './user-infos-store';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly _userInfosStore = inject(UserInfosStore);

  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginResponse>('/api/login', credentials).pipe(
      tap(({ token }) => {
        localStorage.setItem('token', token);
      }),
      // Segundo tap separado para clareza
      tap(({ user: { id, name, email } }) => {
        this._userInfosStore.setUserInfos({ id, name, email });
      })
    );
  }
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
```

## Consumindo no Header component

```typescript
// header.component.ts
import { Component, inject } from '@angular/core';
import { UserInfosStore } from '../../core/services/user-infos-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // readonly sem private — template precisa acessar
  readonly _userInfosStore = inject(UserInfosStore);
}
```

```html
<!-- header.component.html -->
<!-- Desktop -->
<span>Olá, {{ _userInfosStore.userInfos()?.name }}</span>

<!-- Mobile menu -->
<span>Logado como {{ _userInfosStore.userInfos()?.name }}</span>
```

## Destructuring aninhado do response (explicacao detalhada)

```typescript
// O response da API tem esta estrutura:
// { token: "abc", user: { id: 1, name: "Felipe", email: "felipe@teste.com" } }

// Forma verbosa:
tap((response) => {
  const id = response.user.id;
  const name = response.user.name;
  const email = response.user.email;
  this._userInfosStore.setUserInfos({ id, name, email });
})

// Forma enxuta com destructuring aninhado:
tap(({ user: { id, name, email } }) => {
  this._userInfosStore.setUserInfos({ id, name, email });
})
```

## Alternativa: usando computed no componente

```typescript
// Se voce nao quiser acessar o store diretamente no template:
export class HeaderComponent {
  private readonly _userInfosStore = inject(UserInfosStore);

  // Computed baseado no signal do store
  userName = computed(() => this._userInfosStore.userInfos()?.name ?? '');
}
```

```html
<!-- Template mais limpo -->
<span>Olá, {{ userName() }}</span>
```

## Bug demonstrado: perda de estado ao recarregar

```
1. Usuario faz login → store populado → "Olá, Felipe" aparece
2. Usuario recarrega a pagina (F5)
3. Aplicacao reinicia → service recriado → signal = undefined
4. Header mostra vazio — nome perdido

Solucao: persistir em localStorage/sessionStorage (proxima aula)
```