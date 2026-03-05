---
name: rs-angular-testando-o-interceptor
description: "Applies Angular HTTP interceptor testing patterns when debugging authentication flows. Use when user asks to 'test interceptor', 'debug auth header', 'validate token flow', 'check authorization header', or 'troubleshoot 401 errors' in Angular. Guides through local storage token setup, network inspection, and request header verification. Make sure to use this skill whenever testing or debugging Angular HTTP interceptors with Bearer tokens. Not for creating interceptors from scratch, writing unit tests, or backend token generation."
---

# Testando o Interceptor Angular

> Valide interceptors HTTP inspecionando headers de request no Network tab e iterando sobre estados do local storage.

## Fluxo de teste

### Step 1: Disparar a requisicao protegida

```typescript
// No componente de teste (temporario), injete o servico e dispare no ngOnInit
export class AppComponent implements OnInit {
  private userApi = inject(UserApiService);

  ngOnInit() {
    this.userApi.validateToken().subscribe({
      next: (response) => console.log(response),
      error: (err) => console.error(err)
    });
  }
}
```

### Step 2: Inspecionar sem token (local storage vazio)

| O que verificar | Onde | Resultado esperado |
|-----------------|------|--------------------|
| Console | DevTools > Console | Erro 401: "Token nao fornecido" |
| Request headers | DevTools > Network > Headers | Sem header Authorization |
| Response | DevTools > Network > Response | `{ message: "Token nao fornecido" }` |

### Step 3: Inspecionar com token invalido

1. Abrir DevTools > Application > Local Storage
2. Criar chave `auth-token` com valor qualquer (ex: `teste123`)
3. Refazer a requisicao

| O que verificar | Resultado esperado |
|-----------------|--------------------|
| Console | Erro 401: "Token invalido ou expirado" |
| Request headers | `Authorization: Bearer teste123` |

### Step 4: Inspecionar com token valido

1. Gerar token valido via API (Insomnia/Postman — endpoint de login)
2. Copiar o token retornado
3. Colar no Local Storage na chave `auth-token`
4. Refazer a requisicao

| O que verificar | Resultado esperado |
|-----------------|--------------------|
| Console | Response com sucesso (dados do usuario) |
| Network status | 200 OK |
| Request headers | `Authorization: Bearer {token-valido}` |

### Step 5: Limpar codigo de teste

Remover todo o codigo de teste do componente — o interceptor sera usado automaticamente nas rotas protegidas.

## Heuristics

| Situacao | Acao |
|----------|------|
| 401 sem header Authorization | Verificar local storage — token ausente, interceptor nao adicionou |
| 401 com header Authorization | Token expirado ou invalido — gerar novo token |
| Interceptor nao dispara | Verificar se esta registrado em `provideHttpClient(withInterceptors([...]))` |
| Token presente mas request falha | Verificar formato: deve ser `Bearer {espaco}{token}`, nao `Bearer{token}` |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Deixar codigo de teste no AppComponent | Usar apenas para validacao, remover depois |
| Testar interceptor sem inspecionar Network tab | Sempre verificar headers reais no Network |
| Hardcodar token no codigo fonte | Armazenar no local storage, interceptor adiciona automaticamente |
| Ignorar diferenca entre "nao fornecido" e "invalido" | Sao erros distintos — diagnosticar cada um separadamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
