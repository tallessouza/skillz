# Code Examples: O que são Pacotes

## Instalando pacotes com npm

### Instalacao basica
```bash
# Instalar um pacote como dependencia do projeto
npm install express

# Instalar como dependencia de desenvolvimento
npm install --save-dev jest

# Instalar globalmente (ferramentas CLI)
npm install -g typescript
```

### O que acontece ao instalar
```
projeto/
├── node_modules/       # Pacotes baixados ficam aqui
│   └── express/
├── package.json        # Registro das dependencias
└── package-lock.json   # Versoes exatas (lock file)
```

### package.json apos instalacao
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

## Usando pacote instalado

```javascript
// Importar o pacote instalado
const express = require('express')

// Usar a funcionalidade pronta
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000)
```

## Incluindo pacote via script (CDN)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Meu Projeto</title>
</head>
<body>
  <!-- Injetando pacote via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

  <script>
    // Agora axios esta disponivel globalmente
    axios.get('https://api.exemplo.com/dados')
      .then(response => console.log(response.data))
  </script>
</body>
</html>
```

## Gerenciando pacotes

```bash
# Ver pacotes instalados
npm list

# Atualizar pacotes
npm update

# Remover um pacote
npm uninstall express

# Verificar pacotes desatualizados
npm outdated

# Auditar vulnerabilidades de seguranca
npm audit
```

## Exemplo pratico: com pacote vs sem pacote

### SEM pacote (implementando do zero)
```javascript
// Formatar data manualmente
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

formatDate(new Date()) // "01/03/2026"
```

### COM pacote (usando date-fns)
```bash
npm install date-fns
```

```javascript
const { format } = require('date-fns')
const { ptBR } = require('date-fns/locale')

// Funcionalidade pronta, testada, com suporte a locales
format(new Date(), 'dd/MM/yyyy', { locale: ptBR }) // "01/03/2026"
format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) // "01 de março de 2026"
```

A versao com pacote oferece muito mais funcionalidades (locales, timezones, parsing) sem que voce precise implementar nada disso.