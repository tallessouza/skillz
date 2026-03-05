# Code Examples: Abra Pop-ups com noopener

## Demonstracao do instrutor no console do navegador

### Abrindo sem noopener (vulneravel)

```javascript
// No console do navegador, na pagina do W3Schools CSS tutorial:
open('https://www.w3schools.com')
// ou equivalente:
window.open('https://www.w3schools.com')

// Na nova aba aberta (F12 > Console):
opener
// → Window {window: Window, self: Window, ...}  (a janela pai!)

opener.location.href
// → "https://www.w3schools.com/css/..."  (URL da pagina original)

opener.alert('teste')
// → Mostra alert na aba original

opener.eval('codigo malicioso aqui')
// → Executa JavaScript arbitrario na aba original
```

### Abrindo com noopener (seguro)

```javascript
// No console do navegador:
open('https://www.w3schools.com', '_blank', 'noopener')

// Na nova aba aberta (F12 > Console):
opener
// → null  (sem acesso a janela pai)
```

### Combinando noopener com outras propriedades

```javascript
// noopener + dimensoes = pop-up sem chrome do navegador
open('https://www.w3schools.com', '_blank', 'noopener,width=600,height=400')
// Abre como pop-up real (sem abas, sem barra de endereco completa)
// E opener continua null
```

## Aplicacoes praticas

### Help desk / chat de suporte

```typescript
function openSupportChat() {
  window.open(
    'https://support.thirdparty.com/chat?token=abc123',
    'support-chat',
    'noopener,width=400,height=600'
  )
}
```

### Pagina institucional (FAQ, termos, privacidade)

```typescript
function openInstitutionalPage(slug: string) {
  window.open(
    `https://cms.example.com/pages/${slug}`,
    '_blank',
    'noopener'
  )
}

// Uso:
openInstitutionalPage('privacy-policy')
openInstitutionalPage('terms-of-use')
openInstitutionalPage('faq')
```

### Wrapper generico seguro para window.open

```typescript
function safeOpen(
  url: string,
  target = '_blank',
  features = ''
): Window | null {
  const safeFeatures = features.includes('noopener')
    ? features
    : features
      ? `noopener,${features}`
      : 'noopener'

  return window.open(url, target, safeFeatures)
}

// Sempre seguro, impossivel esquecer noopener:
safeOpen('https://external.com')
safeOpen('https://external.com', 'popup', 'width=800,height=600')
```

### ESLint: detectando window.open sem noopener

Se voce usa ESLint, pode configurar regras customizadas ou usar plugins de seguranca que detectam chamadas a `window.open` sem `noopener`. Isso transforma a regra de "lembrar de fazer" para "impossivel esquecer".