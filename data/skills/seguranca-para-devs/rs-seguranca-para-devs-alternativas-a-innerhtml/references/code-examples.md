# Code Examples: Alternativas a innerHTML

## Exemplo 1: Codigo vulneravel (innerHTML com dados dinamicos)

Este e o exemplo inicial do instrutor, mostrando o problema:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="results"></div>
  <script>
    async function go() {
      const response = await fetch('cars.json');
      const cars = await response.json();

      let output = '';
      for (const car of cars) {
        output += `<p><b>${car.model}</b> (${car.year})</p>`;
      }
      document.querySelector('#results').innerHTML = output;
    }
    go();
  </script>
</body>
</html>
```

### Dados maliciosos no JSON:

```json
[
  { "model": "Fusca", "year": 1970 },
  { "model": "<span onmouseover=\"alert('hacked')\">Gol</span>", "year": 2005 },
  { "model": "Palio", "year": 2012 }
]
```

**Resultado:** ao passar o mouse sobre "Gol", o alert e executado.

## Exemplo 2: innerText (seguro, mas sem HTML)

```javascript
document.querySelector('#results').innerText = output;
```

**Resultado:** todo o HTML aparece como texto literal na tela: `<p><b>Fusca</b> (1970)</p>`. Seguro, mas nao renderiza a estrutura.

## Exemplo 3: Safe sinks (seguro com estrutura HTML)

```javascript
async function go() {
  const response = await fetch('cars.json');
  const cars = await response.json();

  const results = document.querySelector('#results');
  results.innerHTML = ''; // limpar: seguro (string literal)

  for (const car of cars) {
    const p = document.createElement('p');
    const b = document.createElement('b');
    b.innerText = car.model;       // innerText no elemento criado
    const t = document.createTextNode(` (${car.year})`);
    p.appendChild(b);
    p.appendChild(t);
    results.appendChild(p);
  }
}
```

**Resultado:** a estrutura HTML e criada corretamente (negrito funciona), mas dados maliciosos em `car.model` sao tratados como texto puro pelo innerText.

## Exemplo 4: setAttribute para adicionar classes/atributos

```javascript
const b = document.createElement('b');
b.innerText = car.model;
b.setAttribute('class', 'car-name');
// Tambem pode usar: b.classList.add('car-name');
```

## Exemplo 5: Vetor de ataque obscuro (tagged template literal)

```javascript
// Isso executa a funcao alert!
alert`1`

// Equivalente a:
alert(['1'])
```

O instrutor usa este exemplo para demonstrar que escapar HTML manualmente e insuficiente — existem vetores de ataque que a maioria dos devs desconhece.

## Exemplo 6: DOMPurify

```javascript
import DOMPurify from 'dompurify';

// HTML malicioso
const dirty = '<a href="https://example.com" onmouseover="alert(1)">Click me</a>';

// DOMPurify remove o onmouseover
const clean = DOMPurify.sanitize(dirty);
// Resultado: '<a href="https://example.com">Click me</a>'

element.innerHTML = clean;
```

## Resumo dos 4 metodos seguros do DOM

| Metodo | O que faz | Quando usar |
|--------|-----------|-------------|
| `document.createElement('tag')` | Cria um elemento HTML | Construir estrutura |
| `document.createTextNode('texto')` | Cria um no de texto puro | Inserir texto sem tag |
| `element.appendChild(node)` | Adiciona filho a um elemento | Montar a arvore DOM |
| `element.setAttribute('attr', 'val')` | Define atributo no elemento | Adicionar class, id, href, etc. |

## Hierarquia de decisao (flowchart)

```
Preciso atualizar o DOM com dados dinamicos?
│
├─ So texto, sem HTML? ──────────────── innerText ✓
│
├─ Preciso de estrutura HTML? ───────── Safe sinks (createElement + appendChild) ✓
│
├─ Estrutura complexa demais? ──────── Template Engine (Mustache, Handlebars) ✓
│
├─ Ja uso framework? ───────────────── Use o template do framework ✓
│
└─ Preciso renderizar HTML externo? ── DOMPurify.sanitize() + innerHTML ✓
```