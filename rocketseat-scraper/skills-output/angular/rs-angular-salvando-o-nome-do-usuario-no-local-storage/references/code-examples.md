# Code Examples: Persistencia de Estado com localStorage em Angular

## Exemplo completo do UserInfosStore

```typescript
// user-infos.store.ts
import { Injectable, signal, computed } from '@angular/core';

interface UserInfos {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserInfosStore {
  // Chave centralizada — evita typos
  private readonly userNameKey = 'user-name';

  // Signal principal com dados completos do usuario
  user = signal<UserInfos | undefined>(undefined);

  // Computed reativo com fallback para localStorage
  username = computed(() => {
    const hasUser = this.user();

    if (!hasUser) {
      // Pagina recarregou — signal vazio, tenta localStorage
      const usernameLocalStorage = localStorage.getItem(this.userNameKey);

      if (usernameLocalStorage) {
        return usernameLocalStorage;
      }
      // Nao tem nem no localStorage — retorna vazio (nao quebra)
      return '';
    }

    // Usuario em memoria — usa direto
    return hasUser.name;
  });

  // Salva em memoria E persiste no localStorage
  setUserInfos(user: UserInfos) {
    this.user.set(user);
    localStorage.setItem(this.userNameKey, user.name);
  }

  // Limpa localStorage no logout
  removeUser() {
    localStorage.removeItem(this.userNameKey);
  }
}
```

## Consumo no Header Component (TypeScript)

```typescript
// header.component.ts
import { Component, inject } from '@angular/core';
import { UserInfosStore } from './user-infos.store';

@Component({ ... })
export class HeaderComponent {
  userInfoStore = inject(UserInfosStore);

  logout() {
    this.userInfoStore.removeUser();
    // ... navegar para login, limpar sessao, etc.
  }
}
```

## Consumo no Header Template

```html
<!-- header.component.html -->
<!-- Antes: acessava user().name diretamente — quebrava no reload -->
<!-- Depois: usa computed username() com fallback -->

<span>Logado como {{ userInfoStore.username() }}</span>

<!-- Ou em outro local -->
<p>Olá, {{ userInfoStore.username() }}</p>
```

## Fluxo completo: Login → Reload → Logout

```
1. Usuario faz login
   → setUserInfos({ name: 'Felipe', email: 'felipe@teste.com' })
   → signal user = { name: 'Felipe', email: 'felipe@teste.com' }
   → localStorage['user-name'] = 'Felipe'
   → computed username() = 'Felipe' (via signal)

2. Usuario recarrega a pagina (F5)
   → signal user = undefined (memoria zerada)
   → computed username() verifica: hasUser = undefined
   → busca localStorage['user-name'] = 'Felipe'
   → retorna 'Felipe' ✓

3. Usuario faz logout
   → removeUser()
   → localStorage['user-name'] removido
   → navega para tela de login

4. Alguem remove manualmente do DevTools
   → localStorage['user-name'] deletado
   → computed username() verifica: hasUser = undefined
   → localStorage.getItem retorna null
   → retorna '' (string vazia, app nao quebra) ✓
```