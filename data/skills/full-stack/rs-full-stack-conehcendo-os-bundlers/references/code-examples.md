# Code Examples: Conhecendo os Bundlers

## Exemplo 1: Antes e depois do bundler (da aula)

### Antes — 4 arquivos separados no HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script src="utils.js"></script>
  <script src="api.js"></script>
  <script src="components.js"></script>
  <script src="app.js"></script>
</head>
<body>
  <!-- conteudo -->
</body>
</html>
```

Problemas:
- 4 requisicoes HTTP separadas
- Ordem dos scripts importa (se `app.js` depende de `utils.js`, deve vir depois)
- Gerenciar ordem manualmente e fragil e propenso a erros

### Depois — arquivo unico bundled

```html
<!DOCTYPE html>
<html>
<head>
  <script src="bundle.js"></script>
</head>
<body>
  <!-- conteudo -->
</body>
</html>
```

Beneficios:
- 1 unica requisicao HTTP
- Ordem de dependencias resolvida automaticamente pelo bundler
- Dependencias transitivas incluidas sem intervencao manual

## Exemplo 2: Grafo de dependencias na pratica

### Estrutura de arquivos

```
src/
├── index.js          # entry point
├── auth/
│   ├── login.js      # importa validate.js
│   └── validate.js   # nao importa ninguem (folha)
├── api/
│   ├── client.js     # importa config.js
│   └── config.js     # nao importa ninguem (folha)
└── utils/
    └── format.js     # nao importa ninguem (folha)
```

### Codigo dos arquivos

```javascript
// index.js (entry point)
import { login } from './auth/login.js'
import { fetchData } from './api/client.js'
import { formatDate } from './utils/format.js'

// login.js
import { validateEmail } from './validate.js'
export function login(email, password) { /* ... */ }

// validate.js (folha — nao importa ninguem)
export function validateEmail(email) { /* ... */ }

// client.js
import { API_URL } from './config.js'
export function fetchData(endpoint) { /* ... */ }

// config.js (folha)
export const API_URL = 'https://api.example.com'

// format.js (folha)
export function formatDate(date) { /* ... */ }
```

### Grafo gerado pelo bundler

```
index.js
├── auth/login.js
│   └── auth/validate.js
├── api/client.js
│   └── api/config.js
└── utils/format.js
```

### Fase 1 — Resolucao de dependencias

O bundler comeca em `index.js` e descobre:
1. `index.js` importa `login.js`, `client.js`, `format.js`
2. `login.js` importa `validate.js`
3. `client.js` importa `config.js`
4. `validate.js`, `config.js`, `format.js` nao importam ninguem (folhas)

Mapa completo: 6 arquivos, 5 relacoes de dependencia.

### Fase 2 — Empacotamento (packing)

O bundler gera `bundle.js` contendo todos os 6 arquivos integrados, na ordem correta de dependencias (folhas primeiro, entry point por ultimo).

## Exemplo 3: Dependencia compartilhada (sem duplicacao)

```javascript
// moduleA.js
import { helper } from './shared.js'

// moduleB.js
import { helper } from './shared.js'

// index.js
import { doA } from './moduleA.js'
import { doB } from './moduleB.js'
```

Grafo:
```
index.js
├── moduleA.js
│   └── shared.js
└── moduleB.js
    └── shared.js  (ja mapeado!)
```

O bundler detecta que `shared.js` ja foi mapeado via `moduleA.js` e **nao o duplica** no bundle. O codigo de `shared.js` aparece uma unica vez no arquivo de saida, mesmo sendo importado por dois modulos diferentes.