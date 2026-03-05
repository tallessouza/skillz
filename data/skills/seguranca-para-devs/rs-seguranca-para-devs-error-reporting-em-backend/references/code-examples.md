# Code Examples: Error Reporting Seguro em Backend

## Exemplo 1: PHP — Codigo que causa erro (demonstracao do instrutor)

### index.php
```php
<?php
include 'functions.php';
function1();
```

### functions.php
```php
<?php
function function1() {
    function2();
}

function function2() {
    // Divisao por zero — causa erro proposital
    $result = 1 / 0;
}
```

### Comportamento SEM configuracao (desenvolvimento)
O PHP exibe na tela:
```
Warning: Division by zero in /home/elcio/php/functions.php on line 9
```
Revelando: nome do usuario do sistema, caminho absoluto, nome do arquivo, numero da linha, e o call stack completo.

### php.ini para producao
```ini
error_reporting = 0
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
```

### Comportamento COM configuracao (producao)
O navegador exibe apenas: "Esta pagina nao esta funcionando — erro 500" (mensagem generica do navegador). O stack trace vai para o log do servidor.

---

## Exemplo 2: Ruby on Rails — Codigo que causa erro

### Criando a aplicacao
```bash
rails new ROR
cd ROR
rails db:create
```

### Controller com erro proposital
```ruby
# app/controllers/test_controller.rb
class TestController < ApplicationController
  def index
    1 / 0  # Divisao por zero
  end
end
```

### Em modo desenvolvimento
Rails exibe na pagina:
- Versao do Rails, Rack e Ruby
- Detalhes do sistema operacional (Linux, Intel 64 bits)
- Arquivo que deu erro com copia do codigo-fonte
- Informacoes sobre a requisicao
- Caminho absoluto dos arquivos

### Em modo producao
```bash
rails server -e production
```
Resultado: mensagem generica de erro na tela. Nos logs do terminal, o stack trace completo com todas as informacoes que o desenvolvedor precisa.

---

## Exemplo 3: Express.js — Middleware de erro correto

### ERRADO — vazando informacao
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Atacante ve tudo
  res.status(500).json({
    message: err.message,
    stack: err.stack,
    code: err.code,
    path: req.path,
  })
})
```

### CORRETO — log interno, resposta generica
```typescript
import { logger } from './lib/logger'

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Desenvolvedor ve tudo no log
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  })

  // Usuario/atacante ve apenas isso
  res.status(500).json({
    error: 'Internal server error',
  })
})
```

---

## Exemplo 4: Django — settings de producao

### ERRADO — settings.py unico
```python
DEBUG = True  # NUNCA em producao
```

### CORRETO — settings separados
```python
# settings/production.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['meusite.com', 'www.meusite.com']

LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## Exemplo 5: Teste de verificacao pos-deploy

```bash
# 1. Crie um endpoint de teste que causa erro
# 2. Acesse em producao
# 3. Verifique que a resposta NAO contem:
#    - Stack traces
#    - Caminhos de arquivos
#    - Versoes de framework
#    - Nomes de funcoes internas
#    - Informacoes do SO

# Teste rapido com curl
curl -s https://meusite.com/test-error | grep -i -E "(stack|trace|error_log|\.rb|\.php|\.py|version|debug)"

# Se retornar qualquer match, voce tem um vazamento
```

---

## Exemplo 6: API REST — padrao de resposta de erro

```typescript
// Respostas de erro padronizadas (sem detalhes tecnicos)

// 400 — erro do cliente
res.status(400).json({ error: 'Invalid request parameters' })

// 401 — nao autenticado
res.status(401).json({ error: 'Authentication required' })

// 403 — sem permissao
res.status(403).json({ error: 'Insufficient permissions' })

// 404 — nao encontrado
res.status(404).json({ error: 'Resource not found' })

// 500 — erro interno (NUNCA detalhes)
res.status(500).json({ error: 'Internal server error' })

// Se precisar de codigos internos para o frontend rastrear:
res.status(500).json({
  error: 'Internal server error',
  code: 'ERR_PROCESSING_FAILED',  // Codigo interno, sem detalhes tecnicos
  requestId: req.id,               // Para correlacionar com logs
})
```