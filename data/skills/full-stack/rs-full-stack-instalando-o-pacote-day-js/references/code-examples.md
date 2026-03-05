# Code Examples: Configuracao do Day.js

## Instalacao

```bash
# Versao especifica usada no curso
npm i dayjs@1.11.10

# Verifica no package.json — deve aparecer em "dependencies", NAO "devDependencies"
```

## Arquivo de configuracao: `src/libs/dayjs.js`

```javascript
import dayjs from "dayjs"
import "dayjs/locale/pt-br"

dayjs.locale("pt-br")
```

### Variacao: com plugins

```javascript
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import relativeTime from "dayjs/plugin/relativeTime"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.locale("pt-br")
```

### Variacao: multiplos locales

```javascript
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import "dayjs/locale/en"
import "dayjs/locale/es"

// Default para pt-br
dayjs.locale("pt-br")

// Uso pontual em outro locale:
// dayjs().locale("en").format("MMMM D, YYYY")
```

## Entry point: `src/main.js`

```javascript
// Configuracao do Dayjs
import "./libs/dayjs.js"

// ... resto das importacoes da aplicacao
```

## Teste de verificacao (temporario)

```javascript
// Adicionar no main.js para testar, REMOVER depois
import dayjs from "dayjs"

// Exibe horario
console.log(dayjs().format("HH:mm"))
// Output: "14:30"

// Exibe data e horario
console.log(dayjs().format("DD/MM HH:mm"))
// Output: "15/03 14:30"

// Exibe data completa no formato brasileiro
console.log(dayjs().format("DD/MM/YYYY HH:mm:ss"))
// Output: "15/03/2024 14:30:45"
```

## Estrutura de pastas resultante

```
src/
├── libs/
│   └── dayjs.js          # Config centralizada do dayjs
├── main.js               # Entry point — importa libs/dayjs.js
└── ... (resto da app)

package.json              # dayjs em "dependencies"
```

## Formatos comuns do day.js

```javascript
import dayjs from "dayjs"

dayjs().format("HH:mm")           // "14:30" (horario 24h)
dayjs().format("hh:mm")           // "02:30" (horario 12h)
dayjs().format("DD/MM/YYYY")      // "15/03/2024"
dayjs().format("dddd, D [de] MMMM") // "sexta-feira, 15 de marco" (com locale pt-br)
dayjs().format("YYYY-MM-DD")      // "2024-03-15" (ISO)
```