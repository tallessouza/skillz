# Code Examples: Fonte Externa + CSP no Electron

## Exemplo completo do index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  />
  <title>Meu App Electron</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <h1>Hello Electron</h1>
</body>
</html>
```

## Ordem dos elementos no head

```html
<head>
  <!-- 1. charset primeiro -->
  <meta charset="UTF-8" />

  <!-- 2. preconnect logo depois (acelera DNS) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- 3. CSP meta tag -->
  <meta http-equiv="Content-Security-Policy" content="..." />

  <!-- 4. outros metas -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App</title>

  <!-- 5. link da fonte por ultimo no head -->
  <link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" />
</head>
```

## Evolucao progressiva do CSP

### Passo 1: CSP padrao do Electron (sem fontes externas)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
/>
```

### Passo 2: Adicionando style-src para Google Fonts CSS

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
/>
```

Resolve: `Refused to load the stylesheet`

### Passo 3: Adicionando font-src para arquivos de fonte

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
/>
```

Resolve: `Refused to load the font`

## Aplicando a fonte no CSS

```css
/* Em qualquer arquivo CSS da aplicacao */
body {
  font-family: 'Inter', sans-serif;
}
```

## Verificacao rapida via DevTools

```
1. View > Toggle Developer Tools (ou Ctrl+Shift+I)
2. F5 para recarregar
3. Aba Console — verificar se ha erros CSP
4. Aba Network — verificar se fontes carregaram (status 200)
5. Aba Elements — inspecionar elemento e verificar font-family computado
```

## Variacao: adicionando multiplas fontes externas

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src https://fonts.gstatic.com https://cdn.jsdelivr.net"
/>
```

Cada dominio adicional e separado por espaco dentro da mesma diretiva.