# Code Examples: Prototype Pollution

## 1. Setup vulnerável completo (do instrutor)

```html
<!DOCTYPE html>
<html>
<head><title>Prototype Pollution Demo</title></head>
<body>
<script>
// Coleção de dados (poderia ser localStorage, MongoDB, etc.)
const pessoas = {
  1: { nome: 'Ana', idade: 25 },
  2: { nome: 'Bruno', idade: 30 },
  3: { nome: 'Carlos', idade: 35 },
  4: { nome: 'Diana', idade: 40 },
}

// DeepMerge VULNERÁVEL — não filtra __proto__
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

function updatePessoa(id, payload) {
  const novosDados = JSON.parse(payload)
  if (pessoas[id]) {
    pessoas[id] = deepMerge(pessoas[id], novosDados)
  }
}

// Uso normal:
updatePessoa('1', '{"idade": 26}')
// pessoas[1] = { nome: 'Ana', idade: 26 } ✓

// ATAQUE — Prototype Pollution:
updatePessoa('1', '{"idade": 34, "__proto__": {"admin": true}}')
// pessoas[1].admin → true
// pessoas[2].admin → true (!)
// ({}).admin → true (!)
</script>
</body>
</html>
```

## 2. Ataque de redirecionamento de backend

```javascript
const defaultConfig = {
  theme: 'light',
  backend: 'https://api.exemplo.com',
  autoSave: true,
}

const config = {
  theme: 'dark',
  autoSave: false,
  // backend NÃO definido — usa fallback
}

function getDetails(userId) {
  const endpoint = config.backend || defaultConfig.backend
  alert(`Chamando ${endpoint}/user/${userId}`)
  // fetch(endpoint + '/user/' + userId)
}

getDetails(1) // → "Chamando https://api.exemplo.com/user/1" ✓

// Atacante polui o protótipo:
updatePessoa('1', '{"idade": 34, "__proto__": {"backend": "https://sitehacker.com"}}')

getDetails(1) // → "Chamando https://sitehacker.com/user/1" ✗ HACKEADO!
// config.backend agora existe no protótipo, o fallback nunca é atingido
```

## 3. DeepMerge corrigido (solução do instrutor)

```javascript
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    // PROTEÇÃO: bloqueia propriedades de protótipo
    if (key === '__proto__') {
      console.warn('Tentativa de Prototype Pollution bloqueada!')
      continue
    }

    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

// Após a correção:
updatePessoa('1', '{"idade": 34, "__proto__": {"backend": "https://sitehacker.com"}}')
// pessoas[1].idade → 34 (atualizado normalmente)
// ({}).backend → undefined (protótipo intacto)
```

## 4. Versão robusta com todas as proteções

```typescript
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function safeDeepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>
): T {
  for (const key of Object.keys(source)) {
    if (DANGEROUS_KEYS.has(key)) {
      console.error(`[SECURITY] Prototype Pollution attempt blocked: key="${key}"`)
      // Em produção: enviar alerta para sistema de monitoramento
      continue
    }

    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      target[key] = safeDeepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}
```

## 5. Alternativas sem DeepMerge

```typescript
// Para objetos flat — spread é suficiente e seguro
function updateFlat(target: Record<string, any>, payload: string) {
  const { __proto__, constructor, prototype, ...safeData } = JSON.parse(payload)
  return { ...target, ...safeData }
}

// Para configs — Object.create(null) elimina o protótipo
const config = Object.create(null) as Record<string, string>
config.theme = 'dark'
config.backend = 'https://api.exemplo.com'
// config.__proto__ === undefined (não tem protótipo para poluir)

// Para validação explícita — allowlist de propriedades
function updatePessoaSeguro(id: string, payload: string) {
  const dados = JSON.parse(payload)
  const ALLOWED_KEYS = ['nome', 'idade', 'email']

  const safeUpdate: Record<string, any> = {}
  for (const key of ALLOWED_KEYS) {
    if (key in dados) {
      safeUpdate[key] = dados[key]
    }
  }

  pessoas[id] = { ...pessoas[id], ...safeUpdate }
}
```

## 6. Verificação com hasOwnProperty

```typescript
// O ataque de redirecionamento funciona porque o código
// não distingue propriedades próprias de herdadas

// VULNERÁVEL:
const endpoint = config.backend || defaultConfig.backend

// SEGURO:
const endpoint = Object.hasOwn(config, 'backend')
  ? config.backend
  : defaultConfig.backend
// Object.hasOwn ignora propriedades do protótipo
```