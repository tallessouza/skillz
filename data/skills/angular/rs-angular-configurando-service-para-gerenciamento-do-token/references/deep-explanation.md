# Deep Explanation: Token Store Service

## Por que um service dedicado para o token?

O instrutor enfatiza que este service e "obrigatorio para a aplicacao funcionar, independente da feature". O token de autenticacao e um recurso transversal — interceptors precisam dele para anexar headers, guards precisam para proteger rotas, e o fluxo de logout precisa para limpar a sessao.

Colocar esse acesso direto ao `localStorage` espalhado pelo codigo cria acoplamento com a API do browser e duplicacao de strings magicas (a key do token). Se a key mudar, voce precisaria encontrar e atualizar em dezenas de lugares.

## Por que no core/ e nao em uma feature?

O instrutor coloca explicitamente dentro de `core/services/` porque:
- O token nao pertence a nenhuma feature especifica
- Interceptors (que sao globais) vao consumir esse service
- Guards (que protegem rotas de qualquer modulo) tambem precisam
- `providedIn: 'root'` garante singleton — uma unica instancia para toda a app

## Angular moderno: sem sufixos

O instrutor destaca que no Angular moderno nao se usa mais os prefixos/sufixos como `.service.ts`, `.component.ts` no nome do arquivo de services standalone. O nome deve ser auto-explicativo: `user-token-store.ts` ja comunica que e um store de tokens do usuario.

A convencao e: **nome do arquivo = nome da classe** (em formatos diferentes). `user-token-store.ts` → `UserTokenStore`.

## O padrao hasToken com dupla negacao

```typescript
hasToken(): boolean {
  return !!this.getToken();
}
```

`getToken()` retorna `string | null`. A dupla negacao (`!!`) converte para boolean:
- `null` → `false`
- `""` (string vazia) → `false`
- `"eyJhbG..."` (token valido) → `true`

Isso encapsula a logica de verificacao. Quem consome nao precisa saber que internamente e um `getItem` do localStorage.

## Private readonly para a key

O instrutor comeca com a string inline e depois refatora para `private readonly tokenKey`. Motivos:
- A key e usada em `saveToken`, `getToken`, `removeToken` — tres lugares
- Se precisar mudar (ex: de `alf-token` para `auth-token`), muda em um lugar so
- `readonly` garante que ninguem reatribui acidentalmente

## Onde este service sera usado

O instrutor menciona que sera consumido em:
1. **Interceptors HTTP** — para anexar `Authorization: Bearer {token}` em cada request
2. **Route Guards (canActivate)** — para verificar se usuario esta autenticado antes de permitir acesso
3. **Fluxo de login** — para salvar o token recebido do backend
4. **Fluxo de logout** — para remover o token e redirecionar