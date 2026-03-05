# Code Examples: Iframe Sandbox

## Exemplo da aula: setup completo

### iframe.html (conteudo carregado no iframe)

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Link que abre popup -->
  <a href="iframe.html" target="_blank">Abrir o pop-up</a>

  <!-- JavaScript sendo executado -->
  <script>
    document.write('<h1>Hello World</h1>')
  </script>

  <!-- Formulario que submete -->
  <form action="">
    <button type="submit">Enviar o formulário</button>
  </form>
</body>
</html>
```

### index.html — sem sandbox (vulneravel)

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Tudo funciona: JS executa, popups abrem, forms submetem -->
  <iframe src="iframe.html"></iframe>
</body>
</html>
```

### index.html — com sandbox vazio (tudo bloqueado)

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Nada funciona: JS bloqueado, popups bloqueados, forms bloqueados -->
  <iframe src="iframe.html" sandbox></iframe>
</body>
</html>
```

### index.html — liberando apenas popups

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Apenas popups funcionam -->
  <iframe src="iframe.html" sandbox="allow-popups"></iframe>
</body>
</html>
```

### index.html — liberando popups e scripts

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Popups e JavaScript funcionam, forms bloqueados -->
  <iframe src="iframe.html" sandbox="allow-scripts allow-popups"></iframe>
</body>
</html>
```

### index.html — liberando popups, scripts e forms

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Popups, JavaScript e forms funcionam -->
  <iframe src="iframe.html" sandbox="allow-scripts allow-popups allow-forms"></iframe>
</body>
</html>
```

## Cenarios reais de aplicacao

### Preview de HTML do usuario (CMS)

```html
<!-- Usuario fez upload de um template HTML, mostrando preview seguro -->
<iframe
  src="/api/user-templates/preview/{{ templateId }}"
  sandbox
  title="Preview do template"
  width="100%"
  height="400"
></iframe>
```

### Widget de chat de terceiro (precisa de JS)

```html
<!-- Widget externo que precisa executar scripts mas nao deve navegar -->
<iframe
  src="https://chat-widget.example.com/embed"
  sandbox="allow-scripts allow-forms"
  title="Chat de suporte"
></iframe>
```

### Formulario de pagamento embarcado

```html
<!-- Gateway de pagamento precisa de scripts e forms -->
<iframe
  src="https://payment.gateway.com/checkout"
  sandbox="allow-scripts allow-forms allow-popups"
  title="Formulario de pagamento"
></iframe>
```

### Email HTML preview (webmail)

```html
<!-- Visualizacao de email HTML — bloqueia absolutamente tudo -->
<iframe
  srcdoc="{{ sanitizedEmailHtml }}"
  sandbox
  title="Visualizacao do email"
></iframe>
```

## React: componente de preview seguro

```tsx
interface SafePreviewProps {
  src: string
  permissions?: string[]
}

function SafePreview({ src, permissions = [] }: SafePreviewProps) {
  const sandboxValue = permissions.length > 0
    ? permissions.join(' ')
    : undefined

  return (
    <iframe
      src={src}
      sandbox={sandboxValue ?? ''}
      title="Preview seguro"
      style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
    />
  )
}

// Uso: bloqueia tudo
<SafePreview src="/user-content/page.html" />

// Uso: libera apenas scripts
<SafePreview src="/user-content/page.html" permissions={['allow-scripts']} />
```