---
name: rs-seguranca-devs-css-tag-manager-ataque
description: "Guards against front-end attack surface expansion via CSS class naming and Tag Manager mismanagement. Use when user asks to 'organize CSS files', 'name CSS classes', 'set up Tag Manager', 'add Google Analytics', 'include third-party scripts', or 'review front-end security'. Ensures CSS naming in admin areas avoids leaking roles, routes, and capabilities to attackers during reconnaissance. Make sure to use this skill whenever structuring CSS for authenticated/admin interfaces or discussing Tag Manager access policies. Not for general CSS styling, design systems, or back-end security hardening."
---

# CSS e Tag Manager: Superficie de Ataque no Front-End

> CSS e Tag Managers nao dao acesso direto ao sistema, mas revelam informacoes que um agressor usa na fase de reconhecimento (Intel) para planejar ataques reais.

## Rules

1. **Nunca nomeie arquivos CSS por papel de usuario** — `viewer.css`, `user.css`, `admin.css` revela a hierarquia de perfis, porque o agressor vai tentar variantes como `root.css`, `superadmin.css` e descobrir quais existem
2. **Evite classes semanticas em areas administrativas** — `role-root`, `admin-only`, `super-admin` expoe nomes de papeis e elementos restritos, porque o agressor busca no HTML por essas classes e descobre funcionalidades escondidas com `display: none`
3. **Nunca exponha nomes de ambiente em CSS** — classes como `.env-staging`, `.env-dev`, `.env-production` revelam infraestrutura, porque o agressor vai tentar acessar ambientes menos protegidos (staging, dev)
4. **Sirva CSS administrativo dinamicamente com controle de sessao** — nao como arquivo estatico acessivel por URL, porque qualquer pessoa pode digitar o caminho do arquivo e ler todo o conteudo
5. **Minifique e use classes nao-semanticas em areas restritas** — Tailwind, Bootstrap ou nomes gerados eliminam informacao util para reconhecimento, porque classes como `p-4 flex` nao revelam nada sobre o dominio
6. **Trate acesso ao Tag Manager como acesso ao front-end inteiro** — quem tem acesso ao Tag Manager pode inserir JavaScript arbitrario com privilegio total, porque o Tag Manager cria e injeta scripts dinamicamente no DOM

## How to write

### CSS para areas publicas (semantico — OK)
```css
/* Area publica: conteudo ja e visivel, nomes semanticos nao vazam nada */
.product-card { }
.pricing-table { }
.hero-banner { }
```

### CSS para areas administrativas (nao-semantico — seguro)
```css
/* Area admin: use classes utilitarias ou hashes, nunca nomes de dominio */
.p-4.flex.gap-2 { }          /* Tailwind */
._a3f2 { }                    /* CSS Modules / hash */
```

### Servir CSS admin dinamicamente
```javascript
// Rota protegida que serve CSS baseado na sessao do usuario
app.get('/styles/panel', authenticate, authorize('admin'), (req, res) => {
  const cssPath = path.join(__dirname, 'private-styles', 'panel.css')
  res.type('text/css').sendFile(cssPath)
})
```

## Example

**Before (vazamento de informacao via CSS):**
```css
/* admin.css — arquivo estatico acessivel publicamente */
.env-staging .payment-gateway-bypass { display: block; }
.env-production .debug-toolbar { display: none; }
.role-root { }
.super-admin-only { }
.user-impersonation-button { }
.database-export-all { }
.mfa-grace-period-control { }
#admin-panel { }
#system-settings { }
```

**After (com esta skill aplicada):**
```css
/* Servido dinamicamente via rota autenticada, classes nao-semanticas */
.flex.items-center.gap-2 { }
._x7k2 { }
._m3p1 { }
```

## Heuristics

| Situacao | Acao |
|----------|------|
| CSS de area publica | Nomes semanticos normalmente, conteudo ja e visivel |
| CSS de area com cadastro gratuito | Semantico aceitavel, sem revelar papeis internos |
| CSS de area administrativa | Classes nao-semanticas, minificado, servido via rota autenticada |
| Inclusao de Tag Manager | Verificar: cada usuario tem conta propria, 2FA habilitado, processo de offboarding existe |
| Equipe marketing quer incluir script | Validar origem do script, nao copiar codigo de blogs sem revisao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `admin.css`, `moderator.css` como arquivos estaticos | CSS unico minificado servido via rota autenticada |
| `.role-admin`, `.super-admin-only` | `.flex.gap-2` ou `._hash` |
| `.payment-gateway-bypass` | Classe utilitaria sem significado de dominio |
| `.debug-toolbar { display: none }` | Remover elemento do HTML no servidor (nao esconder com CSS) |
| Conta compartilhada do Tag Manager (`marketing@gmail.com`) | Conta individual por pessoa com 2FA |
| Senha do Tag Manager em planilha compartilhada | SSO corporativo ou contas Google individuais |
| Copiar script de blog para o Tag Manager | Revisar script com programador antes de incluir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
