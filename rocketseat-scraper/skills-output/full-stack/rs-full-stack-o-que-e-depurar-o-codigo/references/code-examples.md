# Code Examples: Depuracao de Codigo

## Exemplo 1: Adicionando breakpoints no VS Code (JavaScript)

```javascript
// Suponha que este codigo tem comportamento inesperado:
// o desconto nao esta sendo aplicado corretamente

function calcularPrecoFinal(preco, desconto) {
  const valorDesconto = preco * desconto  // <- Adicione breakpoint aqui
  const precoFinal = preco - valorDesconto // <- E aqui
  return precoFinal
}

// O usuario passa desconto como 10 (pensando em 10%)
// mas a funcao espera 0.1
const resultado = calcularPrecoFinal(100, 10) // resultado: -900 (bug!)
```

### Como debugar:

1. Adicione breakpoint na linha `const valorDesconto = ...`
2. Execute o programa em modo debug (F5 no VS Code)
3. Quando pausar, inspecione: `preco = 100`, `desconto = 10`
4. Avance um passo (F10): `valorDesconto = 1000` — aqui voce ve o problema
5. A raiz: `desconto` deveria ser `0.1`, nao `10`

## Exemplo 2: Debug de fluxo condicional

```javascript
function classificarIdade(idade) {
  if (idade < 12) {
    return 'crianca'
  } else if (idade < 18) {
    return 'adolescente'
  } else if (idade < 60) {
    return 'adulto'
  } else {
    return 'idoso'
  }
}

// Bug reportado: pessoa com 18 anos esta sendo classificada como "adulto"
// mas o cliente quer que 18 seja "adolescente"

// Adicione breakpoint no primeiro if
// Execute com idade = 18
// Observe: entra no `else if (idade < 60)` — porque 18 nao e < 18
// Raiz encontrada: a condicao deveria ser `idade <= 18`
```

## Exemplo 3: Breakpoints em loop

```javascript
const produtos = [
  { nome: 'Camisa', preco: 50 },
  { nome: 'Calca', preco: 80 },
  { nome: 'Sapato', preco: null }, // dado corrompido
  { nome: 'Bone', preco: 30 },
]

function calcularTotal(produtos) {
  let total = 0
  for (const produto of produtos) {
    total += produto.preco // <- breakpoint aqui
  }
  return total
}

// resultado: NaN (bug!)
// Com breakpoint no loop, voce ve na 3a iteracao:
// produto.preco = null → total passa a ser NaN
// Raiz: dado corrompido no array
```

## Atalhos de debug no VS Code

| Acao | Atalho |
|------|--------|
| Iniciar debug | F5 |
| Step Over (proxima linha) | F10 |
| Step Into (entrar na funcao) | F11 |
| Step Out (sair da funcao) | Shift+F11 |
| Continuar ate proximo breakpoint | F5 |
| Adicionar/remover breakpoint | Clique na margem esquerda ou F9 |

## Exemplo 4: Inspecionando variaveis no Chrome DevTools

```javascript
// No navegador, abra DevTools (F12) > Sources
// Encontre o arquivo JS
// Clique no numero da linha para adicionar breakpoint

async function buscarUsuario(id) {
  const response = await fetch(`/api/users/${id}`) // breakpoint
  const data = await response.json()               // breakpoint
  return data.user                                  // breakpoint
}

// Ao pausar em cada breakpoint, o painel "Scope" mostra:
// - Variaveis locais e seus valores atuais
// - O painel "Watch" permite adicionar expressoes para monitorar
// - O painel "Call Stack" mostra como voce chegou ate ali
```